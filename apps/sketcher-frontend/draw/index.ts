import axios from "axios";
import { HTTP_BACKEND } from "../config";

export type Shape = ({
    type: "rect"
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle",
    x: number;
    y: number;
    radius: number;
} | {
    type: "arrow",
    x: number;
    y: number;
    endX: number;
    endY: number;
} | {
    type: "triangle",
    x: number;
    y: number;
    endX: number;
    endY: number;
} | {
    type: "pencil",
    points: { x: number; y: number }[];
} | {
    type: "text",
    x: number;
    y: number;
    text: string;
} | {
    type: "eraser",
    points: { x: number; y: number }[];
}) & { id?: string; color?: string; size?: number };

export type ToolMode = "rect" | "circle" | "arrow" | "triangle" | "pencil" | "text" | "eraser";

export function initDraw(canvas:HTMLCanvasElement, roomId: string, socket: WebSocket, getActiveTool: () => ToolMode, getActiveColor: () => string | null, getActiveSize: () => number | null, onRequireSelection: () => void){
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                return {
                    cleanup: () => {},
                    undo: () => {},
                    redo: () => {},
                    clear: () => {},
                    getShapes: () => []
                };
            }

            let existingShapes: Shape[] = [];
            let myDrawnShapeIds: string[] = [];
            let redoStack: Shape[] = [];
            let currentPencilPoints: { x: number; y: number }[] = [];
            let currentEraserPoints: { x: number; y: number }[] = [];

            // Fetch shapes in the background asynchronously
            getExistingShapes(roomId).then((shapes) => {
                // Prepend fetched shapes to preserve correct order and keep any locally drawn shapes
                existingShapes = [...shapes, ...existingShapes];
                clearCanvas(ctx, existingShapes, canvas);
            }).catch((err) => {
                console.error("[Draw] Error loading initial shapes:", err);
            });

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === "chat") {
                        const parsedShape = JSON.parse(message.message);
                        // Only push if it's a valid known shape
                        if (parsedShape && (
                            parsedShape.type === "rect" || 
                            parsedShape.type === "circle" ||
                            parsedShape.type === "arrow" ||
                            parsedShape.type === "triangle" ||
                            parsedShape.type === "pencil" ||
                            parsedShape.type === "text" ||
                            parsedShape.type === "eraser"
                        )) {
                            existingShapes.push(parsedShape);
                            clearCanvas(ctx, existingShapes, canvas);
                        }
                    } else if (message.type === "delete_shape") {
                        const shapeId = message.shapeId;
                        existingShapes = existingShapes.filter(s => s.id !== shapeId);
                        clearCanvas(ctx, existingShapes, canvas);
                    } else if (message.type === "clear_canvas") {
                        existingShapes = [];
                        myDrawnShapeIds = [];
                        redoStack = [];
                        clearCanvas(ctx, existingShapes, canvas);
                    }
                } catch (e) {
                    console.error("[Draw] Failed to parse incoming shape from socket:", e);
                }
            }
            clearCanvas(ctx,existingShapes,canvas);
            
            let activeTextInput: HTMLInputElement | null = null;

            let clicked = false;
            let startX = 0;
            let startY = 0;
            
            const handleMouseDown = (e: MouseEvent) => {
                const tool = getActiveTool();
                const color = getActiveColor() || undefined;
                const size = getActiveSize() || undefined;

                // Eraser does not require color selection (always black) but requires size selection!
                const isColorRequired = tool !== "eraser";
                if ((isColorRequired && color === undefined) || size === undefined) {
                    onRequireSelection();
                    return;
                }

                if (tool === "text") {
                    if (activeTextInput) {
                        activeTextInput.blur();
                    }

                    const inputX = e.clientX;
                    const inputY = e.clientY;
                    const activeColorVal = color || "#ffffff";
                    const activeSizeVal = size || 6;

                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Type text & press Enter...";
                    input.style.position = "absolute";
                    input.style.left = `${inputX}px`;
                    input.style.top = `${inputY - 10}px`;
                    input.style.background = "transparent";
                    input.style.border = "none";
                    input.style.outline = "none";
                    input.style.color = activeColorVal;
                    
                    const fontSize = activeSizeVal === 2 ? 14 : activeSizeVal === 6 ? 20 : activeSizeVal === 12 ? 28 : activeSizeVal === 20 ? 40 : 18;
                    input.style.font = `${fontSize}px sans-serif`;
                    input.style.zIndex = "1000";
                    input.style.width = "300px";
                    input.style.caretColor = activeColorVal;

                    if (canvas.parentElement) {
                        canvas.parentElement.appendChild(input);
                    }
                    
                    activeTextInput = input;
                    setTimeout(() => input.focus(), 50);

                    const commitText = () => {
                        const val = input.value.trim();
                        if (val) {
                            const shapeId = Math.random().toString(36).substring(2, 9);
                            const shape: Shape = {
                                id: shapeId,
                                type: "text",
                                x: inputX,
                                y: inputY,
                                text: val,
                                color: color,
                                size: size
                            };
                            existingShapes.push(shape);
                            myDrawnShapeIds.push(shapeId);
                            redoStack = [];

                            clearCanvas(ctx, existingShapes, canvas);

                            if (socket.readyState === WebSocket.OPEN) {
                                socket.send(JSON.stringify({
                                    type: "chat",
                                    message: JSON.stringify(shape),
                                    roomId
                                }));
                            }
                        }
                        cleanupInput();
                    };

                    const cleanupInput = () => {
                        if (input.parentElement) {
                            input.parentElement.removeChild(input);
                        }
                        if (activeTextInput === input) {
                            activeTextInput = null;
                        }
                    };

                    input.addEventListener("keydown", (ev) => {
                        if (ev.key === "Enter") {
                            commitText();
                        } else if (ev.key === "Escape") {
                            cleanupInput();
                        }
                    });

                    input.addEventListener("blur", () => {
                        setTimeout(() => {
                            if (activeTextInput === input) {
                                commitText();
                            }
                        }, 100);
                    });

                    return;
                }

                clicked = true;
                startX = e.clientX;
                startY = e.clientY;

                if (getActiveTool() === "pencil") {
                    currentPencilPoints = [{ x: startX, y: startY }];
                } else if (getActiveTool() === "eraser") {
                    currentEraserPoints = [{ x: startX, y: startY }];
                }
            };

            const handleMouseUp = (e: MouseEvent) => {
                if (getActiveTool() === "text") return;
                const currentX = e.clientX;
                const currentY = e.clientY;
                const width = currentX - startX;
                const height = currentY - startY;
                clicked = false;

                const tool = getActiveTool();
                const color = getActiveColor() || undefined;
                const size = getActiveSize() || undefined;
                let shape: Shape;
                const shapeId = Math.random().toString(36).substring(2, 9);

                if (tool === "pencil") {
                    if (currentPencilPoints.length < 2) return;
                    shape = {
                        id: shapeId,
                        type: "pencil",
                        points: currentPencilPoints,
                        color: color,
                        size: size
                    };
                    currentPencilPoints = [];
                } else if (tool === "eraser") {
                    if (currentEraserPoints.length < 2) return;
                    shape = {
                        id: shapeId,
                        type: "eraser",
                        points: currentEraserPoints,
                        color: "#000000",
                        size: size
                    };
                    currentEraserPoints = [];
                } else if (tool === "rect") {
                    if (Math.abs(width) < 2 || Math.abs(height) < 2) return;
                    shape = {
                        id: shapeId,
                        type: "rect",
                        x: startX,
                        y: startY,
                        width: width,
                        height: height,
                        color: color,
                        size: size
                    };
                } else if (tool === "circle") {
                    const radius = Math.sqrt(width * width + height * height);
                    if (radius < 2) return;
                    shape = {
                        id: shapeId,
                        type: "circle",
                        x: startX,
                        y: startY,
                        radius: radius,
                        color: color,
                        size: size
                    };
                } else if (tool === "arrow") {
                    if (Math.abs(width) < 2 && Math.abs(height) < 2) return;
                    shape = {
                        id: shapeId,
                        type: "arrow",
                        x: startX,
                        y: startY,
                        endX: currentX,
                        endY: currentY,
                        color: color,
                        size: size
                    };
                } else { // triangle
                    if (Math.abs(width) < 2 && Math.abs(height) < 2) return;
                    shape = {
                        id: shapeId,
                        type: "triangle",
                        x: startX,
                        y: startY,
                        endX: currentX,
                        endY: currentY,
                        color: color,
                        size: size
                    };
                }

                existingShapes.push(shape);
                myDrawnShapeIds.push(shapeId);
                redoStack = []; // Clear redo stack on new action

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify(shape),
                        roomId
                    }));
                } else {
                    console.warn("[Draw] Cannot send shape, socket is not open. State:", socket.readyState);
                }
            };

            const handleMouseMove = (e: MouseEvent) => {
                const tool = getActiveTool();
                const size = getActiveSize() || 2;

                if (tool === "text") return;

                const currentX = e.clientX;
                const currentY = e.clientY;

                if (tool === "eraser") {
                    if (clicked) {
                        currentEraserPoints.push({ x: currentX, y: currentY });
                    }

                    clearCanvas(ctx, existingShapes, canvas);

                    if (clicked && currentEraserPoints.length > 0) {
                        ctx.strokeStyle = "#000000";
                        ctx.lineWidth = size;
                        ctx.beginPath();
                        ctx.moveTo(currentEraserPoints[0].x, currentEraserPoints[0].y);
                        for (let i = 1; i < currentEraserPoints.length; i++) {
                            ctx.lineTo(currentEraserPoints[i].x, currentEraserPoints[i].y);
                        }
                        ctx.stroke();
                    }

                    // Circular guide representing the eraser radius
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(currentX, currentY, size / 2, 0, Math.PI * 2);
                    ctx.stroke();

                    return;
                }

                if (clicked){
                    const width = currentX - startX;
                    const height = currentY - startY;
                    
                    const color = getActiveColor() || "#ffffff";

                    if (tool === "pencil") {
                        currentPencilPoints.push({ x: currentX, y: currentY });
                        
                        clearCanvas(ctx, existingShapes, canvas);
                        ctx.strokeStyle = color;
                        ctx.lineWidth = size;
                        
                        if (currentPencilPoints.length > 0) {
                            ctx.beginPath();
                            ctx.moveTo(currentPencilPoints[0].x, currentPencilPoints[0].y);
                            for (let i = 1; i < currentPencilPoints.length; i++) {
                                ctx.lineTo(currentPencilPoints[i].x, currentPencilPoints[i].y);
                            }
                            ctx.stroke();
                        }
                        return;
                    }

                    clearCanvas(ctx,existingShapes,canvas);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = size;

                    if (tool === "rect") {
                        ctx.strokeRect(startX, startY, width, height);
                    } else if (tool === "circle") {
                        const radius = Math.sqrt(width * width + height * height);
                        ctx.beginPath();
                        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                        ctx.stroke();
                    } else if (tool === "arrow") {
                        // Draw temporary main line
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(currentX, currentY);
                        ctx.stroke();
                        
                        // Draw temporary arrowhead
                        const angle = Math.atan2(height, width);
                        const headLength = 15;
                        ctx.beginPath();
                        ctx.moveTo(currentX, currentY);
                        ctx.lineTo(currentX - headLength * Math.cos(angle - Math.PI / 6), currentY - headLength * Math.sin(angle - Math.PI / 6));
                        ctx.moveTo(currentX, currentY);
                        ctx.lineTo(currentX - headLength * Math.cos(angle + Math.PI / 6), currentY - headLength * Math.sin(angle + Math.PI / 6));
                        ctx.stroke();
                    } else if (tool === "triangle") {
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(2 * startX - currentX, currentY);
                        ctx.lineTo(currentX, currentY);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            };

            const handleMouseLeave = () => {
                if (getActiveTool() === "eraser") {
                    clearCanvas(ctx, existingShapes, canvas);
                }
            };

            canvas.addEventListener("mousedown", handleMouseDown);
            canvas.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mouseleave", handleMouseLeave);

            const undo = () => {
                if (myDrawnShapeIds.length === 0) return;
                const lastId = myDrawnShapeIds.pop();
                if (!lastId) return;

                const shapeIndex = existingShapes.findIndex(s => s.id === lastId);
                if (shapeIndex !== -1) {
                    const [removedShape] = existingShapes.splice(shapeIndex, 1);
                    redoStack.push(removedShape);
                    clearCanvas(ctx, existingShapes, canvas);

                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            type: "delete_shape",
                            shapeId: lastId,
                            roomId
                        }));
                    }
                }
            };

            const redo = () => {
                if (redoStack.length === 0) return;
                const restoredShape = redoStack.pop();
                if (!restoredShape) return;

                existingShapes.push(restoredShape);
                if (restoredShape.id) {
                    myDrawnShapeIds.push(restoredShape.id);
                }
                clearCanvas(ctx, existingShapes, canvas);

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify(restoredShape),
                        roomId
                    }));
                }
            };

            const clear = () => {
                existingShapes = [];
                myDrawnShapeIds = [];
                redoStack = [];
                clearCanvas(ctx, existingShapes, canvas);

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "clear_canvas",
                        roomId
                    }));
                }
            };

            return {
                cleanup: () => {
                    canvas.removeEventListener("mousedown", handleMouseDown);
                    canvas.removeEventListener("mouseup", handleMouseUp);
                    canvas.removeEventListener("mousemove", handleMouseMove);
                    canvas.removeEventListener("mouseleave", handleMouseLeave);
                    socket.onmessage = null;
                    if (activeTextInput && activeTextInput.parentElement) {
                        activeTextInput.parentElement.removeChild(activeTextInput);
                    }
                },
                undo,
                redo,
                clear,
                getShapes: () => existingShapes
            };
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.strokeStyle = shape.color || "rgba(255,255,255)";
    ctx.lineWidth = shape.size || 2;

    if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (shape.type === "arrow") {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(shape.endY - shape.y, shape.endX - shape.x);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(shape.endX, shape.endY);
        ctx.lineTo(shape.endX - headLength * Math.cos(angle - Math.PI / 6), shape.endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(shape.endX, shape.endY);
        ctx.lineTo(shape.endX - headLength * Math.cos(angle + Math.PI / 6), shape.endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    } else if (shape.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(2 * shape.x - shape.endX, shape.endY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.closePath();
        ctx.stroke();
    } else if (shape.type === "pencil") {
        if (shape.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
        }
    } else if (shape.type === "text") {
        ctx.fillStyle = shape.color || "rgba(255,255,255)";
        const size = shape.size || 2;
        const fontSize = size === 2 ? 14 : size === 6 ? 20 : size === 12 ? 28 : size === 20 ? 40 : 18;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(shape.text, shape.x, shape.y);
    } else if (shape.type === "eraser") {
        ctx.strokeStyle = "#000000";
        if (shape.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
        }
    }
}

function clearCanvas(ctx: CanvasRenderingContext2D, existingShapes: Shape[], canvas:HTMLCanvasElement){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    existingShapes.forEach((shape) => {
        drawShape(ctx, shape);
    });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        const messages: { message: string }[] = res.data.messages;

        if (!Array.isArray(messages)) {
            console.warn("[Draw] /chats returned unexpected data:", res.data);
            return [];
        }

        const shapes: Shape[] = [];
        for (const x of messages) {
            try {
                const parsed = JSON.parse(x.message);
                // Validate: only accept known shape types
                if (parsed && (
                    parsed.type === "rect" || 
                    parsed.type === "circle" ||
                    parsed.type === "arrow" ||
                    parsed.type === "triangle" ||
                    parsed.type === "pencil" ||
                    parsed.type === "text" ||
                    parsed.type === "eraser"
                )) {
                    shapes.push(parsed as Shape);
                }
            } catch (e) {
                // Skip any corrupt/non-shape message rows silently
                console.warn("[Draw] Skipping unparseable message from DB:", x.message);
            }
        }

        return shapes;
    } catch (e) {
        console.error("[Draw] Failed to fetch existing shapes from backend:", e);
        return [];
    }
}
"use client";
import { useSocket } from "../hooks/useSocket";
import { useState, useEffect } from "react";

export function ChatRoomClient({
    id,
    messages
}: {
    id: string,
    messages: {message: string}[];

}){
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();
    
    useEffect(()=>{
        if (socket && !loading){

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, parsedData.message])
                }
            }
        }
        return () => {
            socket?.close();
        }
    },[socket, loading, id])

    return <div>
        {chats.map(m => <div>{m.message}</div>)}
        <input type = "text" value={currentMessage} onChange={(e) => {
            setCurrentMessage(e.target.value)
        }}></input>
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                message: currentMessage,
                roomId: id
            }))
            setCurrentMessage("");
        }}>Send message</button>

    </div>
}
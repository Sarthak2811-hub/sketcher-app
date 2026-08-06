import { RoomCanvas } from "@/components/RoomCanvas";
import { HTTP_BACKEND } from "@/app/config";
import axios from "axios";

export default async function CanvasPage({params}:{
    params: Promise<{
        roomId: string;
    }>
}) { 
    const slug = (await params).roomId;
    
    const backendUrl = process.env.BACKEND_URL || HTTP_BACKEND;
    let roomDbId: string | null = null;
    try {
        console.log(`[Next.js Server] Fetching room details for slug: ${slug} from ${backendUrl}/room/${slug}`);
        const response = await fetch(`${backendUrl}/room/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.log(`[Next.js Server] Room fetch fallback for slug: ${slug} (${response.status})`);
        } else {
            const data = await response.json();
            if (data?.room) {
                roomDbId = String(data.room.id);
            }
        }
    } catch (e) {
        console.error("[Next.js Server] Error fetching room ID:", e);
    }

    const activeRoomId = roomDbId || slug;
    return <RoomCanvas roomId={activeRoomId}></RoomCanvas>
}
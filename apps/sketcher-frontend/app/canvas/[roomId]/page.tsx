import { RoomCanvas } from "@/components/RoomCanvas";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export default async function CanvasPage({params}:{
    params: Promise<{
        roomId: string;
    }>
}) { 
    const slug = (await params).roomId;
    
    let roomDbId: string | null = null;
    try {
        console.log(`[Next.js Server] Fetching room details for slug: ${slug} from ${HTTP_BACKEND}/room/${slug}`);
        const response = await fetch(`${HTTP_BACKEND}/room/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`[Next.js Server] Backend returned status ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            console.log(`[Next.js Server] Received room data:`, data);
            if (data?.room) {
                roomDbId = String(data.room.id);
            }
        }
    } catch (e) {
        console.error("[Next.js Server] Error fetching room ID:", e);
    }

    if (!roomDbId) {
        console.warn(`[Next.js Server] Room not found or backend request failed for slug: ${slug}`);
        return <div className="h-screen w-screen flex justify-center items-center text-white bg-[#0a0a0f] flex-col gap-2">
            <h1 className="text-2xl font-bold">Room not found</h1>
            <p className="text-white/40 text-sm">Please make sure the backend server is running and database is connected.</p>
        </div>
    }

    return <RoomCanvas roomId={roomDbId}></RoomCanvas>
}
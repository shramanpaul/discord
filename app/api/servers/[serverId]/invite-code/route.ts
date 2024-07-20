import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    console.log("PATCH request received");

    try {
        console.log("Server ID:", params.serverId);

        if (!params.serverId) {
            console.log("No serverId provided");
            return new NextResponse("Bad Request", { status: 400 });
        }

        const profile = await currentProfile();             //profile table

        if(!profile){
            console.log("Unauthorized: No profile");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("Current Profile:", profile);
        console.log("Server Id:", params.serverId);
        console.log("Profile Id:", profile.id);

        if (!profile) {
            console.log("Unauthorized: No profile");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const inviteCode = uuidv4();
        console.log("Generated Invite Code:", inviteCode);

        const server = await db.server.update({     //server table accessed
            where: {
                id: params.serverId,
                profileId: profile.id,   //error point my profileId inside server table is not same as profile.id (fix it)
            },
            data: {
                inviteCode: inviteCode,
            },
        });
        console.log("Server updated:", server);

        
        return NextResponse.json({ inviteCode: server.inviteCode });
    } catch (error) {
        console.log("Error updating server:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

import {v4 as uuidv4} from "uuid";
import { NextResponse } from "next/server";
import {currentProfile} from "@/lib/current-profile";

import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
//may have error in this file as server.profileId is not same as profile.id ( fix it )
export async function POST(req: Request) {
    try {
        const {name,imageUrl} = await req.json();
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        const server = await db.server.create({
            data:{
                profileId:profile.id, //now server.profileId is same as profile.id
                name,
                imageUrl,
                inviteCode:uuidv4(),
                channels:{
                    create:[{
                        name:"general",
                        profileId:profile.id,
                    }
                ]
                },
                members:{
                    create:[{
                        profileId:profile.id,
                        role:MemberRole.ADMIN,
                    }]
                }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("[SERVERS_POST]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}
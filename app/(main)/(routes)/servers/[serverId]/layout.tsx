import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerIdLayout = async({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        serverId: string;
    };
}) => {
    const profile= await currentProfile();

    // Redirect to sign in if user is not signed in
    if(!profile){                   
        return redirectToSignIn(); 
    }

    const server = await db.server.findUnique({
        where:{
            id: params.serverId,
            members:{
                some:{
                    profileId: profile.id,
                },
            }
        }
    });

    if(!server){
        return redirect("/");
    }
    return ( 
        <div className="h-full">
            <div className="hiddden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 ">
            <ServerSidebar serverId={params.serverId}/>
            </div>
            <main className="h-full md:pl-60">
            {children}
            </main>
        </div>
     );
}
 
export default ServerIdLayout;
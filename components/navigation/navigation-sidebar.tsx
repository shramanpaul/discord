import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";

const NavigationSidebar = async() => {
    const profile= await currentProfile();

    if(!profile){
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where:{ 
            members:{
                some:{
                    profileId:profile.id,
                },
            },
        }
    });

    

    return ( 
        <div className="space-y-4 flex flex-col items-center
        h-full text-primary w-full dark:bg-[#1E1F22] py-3"
        >
            <NavigationAction/>
            <Separator className="h-[2px] bg-zinc dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server)=>(
                    <div key={server.id} className="mb-4">
                        <NavigationItem 
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                            
                        />
                        
                    </div>
                ))
                }
            </ScrollArea>
        </div>
     );
}
 
export default NavigationSidebar;

// {servers.map((server)=>{
//     console.log(server.imageUrl); // Add this line to log the imageUrl
//     return (
//         <div key={server.id} className="mb-4">
//             <NavigationItem 
//                 id={server.id}
//                 name={server.name}
//                 imageUrl={server.imageUrl}
//             />
//         </div>
//     );
// })}
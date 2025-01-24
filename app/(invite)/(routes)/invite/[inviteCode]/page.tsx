import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    const profile = await currentProfile();

    // Redirect to sign-in page if no profile exists
    if (!profile) {
        // Use the `redirect()` function to redirect to the sign-in page
        return redirect("/sign-in"); // Replace "/sign-in" with your desired URL
    }

    // Redirect to home if no invite code is provided
    if (!params.inviteCode) {
        return redirect("/");
    }

    // Check if the user is already a member of the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    // Add the user to the server
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;
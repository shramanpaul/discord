import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    // Type check to ensure `profile` has `id`
    if (!profile || typeof profile !== 'object' || !('id' in profile)) {
        // Handle the case where `initialProfile` returns something unexpected
        return <InitialModal />;
    }

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return <InitialModal />;
};

export default SetupPage;

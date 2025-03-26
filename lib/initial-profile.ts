import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        console.error("No user found, redirecting to sign-in.");
        return null; // Return `null` instead of `redirectToSignIn()`
    }

    const profile = await db.profile.findUnique({
        where: { userId: user.id },
    });

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress || "",
        },
    });

    return newProfile;
};

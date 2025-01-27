"use client";

import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        
        // Add logging to confirm token retrieval
        console.log("Received LiveKit Token:", data.token);
        console.log("API Response: ", data);

        setToken(data.token); 
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}

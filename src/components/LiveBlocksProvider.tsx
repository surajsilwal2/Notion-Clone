"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";

const LiveBlocksProvider = ({ children }: { children: React.ReactNode }) => {
  //validate that the public key is set (only for auth user)
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set");
  }
  
  return (
    <LiveblocksProvider
      throttle={16} // limit how often presence updates are sent(in ms)
      authEndpoint={"/auth-endpoint"} //server route to verify user identity
    >
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlocksProvider;

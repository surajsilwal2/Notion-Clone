"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { PointerEvent } from "react";
import FollowPointer from "./FollowPointer";

// this component enables live mouse tracking (collaborative cursors)
const LiveCursorProvider = ({ children }: { children: React.ReactNode }) => {

  // useMyPresence lets me access and update my user's presence
  const [myPresence, updateMyPresence] = useMyPresence();

  // useOthers gives info about other connected users and their presence data
  const others = useOthers();

  // handles live mouse movements across the page
  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    //update from clientX and clientY to PageX and PageY for full page cursor tracking
    const cursor = { 
      x: Math.floor(e.pageX), // use pageX/Y for full document (not just viewport)
       y: Math.floor(e.pageY)
       };
    updateMyPresence({ cursor }); //share cursor position with others
  }

  // handle when user's pointer leaves the tracked area
  function handlePointerLeave() {
    updateMyPresence({ cursor: null }); //remove my cursor from presence
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {
        // show cursors of others users who currently have a cursor
        others
          .filter((other) => other.presence.cursor !== null)
          .map(({ connectionId, presence, info }) => (
            <FollowPointer
              key={connectionId}
              info={info}
              x={presence.cursor!.x}
              y={presence.cursor!.y}
            />
          ))
        //we are filter out only those who have cursor on them
      }
      {children}
    </div>
  );
};

export default LiveCursorProvider;

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useOthers, useSelf } from "@liveblocks/react/suspense";

const Avatars = () => {
  const others = useOthers();
  const self = useSelf();

  // Combine self and others into a single array
  const allUsers = [self, ...others];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <p className="text-sm text-gray-600 mb-2 sm:mb-0">
        Users currently editing this page:
      </p>

      <div className="flex -space-x-3">
        {allUsers.map((user, i) => {
          const isCurrentUser = self?.id === user?.id;
          const name = user?.info?.name || "Unknown";
          const avatarUrl = user?.info?.avatar;

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Avatar className="border-2 border-white shadow-sm hover:z-50 transition-transform duration-150 hover:scale-105">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>
                    {name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs px-2 py-1">
                <p>{isCurrentUser ? "You" : name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default Avatars;

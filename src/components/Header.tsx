"use client";
import {
  SignInButton,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  

  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl">
          {user?.firstName}
          {`'s`} Space
        </h1>
      )}

      {/* Breadcrumbs */}

      <div>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>

        {user && <UserButton />}
      </div>
    </div>
  );
};

export default Header;

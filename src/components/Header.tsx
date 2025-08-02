"use client";

import {
  SignInButton,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  console.log(user?.emailAddresses[0]?.emailAddress)

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Left: App Name or User Info */}
      <div>
        {user && (
          <h1 className="text-xl font-semibold text-gray-800">
            {user.firstName}
            {`'s`} Space
          </h1>
        )}
      </div>

       {/* Breadcrumbs */}

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        {user && <UserButton />}
      </div>
    </header>
  );
};

export default Header;

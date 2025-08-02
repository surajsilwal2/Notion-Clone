import { doc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { usePathname } from "next/navigation";

//component to render a single sidebar option (document link)
const SidebarOptions = ({ href, id }: { href: string; id: string }) => {
  // fetch the document data from firestore using its ID
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  //get the current route path
  const pathname = usePathname();

  //determine if this link is currently active
  const isActive = href.includes(pathname) && pathname !== "/";

  // Show nothing while loading or if data is unavailable
  if (loading) return null;
  if (!data) return null;

  return (
    <Link
      href={href}
      className={`border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black" : "bg-gray-400"
      }`}
    >
      {/* Title of the document (truncated if too long) */}
      <p className="truncate">{data.title}</p>
    </Link>
  );
};

export default SidebarOptions;

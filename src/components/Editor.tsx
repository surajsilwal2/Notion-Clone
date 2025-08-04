"use client";

// Import Liveblocks room and collaboration dependencies
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs"; // Shared doc structure (CRDT)

import { LiveblocksYjsProvider } from "@liveblocks/yjs"; // Bridge between Yjs and Liveblocks

// UI components
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

// BlockNote rich-text editor
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";

// Required fonts and styles
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

// Helper to generate consistent color from user email
import stringToColor from "@/lib/stringToColor";


// props shared to BlockNote component
type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};

// BlockNote wrapper for rendering collaborative editor
function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info); // get current user info from liveblocks

  //provide collaboration config only if userInfo is ready
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: userInfo?.email
      ? {
          provider,
          fragment: doc.getXmlFragment("document-store"),
          user: {
            name: userInfo?.name,
            color: stringToColor(userInfo?.email),
          },
        }
      : undefined,
  });

  // 💡 Skip rendering if editor or userInfo is not ready
  if (!editor || !userInfo?.email) return null;

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

// the main Editor component that initializes Liveblocks+Yjs connection
const Editor = () => {
  const room = useRoom(); //liveblocks room context
  const [doc, setDoc] = useState<Y.Doc>(); // Yjs shared document
  const [provider, setProvider] = useState<LiveblocksYjsProvider>(); // provider that connects Yjs to Liveblocks
  const [darkMode, setDarkMode] = useState(false);

  //setup document and provider when room is ready
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    // clean up on unmount
    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  // wait until doc + provider are ready
  if (!doc || !provider) {
    return null;
  }

  const style = `hover: text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* TranslateDocument AI */}
        {/* ChatToDocument AI */}

        {/* DarkMode */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* BlockNote */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};

export default Editor;

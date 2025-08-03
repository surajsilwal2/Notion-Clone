"use client";
import Document from "@/components/Document";
import React from "react";

const DocumentPage = (props: { params: Promise<{ id: string }> }) => {
    const {id} = React.use(props.params)
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;

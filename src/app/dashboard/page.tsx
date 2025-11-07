"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import Content from "@/components/Dashboard/Content";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

// Define the different content types
export type ContentType =
  | "dashboard"
  | "projects"
  | "analytics"
  | "team"
  | "orders"
  | "messages"
  | "calendar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState<ContentType>("dashboard");

  const { loading, user } = useAuthRedirect();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Content activeContent={activeContent} />
      </div>
    </div>
  );
}

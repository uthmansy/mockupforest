"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Content from "@/components/Dashboard/Content";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import Header from "@/components/Header";
import { getAuthSession } from "@/helpers/functions";
import { User } from "@supabase/supabase-js";

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
  const [activeContent, setActiveContent] = useState<ContentType>("dashboard");

  const { loading, user } = useAuthRedirect();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-5rem)] bg-gray-50">
        <Sidebar
          activeContent={activeContent}
          setActiveContent={setActiveContent}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Content activeContent={activeContent} />
        </div>
      </div>
    </>
  );
}

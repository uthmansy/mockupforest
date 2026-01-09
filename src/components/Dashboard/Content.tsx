"use client";

import { ContentType } from "@/app/dashboard/page";
import Mockups from "./Pages/Mockups";

interface ContentProps {
  activeContent: ContentType;
}

// Dashboard Content
function DashboardContent() {
  return <div>dummy</div>;
}

function Content({ activeContent }: ContentProps) {
  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <DashboardContent />;
      case "projects":
        return <Mockups />;
      default:
        return <DashboardContent />;
    }
  };

  return <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>;
}

export default Content;

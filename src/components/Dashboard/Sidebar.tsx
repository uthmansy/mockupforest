"use client";
import { ContentType } from "@/app/dashboard/page";
import {
  User,
  Grid,
  FileText,
  BarChart3,
  Users,
  ShoppingCart,
  Mail,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  activeContent: ContentType;
  setActiveContent: (content: ContentType) => void;
}

function Sidebar({
  sidebarOpen,
  activeContent,
  setActiveContent,
}: SidebarProps) {
  const menuItems = [
    { icon: Grid, label: "Dashboard", key: "dashboard" as ContentType },
    { icon: FileText, label: "Projects", key: "projects" as ContentType },
    { icon: BarChart3, label: "Analytics", key: "analytics" as ContentType },
    { icon: Users, label: "Team", key: "team" as ContentType },
    { icon: ShoppingCart, label: "Orders", key: "orders" as ContentType },
    { icon: Mail, label: "Messages", key: "messages" as ContentType },
    { icon: Calendar, label: "Calendar", key: "calendar" as ContentType },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {sidebarOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-semibold text-gray-900">Canvas</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto"></div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveContent(item.key)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              activeContent === item.key
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {sidebarOpen && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-sm text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

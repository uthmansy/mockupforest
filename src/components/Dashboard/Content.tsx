"use client";

import { ContentType } from "@/app/dashboard/page";
import {
  BarChart3,
  Download,
  FileText,
  Plus,
  Settings,
  Users,
  Calendar,
  Mail,
  ShoppingCart,
} from "lucide-react";
import React from "react";
import Mockups from "./Pages/Mockups";

interface ContentProps {
  activeContent: ContentType;
}

// Dashboard Content
function DashboardContent() {
  return (
    <>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, John
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Projects",
            value: "24",
            change: "+12%",
            color: "blue",
          },
          {
            title: "Active Users",
            value: "1,234",
            change: "+8%",
            color: "green",
          },
          {
            title: "Completion Rate",
            value: "86%",
            change: "+5%",
            color: "purple",
          },
          {
            title: "Storage Used",
            value: "2.4GB",
            change: "-2%",
            color: "orange",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}
              >
                <BarChart3 className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <p
              className={`text-sm mt-3 ${
                stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change} from last week
            </p>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h2>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Project {item}</p>
                    <p className="text-sm text-gray-500">Updated 2 hours ago</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Download, label: "Export Data", color: "blue" },
              { icon: Users, label: "Invite Team", color: "green" },
              { icon: BarChart3, label: "View Reports", color: "purple" },
              { icon: Settings, label: "Settings", color: "orange" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 bg-${action.color}-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${action.color}-100 transition-colors`}
                >
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
        <h3 className="text-xl font-bold mb-2">New Features Coming Soon</h3>
        <p className="opacity-90">
          We're working on exciting new updates to enhance your experience.
        </p>
      </div>
    </>
  );
}

// Analytics Content
function AnalyticsContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Detailed insights and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Traffic Overview
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Chart would be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Key Metrics
          </h2>
          <div className="space-y-4">
            {[
              { label: "Page Views", value: "12.4K", change: "+12%" },
              { label: "Unique Visitors", value: "8.7K", change: "+8%" },
              { label: "Bounce Rate", value: "34%", change: "-5%" },
              { label: "Avg. Session", value: "4m 23s", change: "+2%" },
            ].map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{metric.value}</p>
                  <p
                    className={`text-xs ${
                      metric.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Team Content
function TeamContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-600">Manage your team and their permissions.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Team Overview</h2>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "John Doe",
              role: "Admin",
              email: "john@example.com",
              avatar: "JD",
            },
            {
              name: "Jane Smith",
              role: "Developer",
              email: "jane@example.com",
              avatar: "JS",
            },
            {
              name: "Mike Johnson",
              role: "Designer",
              email: "mike@example.com",
              avatar: "MJ",
            },
            {
              name: "Sarah Wilson",
              role: "Manager",
              email: "sarah@example.com",
              avatar: "SW",
            },
            {
              name: "Alex Brown",
              role: "Developer",
              email: "alex@example.com",
              avatar: "AB",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{member.email}</p>
              <button className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Default content for other menu items
function DefaultContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This section is currently under development. We're working hard to
          bring you this feature soon!
        </p>
      </div>
    </>
  );
}

function Content({ activeContent }: ContentProps) {
  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <DashboardContent />;
      case "projects":
        return <Mockups />;
      case "analytics":
        return <AnalyticsContent />;
      case "team":
        return <TeamContent />;
      case "orders":
        return (
          <DefaultContent
            title="Orders"
            description="Manage and track your orders."
          />
        );
      case "messages":
        return (
          <DefaultContent
            title="Messages"
            description="View and manage your messages."
          />
        );
      case "calendar":
        return (
          <DefaultContent
            title="Calendar"
            description="Schedule and manage your events."
          />
        );
      default:
        return <DashboardContent />;
    }
  };

  return <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>;
}

export default Content;

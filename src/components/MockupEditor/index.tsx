"use client";

import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";
import { MockupCanvas } from "./MockupCanvas";

// ✅ Correct way to dynamically import a NAMED export
// const MockupCanvas = dynamic(
//   () => import("./MockupCanvas").then((mod) => mod.MockupCanvas),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex-1 flex items-center justify-center bg-gray-100">
//         <p className="text-gray-500">Loading Veiwport...</p>
//       </div>
//     ),
//   }
// );

export default function MockupEditor() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-80">
        <Sidebar />
      </div>
      <div className="flex-1">
        <MockupCanvas canvasWidth={2000} canvasHeight={1500} />
      </div>
    </div>
  );
}

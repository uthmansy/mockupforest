"use client";

import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";
import { MockupCanvas } from "./MockupCanvas";
import Header from "../Header";

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
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-black">
        <div className="w-80 h-full overflow-y-auto max-h-full bg-black border-white/20 p-6 py-10 border-r-[0.5px]  scrollbar-dark">
          <Sidebar />
        </div>
        <div className="flex-1">
          <MockupCanvas canvasWidth={2000} canvasHeight={1500} />
        </div>
      </div>
    </div>
  );
}

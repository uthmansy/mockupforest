import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-[95rem] mx-auto px-4">{children}</div>;
}

export default Container;

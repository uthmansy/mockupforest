import React, { Children, ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-7xl mx-auto">{children}</div>;
}

export default Container;

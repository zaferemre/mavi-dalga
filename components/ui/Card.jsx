import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg transition-transform duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

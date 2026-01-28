"use client";

import Image from "next/image";

export function GDGLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <style jsx global>{`
        @keyframes gdg-color-cycle {
          0%, 100% { color: #4285F4; } /* Blue */
          25% { color: #EA4335; }      /* Red */
          50% { color: #FBBC05; }      /* Yellow */
          75% { color: #34A853; }      /* Green */
        }
        .animate-gdg-text {
          animation: gdg-color-cycle 12s infinite ease-in-out;
        }
      `}</style>

      <div className="flex items-center font-black text-2xl tracking-tighter select-none">
        <span className="animate-gdg-text" style={{ animationDelay: "0s" }}>G</span>
        <span className="animate-gdg-text" style={{ animationDelay: "0.5s" }}>D</span>
        <span className="animate-gdg-text" style={{ animationDelay: "1s" }}>G</span>
      </div>

      <div className="flex flex-col border-l border-border pl-3">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-[0.2em] uppercase leading-none mb-1">
          on Campus
        </span>
        <span className="text-sm font-bold text-foreground tracking-tight leading-none">
          SOE CUSAT
        </span>
      </div>
    </div>
  );
}

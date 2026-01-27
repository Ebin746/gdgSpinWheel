"use client";

import Image from "next/image";

export function GDGLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-12 w-auto min-w-[120px]">
        <Image
          src="/GDSC_Logo_White_Background_0.png"
          alt="GDG Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col border-l border-border pl-3">
        <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
          on Campus
        </span>
        <span className="text-sm font-bold text-foreground tracking-tight">
          SOE CUSAT
        </span>
      </div>
    </div>
  );
}

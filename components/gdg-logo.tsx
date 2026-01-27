"use client";

export function GDGLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 80 40"
        className="h-10 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* G */}
        <path
          d="M10 5C4.477 5 0 9.477 0 15s4.477 10 10 10c2.761 0 5.261-1.12 7.071-2.929l-2.828-2.828C13.047 20.439 11.574 21.667 10 21.667c-3.682 0-6.667-2.985-6.667-6.667s2.985-6.667 6.667-6.667c1.841 0 3.507.748 4.714 1.953l2.828-2.828C15.785 5.786 13.047 5 10 5z"
          fill="#4285F4"
          className="animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <path d="M20 15h-10v3.333h6.667c-.417 2.083-2.083 3.333-3.333 3.333" fill="#4285F4" />

        {/* D */}
        <path
          d="M28 5h6.667c5.523 0 10 4.477 10 10s-4.477 10-10 10H28V5zm6.667 16.667c3.682 0 6.667-2.985 6.667-6.667s-2.985-6.667-6.667-6.667h-3.333v13.334h3.333z"
          fill="#EA4335"
          className="animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "3s" }}
        />

        {/* G */}
        <path
          d="M54.667 5c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.761 0 5.261-1.12 7.071-2.929l-2.828-2.828c-1.196 1.196-2.669 2.424-4.243 2.424-3.682 0-6.667-2.985-6.667-6.667s2.985-6.667 6.667-6.667c1.841 0 3.507.748 4.714 1.953l2.828-2.828C60.452 5.786 57.714 5 54.667 5z"
          fill="#FBBC05"
          className="animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        />
        <path d="M64.667 15h-10v3.333h6.667c-.417 2.083-2.083 3.333-3.333 3.333" fill="#FBBC05" />

        {/* Small decoration */}
        <circle cx="75" cy="15" r="4" fill="#34A853" className="animate-pulse" style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
      </svg>
      
      <div className="flex flex-col">
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

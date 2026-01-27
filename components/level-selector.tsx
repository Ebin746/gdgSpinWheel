"use client";

import { Sparkles, Zap, Rocket, Flame } from "lucide-react";

interface Level {
  key: string;
  label: string;
  description: string;
  color: string;
  Icon: typeof Sparkles;
}

const LEVELS: Level[] = [
  {
    key: "basic",
    label: "Basic",
    description: "Fundamentals & Easy Problems",
    color: "#34A853",
    Icon: Sparkles,
  },
  {
    key: "medium",
    label: "Medium",
    description: "Intermediate Challenges",
    color: "#FBBC05",
    Icon: Zap,
  },
  {
    key: "advanced",
    label: "Advanced",
    description: "Complex Problem Solving",
    color: "#4285F4",
    Icon: Rocket,
  },
  {
    key: "pro",
    label: "Pro",
    description: "Expert Level Challenges",
    color: "#EA4335",
    Icon: Flame,
  },
];

interface LevelSelectorProps {
  onSelect: (level: string) => void;
  selectedLevel: string | null;
}

export function LevelSelector({ onSelect, selectedLevel }: LevelSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mx-auto">
      {LEVELS.map((level, index) => {
        const Icon = level.Icon;
        return (
          <button
            key={level.key}
            onClick={() => onSelect(level.key)}
            className={`group relative p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-105 animate-fade-in-up ${selectedLevel === level.key
                ? "border-white shadow-lg"
                : "border-transparent hover:border-white/30"
              }`}
            style={{
              background:
                selectedLevel === level.key
                  ? `linear-gradient(135deg, ${level.color}20, ${level.color}40)`
                  : "rgba(255, 255, 255, 0.03)",
              boxShadow:
                selectedLevel === level.key
                  ? `0 0 30px ${level.color}40`
                  : "none",
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Hover glow effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
              style={{
                background: `radial-gradient(circle at center, ${level.color}30, transparent)`,
              }}
            />

            {/* Animated border on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${level.color}20, transparent, ${level.color}20)`,
              }}
            />

            <div className="relative flex flex-col items-center gap-2">
              <div
                className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  backgroundColor: `${level.color}20`,
                }}
              >
                <Icon
                  className="w-6 h-6 transition-all duration-300"
                  style={{ color: level.color }}
                />
              </div>
              <span
                className="text-lg font-bold transition-all duration-300 group-hover:tracking-wide"
                style={{ color: level.color }}
              >
                {level.label}
              </span>
              <span className="text-xs text-muted-foreground text-center transition-all duration-300 group-hover:text-foreground/70">
                {level.description}
              </span>
            </div>

            {/* Corner decorations */}
            <div
              className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"
              style={{ backgroundColor: level.color }}
            />
            <div
              className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"
              style={{ backgroundColor: level.color, transitionDelay: "100ms" }}
            />
          </button>
        );
      })}
    </div>
  );
}
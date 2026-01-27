"use client";

import { ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Question {
  id: string;
  title: string;
  link: string;
}

interface QuestionResultProps {
  question: Question;
  level: string;
  onReset: () => void;
  isNewResult?: boolean;
}

const LEVEL_COLORS: Record<string, string> = {
  basic: "#34A853",
  medium: "#FBBC05",
  advanced: "#4285F4",
  pro: "#EA4335",
};

const CONFETTI_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export function QuestionResult({
  question,
  level,
  onReset,
  isNewResult = false,
}: QuestionResultProps) {
  const levelColor = LEVEL_COLORS[level] || "#4285F4";
  const [showContent, setShowContent] = useState(true);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; color: string; delay: number }>
  >([]);

  useEffect(() => {
    if (isNewResult) {
      // Generate confetti
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.5,
      }));
      setConfetti(newConfetti);

      // Clear confetti after animation
      const confettiTimer = setTimeout(() => {
        setConfetti([]);
      }, 3000);

      return () => {
        clearTimeout(confettiTimer);
      };
    }
  }, [isNewResult]);

  // Early return if no question
  if (!question) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative overflow-hidden rounded-3xl p-6 border border-white/10 animate-fade-in-up"
        style={{
          background: `linear-gradient(135deg, ${levelColor}10, rgba(0,0,0,0.5))`,
          boxShadow: `0 0 60px ${levelColor}20`,
        }}
      >
        {/* Confetti celebration */}
        {confetti.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${particle.x}%`,
                  top: "-10px",
                  backgroundColor: particle.color,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-64 h-64 rounded-full blur-3xl animate-float"
            style={{
              background: `${levelColor}15`,
              top: "-20%",
              left: "-10%",
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full blur-3xl animate-float-delayed"
            style={{
              background: `${levelColor}10`,
              bottom: "-10%",
              right: "-10%",
            }}
          />
        </div>

        {/* Sparkle decorations for new results */}
        {isNewResult && (
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles
              className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-sparkle"
              style={{ animationDelay: "0s" }}
            />
            <Sparkles
              className="absolute top-4 right-4 w-5 h-5 text-yellow-400 animate-sparkle"
              style={{ animationDelay: "0.2s" }}
            />
            <Sparkles
              className="absolute bottom-20 left-8 w-4 h-4 text-yellow-400 animate-sparkle"
              style={{ animationDelay: "0.4s" }}
            />
            <Sparkles
              className="absolute bottom-16 right-8 w-5 h-5 text-yellow-400 animate-sparkle"
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        )}

        <div className="relative flex flex-col gap-4">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {isNewResult
                ? "Your challenge awaits!"
                : "Your DSA Challenge:"}
            </h2>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance animate-title-reveal">
              {question.title}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${levelColor}, ${levelColor}cc)`,
                boxShadow: `0 4px 20px ${levelColor}40`,
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute -inset-full top-0 h-full w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />
              </div>
              <span className="relative">Solve Challenge</span>
              <ExternalLink className="w-4 h-4 relative transition-transform group-hover:translate-x-1" />
            </a>
            <Button
              onClick={onReset}
              variant="outline"
              className="gap-2 rounded-full border-white/20 hover:bg-white/10 text-foreground bg-transparent transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 transition-transform hover:rotate-180" />
              <span>Try Another Level</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
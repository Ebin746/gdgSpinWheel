"use client";

import { useState, useEffect } from "react";
import { LevelSelector } from "@/components/level-selector";
import { SpinningWheel } from "@/components/spinning-wheel";
import { QuestionResult } from "@/components/question-result";
import { GDGLogo } from "@/components/gdg-logo";
import questionsData from "@/data/questions.json";
import { ArrowLeft, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  title: string;
  link: string;
}

interface StoredResult {
  level: string;
  question: Question;
  timestamp: number;
}

const STORAGE_KEY = "gdg-dsa-lucky-draw-results";

const LEVEL_COLORS: Record<string, string> = {
  basic: "#34A853",
  medium: "#FBBC05",
  advanced: "#4285F4",
  pro: "#EA4335",
};

export default function LuckyDrawPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Question | null>(null);
  const [storedResults, setStoredResults] = useState<StoredResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isNewResult, setIsNewResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load stored results on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStoredResults(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored results:", e);
      }
    }
  }, []);

  // Check if user already spun for selected level - FIX: Only check once when level is first selected
  useEffect(() => {
    if (selectedLevel && !result) {
      const existingResult = storedResults.find(
        (r) => r.level === selectedLevel
      );
      if (existingResult) {
        setResult(existingResult.question);
        setIsNewResult(false);
      }
    }
  }, [selectedLevel]); // Remove storedResults and result from dependencies to prevent re-triggering

  const handleLevelSelect = (level: string) => {
    // Reset states before selecting new level
    setResult(null);
    setIsNewResult(false);
    setSelectedLevel(level);
    setShowHistory(false);

    // Check for existing result after state is cleared
    setTimeout(() => {
      const existingResult = storedResults.find((r) => r.level === level);
      if (existingResult) {
        setResult(existingResult.question);
        setIsNewResult(false);
      }
    }, 0);
  };

  const handleSpinComplete = (question: Question) => {
    if (!question) {
      return;
    }

    // Store result
    const newResult: StoredResult = {
      level: selectedLevel!,
      question,
      timestamp: Date.now(),
    };

    const updatedResults = [
      ...storedResults.filter((r) => r.level !== selectedLevel),
      newResult,
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
    setStoredResults(updatedResults);

    // Set result state - this triggers the re-render
    setIsNewResult(true);
    setResult(question);
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setResult(null);
    setIsNewResult(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredResults([]);
    setResult(null);
    setSelectedLevel(null);
  };

  const questions =
    selectedLevel && questionsData[selectedLevel as keyof typeof questionsData]
      ? questionsData[selectedLevel as keyof typeof questionsData].questions
      : [];

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <GDGLogo className="h-12" />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground overflow-x-hidden flex flex-col min-h-screen">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] animate-bg-float"
          style={{
            background: "rgba(66, 133, 244, 0.08)",
            top: "-10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-bg-float-delayed"
          style={{
            background: "rgba(234, 67, 53, 0.06)",
            bottom: "-5%",
            right: "-5%",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-bg-float"
          style={{
            background: "rgba(52, 168, 83, 0.06)",
            top: "40%",
            right: "20%",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/60 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <GDGLogo className="h-10 animate-fade-in" />
          <div className="flex items-center gap-2">
            {storedResults.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className={`gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ${showHistory ? "bg-white/10" : ""
                  }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">
                  History ({storedResults.length})
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-10">
        {/* Main Content */}
        <div className="w-full max-w-7xl px-4 relative z-10">
          {/* History Panel */}
          {showHistory && storedResults.length > 0 && (
            <div className="mb-8 p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm animate-slide-down">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">
                  Your Previous Results
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {storedResults.map((r, index) => (
                  <button
                    key={r.level}
                    onClick={() => handleLevelSelect(r.level)}
                    className="p-3 rounded-xl border border-border hover:border-white/30 transition-all duration-300 text-left bg-secondary/30 hover:bg-secondary/50 hover:scale-[1.02] animate-fade-in-up group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      borderColor: `${LEVEL_COLORS[r.level]}30`,
                    }}
                  >
                    <div
                      className="text-xs uppercase tracking-wide mb-1 font-semibold"
                      style={{ color: LEVEL_COLORS[r.level] }}
                    >
                      {r.level}
                    </div>
                    <div className="font-semibold text-sm text-foreground group-hover:text-white transition-colors">
                      {r.question.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title Section - Only show when no level is selected */}
          {!selectedLevel && (
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
                <span
                  className="inline-block animate-letter"
                  style={{ animationDelay: "0ms", color: "#4285F4" }}
                >
                  D
                </span>
                <span
                  className="inline-block animate-letter"
                  style={{ animationDelay: "100ms", color: "#EA4335" }}
                >
                  S
                </span>
                <span
                  className="inline-block animate-letter"
                  style={{ animationDelay: "200ms", color: "#FBBC05" }}
                >
                  A
                </span>
                <span className="text-foreground"> Lucky Draw</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto text-balance">
                Spin the wheel and get a random DSA challenge! Choose your
                difficulty level and test your coding skills.
              </p>
            </div>
          )}

          {/* Content Area */}
          <div className="w-full flex flex-col items-center justify-center">
            {!selectedLevel ? (
              <div className="space-y-8 w-full">
                <h2 className="text-xl font-semibold text-center text-foreground animate-fade-in">
                  Select Your Difficulty Level
                </h2>
                <LevelSelector
                  onSelect={handleLevelSelect}
                  selectedLevel={selectedLevel}
                />
              </div>
            ) : result ? (
              <div className="space-y-8 animate-fade-in w-full max-w-3xl flex flex-col items-center">
                <div className="w-full flex justify-start">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-x-1 group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to levels</span>
                  </button>
                </div>
                <div className="w-full">
                  <QuestionResult
                    key={result.id}
                    question={result}
                    level={selectedLevel}
                    onReset={handleReset}
                    isNewResult={isNewResult}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in w-full flex flex-col items-center">
                <div className="w-full max-w-3xl flex justify-start">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-x-1 group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to levels</span>
                  </button>
                </div>
                <div className="text-center">
                  <span
                    className="inline-block px-6 py-2 rounded-full text-base font-semibold mb-6 animate-pulse-subtle"
                    style={{
                      backgroundColor: `${LEVEL_COLORS[selectedLevel]}20`,
                      color: LEVEL_COLORS[selectedLevel],
                      boxShadow: `0 0 20px ${LEVEL_COLORS[selectedLevel]}30`,
                    }}
                  >
                    {selectedLevel.charAt(0).toUpperCase() +
                      selectedLevel.slice(1)}{" "}
                    Level
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <SpinningWheel
                    questions={questions}
                    onSpinComplete={handleSpinComplete}
                    isSpinning={isSpinning}
                    setIsSpinning={setIsSpinning}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/60 backdrop-blur-xl py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#34A853" }}
            />
            Powered by{" "}
            <span className="font-semibold text-foreground">
              Google Developer Groups
            </span>{" "}
            SOE CUSAT
          </p>
        </div>
      </footer>
    </main>
  );
}
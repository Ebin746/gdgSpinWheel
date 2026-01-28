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

  // No longer checking for existing results to force unlimited spins
  useEffect(() => {
    if (selectedLevel && !result) {
      // Logic removed to allow unlimited spins
    }
  }, [selectedLevel]);

  const handleLevelSelect = (level: string, questionFromResult?: Question) => {
    // Reset states
    setIsNewResult(false);
    setShowHistory(false);

    if (questionFromResult) {
      // If called from history, show that specific result
      setResult(questionFromResult);
      setSelectedLevel(level);
    } else {
      // Normal level select
      setResult(null);
      setSelectedLevel(level);
    }
  };

  const handleSpinComplete = (question: Question) => {
    if (!question) {
      return;
    }

    // Store result - always append to allow multiple results for the same level
    const newResult: StoredResult = {
      level: selectedLevel!,
      question,
      timestamp: Date.now(),
    };

    const updatedResults = [newResult, ...storedResults]; // Add new result to the top

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
    setStoredResults(updatedResults);

    // Set result state
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

  const levelSpinCount = selectedLevel
    ? storedResults.filter((r) => r.level === selectedLevel).length
    : 0;

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex gap-2">
          {["G", "D", "G"].map((letter, i) => (
            <span
              key={i}
              className="text-6xl font-black animate-bounce"
              style={{
                color: i === 0 ? "#4285F4" : i === 1 ? "#34A853" : "#FBBC05",
                animationDelay: `${i * 150}ms`,
              }}
            >
              {letter}
            </span>
          ))}
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
          <GDGLogo
            className="h-10 animate-fade-in"
            onClick={isSpinning ? undefined : handleReset}
          />
          <div className="flex items-center gap-2">
            {storedResults.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                disabled={isSpinning}
                onClick={() => setShowHistory(!showHistory)}
                className={`gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ${showHistory ? "bg-white/10" : ""
                  } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
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
      <div className="flex-1 flex flex-col items-center justify-center pb-10">
        <div className="w-full max-w-7xl px-4 relative z-10">
          {showHistory && storedResults.length > 0 ? (
            /* History View */
            <div className="animate-fade-in w-full">
              <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(false)}
                      className="gap-2 text-muted-foreground hover:text-foreground px-2 sm:px-3"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm sm:text-base">Back to Home</span>
                    </Button>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Spin History
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-destructive hover:text-secondary-foreground hover:bg-destructive/10 gap-2 w-fit"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {storedResults.map((r, index) => (
                  <button
                    key={`${r.level}-${r.timestamp}`}
                    onClick={() => handleLevelSelect(r.level, r.question)}
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
          ) : (
            /* Home View */
            <div className="w-full flex flex-col items-center">
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
                    <span className="text-foreground"> Platform</span>
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto text-balance">
                    Master your technical interviews with our curated collection of LeetCode challenges.
                    Choose your level and start practicing today.
                  </p>
                </div>
              )}

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
                        key={`${result.id}-${Date.now()}`} // Use key to force re-animation when switching from history
                        question={result}
                        level={selectedLevel}
                        onReset={handleReset}
                        isNewResult={isNewResult}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in w-full flex flex-col items-center">
                    <div className="w-full flex justify-center">
                      <SpinningWheel
                        questions={questions}
                        onSpinComplete={handleSpinComplete}
                        isSpinning={isSpinning}
                        setIsSpinning={setIsSpinning}
                        selectedLevel={selectedLevel}
                        onReset={handleReset}
                        spinCount={levelSpinCount}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
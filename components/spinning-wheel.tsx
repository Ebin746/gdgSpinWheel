"use client";

import { useRef, useEffect, useState } from "react";

interface Question {
  id: string;
  title: string;
  link: string;
}

interface SpinningWheelProps {
  questions: Question[];
  onSpinComplete: (question: Question) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

// Google Colors for 4 segments - Red, Blue, Green, Yellow
const GOOGLE_COLORS = [
  { base: "#EA4335", light: "#FF6B6B", dark: "#D32F2F" }, // Red
  { base: "#4285F4", light: "#64B5F6", dark: "#1976D2" }, // Blue
  { base: "#34A853", light: "#66BB6A", dark: "#2E7D32" }, // Green
  { base: "#FBBC05", light: "#FFD54F", dark: "#F9A825" }, // Yellow
];

export function SpinningWheel({
  questions,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
}: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const numSegments = 4; // 4 segments

  const drawWheel = (
    ctx: CanvasRenderingContext2D,
    size: number,
    rot: number
  ) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    const segmentAngle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    // Draw 4 segments with Google colors
    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * segmentAngle + rot;
      const endAngle = startAngle + segmentAngle;
      const color = GOOGLE_COLORS[i];

      // Main segment with vibrant radial gradient
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Create multi-stop gradient for depth and vibrancy
      const segmentGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius
      );
      segmentGradient.addColorStop(0, color.light);
      segmentGradient.addColorStop(0.5, color.base);
      segmentGradient.addColorStop(1, color.dark);
      ctx.fillStyle = segmentGradient;
      ctx.fill();

      // Add subtle highlight effect
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius * 0.8, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      const midAngle = startAngle + segmentAngle / 2;
      const highlightGradient = ctx.createLinearGradient(
        centerX + Math.cos(midAngle - 0.4) * radius * 0.4,
        centerY + Math.sin(midAngle - 0.4) * radius * 0.4,
        centerX + Math.cos(midAngle + 0.4) * radius * 0.6,
        centerY + Math.sin(midAngle + 0.4) * radius * 0.6
      );
      highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      highlightGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.25)");
      highlightGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
      highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = highlightGradient;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      // Clean segment border
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Draw clean outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner decorative ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2.5, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw decorative notches at segment divisions
    for (let i = 0; i < numSegments; i++) {
      const angle = (i * Math.PI * 2) / numSegments;
      const innerR = radius - 15;
      const outerR = radius + 2;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * innerR,
        centerY + Math.sin(angle) * innerR
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * outerR,
        centerY + Math.sin(angle) * outerR
      );
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Draw center circle with WHITE background
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    
    // Center ring
    ctx.strokeStyle = "#d0d0d0";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 46, 0, 2 * Math.PI);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw GDG text in center with Google colors (Red, Green, Yellow for R, G, Y)
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Measure text to position each letter
    const letterSpacing = 12;
    
    // G - Red
    ctx.fillStyle = "#EA4335";
    ctx.fillText("G", centerX - letterSpacing, centerY - 9);
    
    // D - Green
    ctx.fillStyle = "#34A853";
    ctx.fillText("D", centerX, centerY - 9);
    
    // G - Yellow
    ctx.fillStyle = "#FBBC05";
    ctx.fillText("G", centerX + letterSpacing, centerY - 9);
    
    // SOE in black
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText("SOE", centerX, centerY + 11);

    // Draw pointer (triangle on right side)
    const pointerSize = 26;
    const pointerOffset = 10;
    
    ctx.beginPath();
    ctx.moveTo(size - pointerOffset, centerY - pointerSize);
    ctx.lineTo(size - pointerOffset, centerY + pointerSize);
    ctx.lineTo(size - pointerOffset - 38, centerY);
    ctx.closePath();

    const pointerGradient = ctx.createLinearGradient(
      size - pointerOffset - 38,
      centerY,
      size - pointerOffset,
      centerY
    );
    pointerGradient.addColorStop(0, "#ffffff");
    pointerGradient.addColorStop(0.5, "#f5f5f5");
    pointerGradient.addColorStop(1, "#e0e0e0");
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer highlight
    ctx.beginPath();
    ctx.moveTo(size - pointerOffset - 2, centerY - pointerSize + 6);
    ctx.lineTo(size - pointerOffset - 2, centerY - 2);
    ctx.lineTo(size - pointerOffset - 32, centerY - 3);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 340;
    canvas.width = size;
    canvas.height = size;

    drawWheel(ctx, size, currentRotation);
  }, [currentRotation, questions]);

  const spin = () => {
    if (isSpinning || questions.length === 0) return;
    setIsSpinning(true);

    const spinDuration = 4500;
    const extraSpins = 5 + Math.random() * 3;
    const targetQuestionIndex = Math.floor(Math.random() * questions.length);
    
    // Map question to segment (distribute questions evenly across 4 segments)
    const targetSegment = targetQuestionIndex % numSegments;
    const segmentAngle = (2 * Math.PI) / numSegments;

    const targetRotation =
      currentRotation +
      extraSpins * 2 * Math.PI +
      (2 * Math.PI - targetSegment * segmentAngle - segmentAngle / 2);

    const startTime = Date.now();
    const startRotation = currentRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Smooth easing function
      const easeOut = 1 - Math.pow(1 - progress, 4);

      const newRotation =
        startRotation + (targetRotation - startRotation) * easeOut;
      setCurrentRotation(newRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        onSpinComplete(questions[targetQuestionIndex]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Subtle idle animation
  useEffect(() => {
    if (isSpinning) return;

    let idleAnimation: number;
    let time = 0;

    const idleAnimate = () => {
      time += 0.015;
      const wobble = Math.sin(time) * 0.008;
      setCurrentRotation((prev) => prev + wobble);
      idleAnimation = requestAnimationFrame(idleAnimate);
    };

    if (isHovered && !isSpinning) {
      idleAnimation = requestAnimationFrame(idleAnimate);
    }

    return () => {
      if (idleAnimation) {
        cancelAnimationFrame(idleAnimation);
      }
    };
  }, [isSpinning, isHovered]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas
          ref={canvasRef}
          className={`relative z-10 transition-all duration-300 ${
            !isSpinning && isHovered ? "scale-[1.02]" : ""
          }`}
          style={{
            filter: `drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15))`,
          }}
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`relative px-12 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 ${
          isSpinning
            ? "cursor-not-allowed opacity-60"
            : "hover:scale-105 active:scale-95"
        }`}
        style={{
          background: isSpinning
            ? "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)"
            : "linear-gradient(135deg, #2a2a2a 0%, #000000 100%)",
          boxShadow: isSpinning
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 6px 20px rgba(0, 0, 0, 0.4)",
          border: "1px solid #404040",
        }}
      >
        <span className="relative z-10 flex items-center gap-3">
          {isSpinning ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Spinning...
            </>
          ) : (
            "SPIN THE WHEEL"
          )}
        </span>
      </button>
    </div>
  );
}
import React, { useEffect, useRef, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  animate,
} from "framer-motion";

// --- StarField Background Component ---
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      twinkleSpeed: 0.003 + Math.random() * 0.012,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed *= -1;
        }

        ctx.globalAlpha = Math.max(0, star.opacity);
        ctx.beginPath();
        ctx.arc(
          star.x % canvas.width,
          star.y % canvas.height,
          star.size,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-50"
    />
  );
};

// --- Animated Φ Symbol Component ---
const PhiSymbol = ({ progress, rawProgress, color = "white", size = 180 }) => {
  const axisExtension = 35;
  const radius = 60;
  const axialTilt = 23.5;

  const mergeX1 = useTransform(progress, [0.12, 0.24], [-120, 0]);
  const mergeX0 = useTransform(progress, [0.12, 0.24], [120, 0]);
  const circleEntryOpacity = useTransform(progress, [0.12, 0.2], [0, 1]);
  const axisPathLength = useTransform(progress, [0.15, 0.3], [0, 1]);

  const rotationY = useTransform(progress, [0, 1], [0, 1080]);

  // Adjusted visibility for shorter lingering (Reset starts at 0.94)
  const phiFinalOpacity = useTransform(
    rawProgress,
    [0, 0.12, 0.93, 0.95, 1],
    [0, 1, 1, 0, 0],
  );
  const phiScale = useTransform(progress, [0.82, 0.94], [1, 1.3]);
  const earthGridOpacity = useTransform(
    progress,
    [0.25, 0.45, 0.88, 0.94],
    [0, 0.4, 0.5, 0],
  );

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        scale: phiScale,
        opacity: phiFinalOpacity,
        visibility: useTransform(rawProgress, (v) =>
          v < 0.12 || v > 0.95 ? "hidden" : "visible",
        ),
      }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        style={{ rotate: axialTilt }}
      >
        <motion.ellipse
          cx="100"
          cy="100"
          rx={radius}
          ry={radius}
          stroke={color}
          strokeWidth="5"
          fill="none"
          style={{ x: mergeX0, opacity: circleEntryOpacity }}
        />

        <motion.line
          x1="100"
          y1={100 + radius + axisExtension}
          x2="100"
          y2={100 - radius - axisExtension}
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ x: mergeX1, pathLength: axisPathLength }}
        />

        <motion.g
          style={{
            x: mergeX0,
            opacity: earthGridOpacity,
          }}
        >
          <motion.ellipse
            cx="100"
            cy="100"
            rx="20"
            ry={radius}
            stroke={color}
            strokeWidth="1"
            fill="none"
            style={{ rotateY: rotationY }}
          />
          <motion.ellipse
            cx="100"
            cy="100"
            rx="45"
            ry={radius}
            stroke={color}
            strokeWidth="1"
            fill="none"
            style={{ rotateY: useTransform(rotationY, (r) => r + 60) }}
          />
          <motion.line
            x1={100 - radius}
            y1="100"
            x2={100 + radius}
            y2="100"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
          <motion.line
            x1={100 - 52}
            y1="125"
            x2={100 + 52}
            y2="125"
            stroke={color}
            strokeWidth="1"
            opacity="0.2"
          />
          <motion.line
            x1={100 - 52}
            y1="75"
            x2={100 + 52}
            y2="75"
            stroke={color}
            strokeWidth="1"
            opacity="0.2"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

export default function App() {
  const progress = useMotionValue(0);
  // Optimized spring for cinematic fluidity without stutter
  const smoothProgress = useSpring(progress, { stiffness: 40, damping: 35 });

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 30,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
    });
    return () => controls.stop();
  }, []);

  // Synchronized Scale and Offset logic to eliminate kakutsuki
  const logoScale = useTransform(
    smoothProgress,
    [0.12, 0.22, 0.72, 0.82, 0.94],
    [1.3, 0.8, 0.8, 0.9, 1.4],
  );
  const phiCenterOffset = useTransform(
    smoothProgress,
    [0.12, 0.28, 0.72, 0.82, 0.88, 0.94],
    [0, -60, -60, -25, -25, 0],
  );

  // Unified Text Weights
  const unifiedWeight = "font-light";

  // Alignment: Synchronized "The" opacity and positioning
  const theOpacity = useTransform(
    progress,
    [0.72, 0.8, 0.88, 0.93],
    [0, 1, 1, 0],
  );
  const theTranslateX = useTransform(smoothProgress, [0.72, 0.8], [-30, 0]);

  // "ne" opacity and positioning
  const neOpacity = useTransform(
    progress,
    [0.18, 0.3, 0.88, 0.93],
    [0, 1, 1, 0],
  );
  const neTranslateX = useTransform(
    smoothProgress,
    [0.18, 0.32, 0.88, 0.93],
    [40, -12, -12, 10],
  );

  // Narrative Texts Fade timing
  const originTextOp = useTransform(
    progress,
    [0.14, 0.2, 0.24, 0.3],
    [0, 1, 1, 0],
  );
  const visionTextOp = useTransform(
    progress,
    [0.4, 0.5, 0.6, 0.7],
    [0, 1, 1, 0],
  );
  const identitySubTextOp = useTransform(
    progress,
    [0.75, 0.85, 0.9, 0.93],
    [0, 1, 1, 0],
  );

  // FINAL DEFENSE: The blackout covering loop jump
  // Reduced fade-in time for better initial loading experience
  const blackOutOpacity = useTransform(
    progress,
    [0, 0.05, 0.94, 0.98, 1],
    [1, 0, 0, 1, 1],
  );

  return (
    <div className="bg-[#00050d] h-screen w-full overflow-hidden text-white font-sans relative">
      {/* Background Ambience */}
      <StarField />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001b44]/5 to-transparent" />
        <motion.div
          style={{
            opacity: useTransform(
              progress,
              [0, 0.12, 0.5, 0.92],
              [0, 0.01, 0.03, 0],
            ),
            x: useTransform(smoothProgress, [0, 1], [25, -25]),
          }}
          className="text-[35vw] font-bold whitespace-nowrap absolute top-1/2 -translate-y-1/2 select-none"
        >
          PHINE PHINE PHINE
        </motion.div>
      </div>

      {/* Main Visual Core: Perfectly aligned "The Φne" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        <motion.div
          style={{ scale: logoScale, x: phiCenterOffset }}
          className="flex items-center gap-0" // Using items-center with manual baseline adjustment
        >
          <motion.div
            style={{
              opacity: theOpacity,
              x: theTranslateX,
            }}
            // Correcting visual baseline height to match Phi's circle
            className={`text-[95px] ${unifiedWeight} tracking-tighter leading-none mr-8 translate-y-[8px]`}
          >
            The
          </motion.div>

          <PhiSymbol progress={smoothProgress} rawProgress={progress} />

          <motion.div
            style={{
              opacity: neOpacity,
              x: neTranslateX,
            }}
            // Correcting visual baseline height to match Phi's circle
            className={`text-[140px] ${unifiedWeight} tracking-tighter leading-none -ml-4 translate-y-[1px]`}
          >
            ne
          </motion.div>
        </motion.div>
      </div>

      {/* Narrative Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none px-20">
        <motion.div
          style={{ opacity: originTextOp }}
          className="absolute left-20 top-1/4 max-w-lg"
        >
          <h2 className="text-[10px] tracking-[2em] uppercase opacity-30 mb-6 font-bold">
            01 / Origin
          </h2>
          <h3 className="text-6xl font-extralight mb-6 tracking-tighter">
            Zero <span className="opacity-30">to</span> One.
          </h3>
          <p className="text-lg opacity-30 font-light leading-relaxed">
            Where the void meets will.
            <br />A convergence that defines the first line of creation.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: visionTextOp }}
          className="absolute right-20 bottom-1/4 text-right max-w-xl"
        >
          <h2 className="text-[10px] tracking-[2em] uppercase opacity-30 mb-6 font-bold">
            02 / Perspective
          </h2>
          <h3 className="text-6xl font-extralight mb-6 tracking-tighter">
            Planetary Sight.
          </h3>
          <p className="text-lg opacity-30 font-light leading-relaxed">
            Elevating vision beyond boundaries.
            <br />
            Observing the universal rhythm from the silent stars.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: identitySubTextOp }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-32"
        >
          <div className="text-center">
            <p className="text-xs font-light opacity-30 tracking-[0.8em] uppercase">
              Alone in the dark, shining for the all.
            </p>
          </div>
        </motion.div>
      </div>

      {/* UI Decors */}
      <div className="absolute bottom-10 left-10 z-50 flex items-center gap-4 opacity-20">
        <div className="w-10 h-[1px] bg-white" />
        <span className="text-[8px] tracking-[0.4em] uppercase">
          Continuous Loop // PHINE Eternal
        </span>
      </div>

      {/* Loop Blackout Mask */}
      <motion.div
        style={{ opacity: blackOutOpacity }}
        className="absolute inset-0 bg-[#00050d] pointer-events-none z-[100]"
      />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  AnimatePresence,
} from "framer-motion";

// --- Product Data Configuration ---
const PRODUCTS = [
  {
    id: "rich_markdown_diff",
    name: "Rich Markdown Diff",
    icon: "/rich_markdown_diff_icon.png",

    badge: "New Release",
    badgeType: "violet",
    platform: "VS Code Extension",
    description: (
      <>
        A professional markdown diff for VS Code.
        <br />
        Compare files visually with rendered HTML, Git integration, and rich
        syntax support.
      </>
    ),
    shortDescription: "Visual Markdown diff for VS Code.",
    link: "https://marketplace.visualstudio.com/items?itemName=phine-apps.rich-markdown-diff",
    linkText: "Get it on VS Code Marketplace",
  },
  {
    id: "tube_zenify",
    name: "TubeZenify",
    icon: "/tube_zenify_icon.png",

    badge: "Now Available",
    badgeType: "sky",
    platform: "Chrome Extension",
    description: (
      <>
        Transform your YouTube sidebar into a &quot;Zen&quot; interface.
        <br />
        Organize subscriptions, focus on what matters, and sync across devices.
      </>
    ),
    shortDescription: "Zen mode for YouTube.",
    link: "https://chrome.google.com/webstore/detail/ifgpjpaahjajngacmophnepamkppgacm",
    linkText: "Get it on Chrome Web Store",
  },
  {
    id: "sidebark",
    name: "Sidebark",
    icon: "/sidebark_icon.png",

    badge: "Now Available",
    badgeType: "emerald",
    platform: "Chrome Extension",
    description: (
      <>
        The best way to use ChatGPT, Gemini, or ANY other site alongside your
        browsing.
        <br />A universal sidebar that keeps your tools open and your flow
        uninterrupted.
      </>
    ),
    shortDescription: "Your browser's new best friend.",
    link: "https://chromewebstore.google.com/detail/sidebark/foglodkfmhggcmbmodgciegkknpemgcl",
    linkText: "Get it on Chrome Web Store",
  },
];

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

// --- Product Showcase Component (Reusable) ---
const ProductShowcase = ({ isActive, product, index }) => {
  const [isIntroMode, setIsIntroMode] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setIsIntroMode(true);
      const timer = setTimeout(() => {
        setIsIntroMode(false);
      }, 5500);
      return () => clearTimeout(timer);
    } else {
      setIsIntroMode(false);
    }
  }, [isActive]);

  const badgeColors = {
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    sky: "bg-sky-500/20 text-sky-400 border-sky-500/20",
    violet: "bg-violet-500/20 text-violet-400 border-violet-500/20",
  }[product.badgeType];

  const hoverText = {
    emerald: "group-hover:text-emerald-300",
    sky: "group-hover:text-sky-300",
    violet: "group-hover:text-violet-300",
  }[product.badgeType];

  // Docked position: 76px card + 10px gap, stacked from bottom
  const cardHeight = 76;
  const cardGap = 10;
  const baseBottom = 48;
  const dockedBottom = baseBottom + index * (cardHeight + cardGap);
  const zIndex = isIntroMode ? 70 : 60 - index;

  // --- Fullscreen intro mode ---
  if (isIntroMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ zIndex }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm"
      >
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center gap-6 p-12 bg-transparent rounded-2xl"
        >
          <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10 w-32 h-32 mb-4 flex items-center justify-center shrink-0">
            <img
              src={product.icon}
              alt={`${product.name} Icon`}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              {product.platform && (
                <span className="px-2 py-0.5 rounded text-[9px] font-medium tracking-wider uppercase border border-white/15 text-white/50 bg-white/5">
                  {product.platform}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${badgeColors}`}
              >
                {product.badge}
              </span>
            </div>

            <h3
              className={`font-light tracking-tight text-white ${hoverText} transition-colors text-6xl mb-4`}
            >
              {product.name}
            </h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-300 font-light max-w-2xl leading-relaxed mb-8"
            >
              {product.description}
            </motion.p>

            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/60 group-hover:text-white transition-colors mt-2 border border-white/20 px-6 py-3 rounded-full hover:bg-white/10">
              <span>{product.linkText}</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </a>
      </motion.div>
    );
  }

  // --- Docked compact mode ---
  return (
    <div
      style={{
        position: "absolute",
        width: 280,
        height: cardHeight,
        bottom: dockedBottom,
        zIndex,
      }}
      className="left-4 sm:left-8 md:left-12"
    >
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative border border-white/10 hover:border-white/30 rounded-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] p-3 flex items-center gap-3 bg-[#0a0f1c]/80 hover:-translate-y-1 w-full h-full overflow-hidden`}
      >
        <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10 w-9 h-9 flex items-center justify-center shrink-0">
          <img
            src={product.icon}
            alt={`${product.name} Icon`}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="flex flex-col flex-1 text-left overflow-hidden">
          <div className="flex items-center gap-1.5 mb-1">
            {product.platform && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-medium tracking-wider uppercase border border-white/15 text-white/50 bg-white/5">
                {product.platform}
              </span>
            )}
            <span
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase border ${badgeColors}`}
            >
              {product.badge}
            </span>
          </div>

          <h3
            className={`font-light tracking-tight text-white ${hoverText} transition-colors text-sm leading-tight`}
          >
            {product.name}
          </h3>

          <p className="text-[10px] text-gray-400 font-light leading-relaxed truncate w-full">
            {product.shortDescription}
          </p>
        </div>
      </a>
    </div>
  );
};

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loopCount, setLoopCount] = useState(0);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 40, damping: 35 });

  // Initial fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Animation Loop Logic
  useEffect(() => {
    let controls;
    const runLoop = async () => {
      progress.set(0);
      controls = animate(progress, 1, {
        duration: 30,
        ease: "linear",
      });

      try {
        await controls.finished;
        setLoopCount((prev) => prev + 1);
        runLoop();
      } catch (e) {
        // Animation stopped
      }
    };

    runLoop();
    return () => controls?.stop();
  }, [progress]);

  // Synchronized Scale and Offset logic
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

  const unifiedWeight = "font-light";
  const theOpacity = useTransform(
    progress,
    [0.72, 0.8, 0.88, 0.93],
    [0, 1, 1, 0],
  );
  const theTranslateX = useTransform(smoothProgress, [0.72, 0.8], [-30, 0]);
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
  const blackOutOpacity = useTransform(
    progress,
    [0, 0.05, 0.94, 0.98, 1],
    [1, 0, 0, 1, 1],
  );

  return (
    <div className="bg-[#00050d] h-screen w-full overflow-hidden text-white font-sans relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: initialLoading ? 0 : 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
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

        {/* Main Visual Core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <motion.div
            style={{ scale: logoScale, x: phiCenterOffset }}
            className="flex items-center gap-0"
          >
            <motion.div
              style={{ opacity: theOpacity, x: theTranslateX }}
              className={`text-[95px] ${unifiedWeight} tracking-tighter leading-none mr-8 translate-y-[8px]`}
            >
              The
            </motion.div>
            <PhiSymbol progress={smoothProgress} rawProgress={progress} />
            <motion.div
              style={{ opacity: neOpacity, x: neTranslateX }}
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

        {/* Loop Blackout Mask */}
        <motion.div
          style={{ opacity: blackOutOpacity }}
          className="absolute inset-0 bg-[#00050d] pointer-events-none z-[100]"
        />

        {/* Decor */}
        <div className="absolute bottom-12 right-12 z-50 flex flex-col items-end opacity-20">
          <span className="text-[8px] tracking-[0.4em] uppercase">
            Phine Apps Collection
          </span>
          <div className="w-10 h-[1px] bg-white mt-2" />
        </div>
      </motion.div>

      {/* Product List - Render ALL products, active one gets focus */}
      {PRODUCTS.map((product, index) => (
        <ProductShowcase
          key={product.id}
          index={index}
          product={product}
          isActive={index === loopCount % PRODUCTS.length}
        />
      ))}
    </div>
  );
}

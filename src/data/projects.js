/**
 * Project data — real content from Arshon's resume + portfolio site.
 */
export const projects = [
  {
    id: 1,
    title: "Skyryse Flight Systems",
    description:
      "Low-latency telemetry and control systems for the first optionally piloted FAA-conforming fly-by-wire helicopter. Rust ground station over LoS/5G with sub-12ms p99 control latency, 40 Hz telemetry fan-out, and lock-free ring buffer architecture.",
    tech: ["Rust", "C", "UDP", "Redis", "InfluxDB", "RTOS"],
    links: {},
    color: "#00e5ff",
  },
  {
    id: 2,
    title: "FCC Simulator",
    description:
      "Cross-platform Rust flight control computer simulator with deterministic 100 Hz pacing and p99 jitter under 0.5ms. Used for ground-station integration testing and telemetry validation.",
    tech: ["Rust", "UDP", "Real-Time Systems"],
    links: {},
    color: "#2979ff",
  },
  {
    id: 3,
    title: "Yolked AI",
    description:
      "AI-powered fitness platform with a website and native iOS app. Integrates GPT-4 for personalized workout and nutrition plans with real-time progress tracking.",
    tech: ["Node.js", "AWS Amplify", "Redis", "SwiftUI", "GPT-4"],
    links: {},
    color: "#00e5ff",
  },
  {
    id: 4,
    title: "Amazon SCOT Platform",
    description:
      "Migrated ML model backtesting to serverless architecture on AWS EMR Serverless, achieving a 600% boost in data granularity. Built a React/TypeScript dashboard and multi-stage ETL orchestration platform.",
    tech: ["TypeScript", "React", "AWS EMR", "DynamoDB", "Serverless"],
    links: {},
    color: "#00bfa5",
  },
  {
    id: 5,
    title: "Build-a-Fair",
    description:
      "Virtual job fair platform funded through the optiMize Innovation Challenge. Real-time communication via WebSocket APIs with Firebase backend and React frontend.",
    tech: ["React", "Firebase", "WebSocket", "REST API"],
    links: {},
    color: "#7c4dff",
  },
  {
    id: 6,
    title: "This Portfolio",
    description:
      "Immersive Three.js portfolio with 80K particles morphing between scenes via custom GLSL shaders. MediaPipe hand gesture navigation, glass-morphism UI, and spline camera paths.",
    tech: ["Svelte 5", "Three.js", "GLSL", "MediaPipe"],
    links: {
      github: "https://github.com/arshonsaadati",
    },
    color: "#e040fb",
  },
];

/**
 * Project data — real content from Arshon's resume + portfolio site.
 */
export const projects = [
  {
    id: 1,
    title: "Skyryse Flight Systems",
    description:
      "Low-latency telemetry and control systems for the first optionally piloted FAA-conforming fly-by-wire helicopter. Rust ground station over LoS/5G with sub-12ms p99 control latency, 40 Hz telemetry fan-out, and lock-free ring buffer architecture.",
    longDescription:
      "Built the ground station software for Skyryse's revolutionary fly-by-wire helicopter — the first optionally piloted aircraft to receive FAA conformity. The system handles real-time telemetry ingestion at 40 Hz, lock-free ring buffer architecture for zero-copy data paths, and LoS/5G redundant communication links.\n\nKey achievements include sub-12ms p99 control latency over unreliable RF links, a Redis-backed telemetry fan-out serving multiple concurrent operator displays, and InfluxDB time-series logging for post-flight analysis.",
    achievements: [
      "Sub-12ms p99 control latency over LoS/5G",
      "40 Hz telemetry fan-out to multiple operator displays",
      "Lock-free ring buffer — zero allocation in hot path",
      "First FAA-conforming optionally piloted helicopter",
    ],
    tech: ["Rust", "C", "UDP", "Redis", "InfluxDB", "RTOS"],
    links: {},
    color: "#00e5ff",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format",
  },
  {
    id: 2,
    title: "FCC Simulator",
    description:
      "Cross-platform Rust flight control computer simulator with deterministic 100 Hz pacing and p99 jitter under 0.5ms. Used for ground-station integration testing and telemetry validation.",
    longDescription:
      "A hardware-in-the-loop simulator that faithfully replicates the flight control computer's behavior on commodity hardware. Enables the ground station team to run full integration tests without access to physical hardware.\n\nThe simulator achieves deterministic 100 Hz pacing using high-resolution timers and busy-wait loops calibrated at startup. UDP socket emulation mirrors the exact wire format of the embedded FCC, allowing the real ground station binary to connect without modification.",
    achievements: [
      "Deterministic 100 Hz simulation loop",
      "P99 jitter under 0.5ms on standard Linux hardware",
      "Exact wire-format UDP emulation — no ground station changes needed",
      "Cross-platform: runs on Linux, macOS, and Windows",
    ],
    tech: ["Rust", "UDP", "Real-Time Systems", "HIL Testing"],
    links: {},
    color: "#2979ff",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format",
  },
  {
    id: 3,
    title: "Yolked AI",
    description:
      "AI-powered fitness platform with a website and native iOS app. Integrates GPT-4 for personalized workout and nutrition plans with real-time progress tracking.",
    longDescription:
      "A full-stack fitness coaching platform that uses GPT-4 to generate personalized workout and nutrition plans based on user goals, fitness level, and dietary preferences. The iOS app provides real-time progress tracking with streak visualization.\n\nThe backend uses AWS Amplify for auth and data sync, Redis for session state and rate limiting, and a Node.js API layer for GPT-4 integration with prompt engineering optimized for structured fitness output.",
    achievements: [
      "GPT-4 personalized workout + nutrition plan generation",
      "Native iOS app with SwiftUI and real-time sync",
      "Redis-backed session management and rate limiting",
      "Launched to 200+ beta users",
    ],
    tech: ["Node.js", "AWS Amplify", "Redis", "SwiftUI", "GPT-4"],
    links: {},
    color: "#00e5ff",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format",
  },
  {
    id: 4,
    title: "Amazon SCOT Platform",
    description:
      "Migrated ML model backtesting to serverless architecture on AWS EMR Serverless, achieving a 600% boost in data granularity. Built a React/TypeScript dashboard and multi-stage ETL orchestration platform.",
    longDescription:
      "During an internship at Amazon, redesigned the Supply Chain Optimization Team's ML backtesting infrastructure from a fixed-cluster Spark setup to a serverless EMR architecture. The migration enabled on-demand scaling and dramatically reduced idle compute costs.\n\nBuilt a React/TypeScript dashboard for visualizing backtest results and model performance metrics. Designed a multi-stage ETL pipeline with DynamoDB checkpointing for fault tolerance.",
    achievements: [
      "600% increase in data granularity for ML backtests",
      "Serverless EMR migration — eliminated idle cluster costs",
      "React/TypeScript dashboard for model performance visualization",
      "Multi-stage ETL with DynamoDB checkpointing",
    ],
    tech: ["TypeScript", "React", "AWS EMR", "DynamoDB", "Serverless", "Apache Spark"],
    links: {},
    color: "#00bfa5",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format",
  },
  {
    id: 5,
    title: "Build-a-Fair",
    description:
      "Virtual job fair platform funded through the optiMize Innovation Challenge. Real-time communication via WebSocket APIs with Firebase backend and React frontend.",
    longDescription:
      "Built a virtual job fair platform during the COVID-era pivot to remote recruiting. Selected and funded through the University of Michigan's optiMize Innovation Challenge for social impact.\n\nThe platform enables employers to create virtual booths with live video sessions, real-time chat powered by WebSocket APIs, and asynchronous Q&A boards. Firebase provides the real-time database backbone.",
    achievements: [
      "Funded through optiMize Innovation Challenge",
      "Real-time chat via WebSocket API",
      "Live video session scheduling and hosting",
      "Deployed for 3 University of Michigan career fairs",
    ],
    tech: ["React", "Firebase", "WebSocket", "REST API", "Node.js"],
    links: {},
    color: "#7c4dff",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format",
  },
  {
    id: 6,
    title: "This Portfolio",
    description:
      "Immersive Three.js portfolio with 80K particles morphing between scenes via custom GLSL shaders. MediaPipe hand gesture navigation, glass-morphism UI, and spline camera paths.",
    longDescription:
      "A fully custom 3D portfolio built from scratch using Svelte 5 and Three.js. 80,000 particles are distributed across custom formations and morph smoothly between scenes using GLSL shader-driven lerp.\n\nNavigation uses spline camera paths for cinematic section transitions. MediaPipe hand tracking enables gesture-based navigation. The UI uses glass-morphism overlays that fade in contextually.",
    achievements: [
      "80K-particle GLSL morphing system across 4 scenes",
      "Spline camera paths for cinematic section transitions",
      "MediaPipe hand gesture navigation",
      "Custom particle text renderer — no textures, pure geometry",
    ],
    tech: ["Svelte 5", "Three.js", "GLSL", "MediaPipe", "Vite"],
    links: {
      github: "https://github.com/arshonsaadati",
    },
    color: "#e040fb",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format",
  },
];

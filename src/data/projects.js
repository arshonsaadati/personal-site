/**
 * Project data for the portfolio.
 * Each project has a title, description, tech stack, links, and accent color.
 */
export const projects = [
  {
    id: 'particle-portfolio',
    title: 'Particle Portfolio',
    description: 'An immersive Three.js portfolio with 80K morphing particles and hand gesture navigation via MediaPipe.',
    tech: ['Three.js', 'Svelte 5', 'GLSL', 'MediaPipe'],
    links: { github: '#', live: '#' },
    color: '#00e5ff',
  },
  {
    id: 'neural-search',
    title: 'Neural Search Engine',
    description: 'Semantic search platform using vector embeddings and approximate nearest neighbor indexing.',
    tech: ['Python', 'FastAPI', 'PyTorch', 'Pinecone'],
    links: { github: '#', live: '#' },
    color: '#2979ff',
  },
  {
    id: 'devops-dashboard',
    title: 'DevOps Dashboard',
    description: 'Real-time infrastructure monitoring with alerting, log aggregation, and deployment tracking.',
    tech: ['React', 'Go', 'Grafana', 'Kubernetes'],
    links: { github: '#' },
    color: '#00bfa5',
  },
  {
    id: 'chat-platform',
    title: 'Realtime Chat Platform',
    description: 'End-to-end encrypted messaging with WebSocket rooms, file sharing, and presence indicators.',
    tech: ['Node.js', 'WebSockets', 'Redis', 'PostgreSQL'],
    links: { github: '#', live: '#' },
    color: '#7c4dff',
  },
  {
    id: 'ml-pipeline',
    title: 'ML Pipeline Framework',
    description: 'Declarative machine learning pipeline builder with automated feature engineering and model selection.',
    tech: ['Python', 'Airflow', 'Spark', 'MLflow'],
    links: { github: '#' },
    color: '#ff6e40',
  },
  {
    id: 'game-engine',
    title: '2D Game Engine',
    description: 'Lightweight ECS-based game engine with physics, sprite batching, and a visual scene editor.',
    tech: ['Rust', 'WebAssembly', 'WebGL', 'TypeScript'],
    links: { github: '#', live: '#' },
    color: '#ffd54f',
  },
]

<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const COUNT = 3000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
      col[i * 3] = 0.4 + Math.random() * 0.3;
      col[i * 3 + 1] = 0.5 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const particles = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    }));
    scene.add(particles);

    let mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  });
</script>

<main>
  <div class="canvas-container" bind:this={container}></div>
  <div class="content">
    <h1>Arshon Saadati</h1>
    <p class="tagline">Software Engineer</p>
    <div class="links">
      <a href="https://github.com/arshonsaadati" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    background: #000;
    font-family: -apple-system, 'Helvetica Neue', sans-serif;
  }

  .canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: #fff;
    text-align: center;
    pointer-events: none;
  }

  h1 {
    font-size: 4rem;
    font-weight: 200;
    letter-spacing: 12px;
    margin: 0;
    text-transform: uppercase;
    background: linear-gradient(to right, #c0c0ff, #ffffff, #c0c0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tagline {
    font-size: 1rem;
    letter-spacing: 6px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 16px;
    text-transform: uppercase;
  }

  .links {
    margin-top: 40px;
    pointer-events: all;
  }

  .links a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    transition: all 0.3s;
  }

  .links a:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.5);
  }
</style>

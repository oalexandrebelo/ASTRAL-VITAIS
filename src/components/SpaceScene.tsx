import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SpaceSceneProps {
  paused: boolean;
  mode: 'orbit' | 'crew';
  alert?: boolean;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Original stylized geography for an illustrative planet, not scientific cartography. */
function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const random = seededRandom(1701);
  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, '#213c4c');
  ocean.addColorStop(0.4, '#15394b');
  ocean.addColorStop(0.65, '#153246');
  ocean.addColorStop(1, '#1d3243');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const continents: number[][] = [
    [-168,70,-156,71,-142,69,-130,70,-124,65,-112,69,-99,72,-84,73,-67,61,-55,53,-65,48,-76,44,-81,31,-89,27,-91,20,-86,16,-84,10,-79,8,-79,14,-87,22,-95,30,-106,31,-115,31,-123,40,-128,51,-140,59,-152,59,-164,64],
    [-81,12,-72,12,-62,8,-51,4,-46,-1,-35,-6,-37,-16,-43,-23,-49,-28,-53,-35,-59,-43,-66,-55,-73,-51,-75,-39,-72,-27,-77,-14,-82,-3],
    [-18,36,-5,37,11,37,24,32,32,31,35,24,42,13,50,12,49,3,42,-12,35,-19,33,-29,22,-35,17,-29,13,-17,10,-5,3,4,-7,5,-16,14,-17,24],
    [-10,36,-10,43,-5,48,-1,51,-5,56,-3,60,4,58,9,54,12,59,7,64,18,71,30,70,36,62,48,68,63,70,79,73,103,76,119,72,133,71,151,70,166,66,178,64,170,55,157,52,150,45,142,46,137,36,127,39,121,32,121,23,113,20,109,11,104,1,99,6,98,18,91,22,87,21,81,7,75,12,70,24,61,25,56,26,51,15,44,14,42,22,36,30,27,38,20,40,16,38,12,43,8,44,3,42,-2,36],
    [112,-22,115,-15,123,-14,129,-12,136,-12,141,-16,145,-15,153,-25,150,-35,141,-39,132,-34,121,-35,114,-30],
    [-52,59,-43,61,-34,69,-20,78,-28,83,-48,84,-61,79,-62,70],
    [47,-13,51,-16,49,-24,44,-26,43,-20],
    [130,32,138,38,142,43,145,42,140,34,134,31],
    [96,5,104,-2,106,-6,102,-5,98,0],
    [109,-1,114,5,119,1,117,-4,112,-4],
    [130,-3,140,-2,149,-6,145,-10,136,-7],
    [166,-34,173,-40,176,-41,170,-47,166,-45,170,-40],
    [-180,-78,-150,-73,-120,-75,-90,-74,-65,-67,-59,-75,-30,-78,0,-72,30,-70,60,-68,90,-67,120,-70,150,-74,180,-78,180,-90,-180,-90],
  ];
  const path = new Path2D();
  for (const polygon of continents) {
    for (let index = 0; index < polygon.length; index += 2) {
      const x = (polygon[index] + 180) / 360 * canvas.width;
      const y = (90 - polygon[index + 1]) / 180 * canvas.height;
      if (index === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    path.closePath();
  }
  ctx.save();
  ctx.clip(path);
  const land = ctx.createLinearGradient(0, 0, 0, canvas.height);
  land.addColorStop(0, '#c4cdca');
  land.addColorStop(0.19, '#788e83');
  land.addColorStop(0.35, '#9a967b');
  land.addColorStop(0.48, '#57776b');
  land.addColorStop(0.6, '#687a68');
  land.addColorStop(0.75, '#8d9b88');
  land.addColorStop(0.9, '#d5dedb');
  ctx.fillStyle = land;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < 10000; index++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const size = random() * 9 + 1;
    ctx.fillStyle = index % 3 ? `rgba(20,47,36,${random() * 0.15})` : `rgba(210,192,150,${random() * 0.18})`;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 2.5, size, random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(141,185,191,0.26)';
  ctx.lineWidth = 2;
  ctx.stroke(path);
  for (let index = 0; index < 800; index++) {
    ctx.fillStyle = `rgba(220,238,245,${random() * 0.025})`;
    ctx.fillRect(random() * canvas.width, random() * canvas.height, random() * 35, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const random = seededRandom(473);
  ctx.lineCap = 'round';
  for (let index = 0; index < 430; index++) {
    const x = random() * canvas.width;
    const y = 20 + random() * (canvas.height - 40);
    const length = 10 + random() * 85;
    ctx.strokeStyle = `rgba(230,243,246,${0.03 + random() * 0.18})`;
    ctx.lineWidth = random() * 7 + 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + length * 0.25, y - 12, x + length * 0.65, y + 13, x + length, y + 4);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createAstronaut(textures: Set<THREE.Texture>) {
  const figure = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: '#e6e7de', roughness: 0.62, metalness: 0.12 });
  const joint = new THREE.MeshStandardMaterial({ color: '#324451', roughness: 0.73 });
  const trim = new THREE.MeshStandardMaterial({ color: '#8a9aa0', metalness: 0.5, roughness: 0.4 });
  const orange = new THREE.MeshStandardMaterial({ color: '#e38c4c', roughness: 0.5 });
  const visor = new THREE.MeshPhongMaterial({ color: '#b58a45', specular: '#fff1bd', shininess: 95 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#d7e4e9', transparent: true, opacity: 0.11, roughness: 0.1, metalness: 0.4 });
  const panel = new THREE.MeshStandardMaterial({ color: '#172c3c', roughness: 0.5 });
  const screen = new THREE.MeshBasicMaterial({ color: '#96ebe2' });

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(x, y, z);
    figure.add(item);
    return item;
  }
  mesh(new THREE.BoxGeometry(0.62, 0.76, 0.3), joint, 0, 0.28, -0.28);
  mesh(new THREE.BoxGeometry(0.47, 0.67, 0.08), suit, 0, 0.28, -0.47);
  mesh(new THREE.CapsuleGeometry(0.34, 0.44, 6, 16), suit, 0, 0.22, 0);
  mesh(new THREE.SphereGeometry(0.47, 32, 24), suit, 0, 1, 0);
  mesh(new THREE.SphereGeometry(0.447, 32, 20, 0, Math.PI, Math.PI * 0.2, Math.PI * 0.64), visor, 0, 1, 0.035);
  mesh(new THREE.SphereGeometry(0.456, 24, 16, 0, Math.PI, Math.PI * 0.2, Math.PI * 0.64), glass, 0, 1, 0.037);
  const collar = mesh(new THREE.TorusGeometry(0.3, 0.055, 8, 24), trim, 0, 0.64, 0);
  collar.rotation.x = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.4, 0.3, 0.09), panel, 0, 0.3, 0.3);
  mesh(new THREE.BoxGeometry(0.2, 0.055, 0.008), screen, -0.035, 0.35, 0.352);
  for (let index = 0; index < 3; index++) mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 8), orange, -0.09 + index * 0.09, 0.22, 0.36).rotation.x = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.56, 0.24, 0.35), suit, 0, -0.3, 0);

  for (const side of [-1, 1]) {
    const shoulder = mesh(new THREE.SphereGeometry(0.18, 16, 12), suit, side * 0.36, 0.44, 0);
    shoulder.scale.set(1.1, 1, 1);
    const upperArm = mesh(new THREE.CapsuleGeometry(0.132, 0.3, 5, 12), suit, side * 0.48, 0.2, 0);
    upperArm.rotation.z = side * 0.42;
    mesh(new THREE.SphereGeometry(0.135, 14, 12), joint, side * 0.56, -0.02, 0);
    const forearm = mesh(new THREE.CapsuleGeometry(0.125, 0.24, 5, 12), suit, side * 0.65, -0.17, 0.05);
    forearm.rotation.z = side * 0.5;
    mesh(new THREE.SphereGeometry(0.14, 16, 12), suit, side * 0.73, -0.35, 0.1).scale.set(0.8, 1.2, 1);
    const stripe = mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.065, 16), orange, side * 0.49, 0.18, 0);
    stripe.rotation.z = side * 0.42;
    const leg = mesh(new THREE.CapsuleGeometry(0.16, 0.52, 6, 16), suit, side * 0.2, -0.74, 0);
    leg.rotation.z = side * 0.1;
    mesh(new THREE.CylinderGeometry(0.166, 0.166, 0.07, 16), trim, side * 0.22, -0.76, 0);
    const boot = mesh(new THREE.BoxGeometry(0.29, 0.23, 0.43), suit, side * 0.23, -1.13, 0.075);
    boot.rotation.z = side * 0.1;
    mesh(new THREE.BoxGeometry(0.3, 0.06, 0.44), joint, side * 0.23, -1.26, 0.075);
  }

  const badgeCanvas = document.createElement('canvas');
  badgeCanvas.width = 128;
  badgeCanvas.height = 64;
  const context = badgeCanvas.getContext('2d');
  if (context) {
    context.fillStyle = '#183545';
    context.fillRect(0, 0, 128, 64);
    context.fillStyle = '#c9f5ec';
    context.font = 'bold 34px sans-serif';
    context.fillText('AV', 11, 44);
    context.fillStyle = '#e79957';
    context.fillRect(89, 15, 6, 34);
    const badge = new THREE.CanvasTexture(badgeCanvas);
    badge.colorSpace = THREE.SRGBColorSpace;
    textures.add(badge);
    mesh(new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshBasicMaterial({ map: badge }), 0, 0.54, 0.31);
  }
  figure.rotation.set(0.1, -0.34, 0.12);
  return figure;
}

export default function SpaceScene({ paused, mode, alert = false }: SpaceSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef({ paused, mode, alert });
  const invalidateRef = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    optionsRef.current = { paused, mode, alert };
    invalidateRef.current?.();
  }, [paused, mode, alert]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 0.15, 9.4);
    const textures = new Set<THREE.Texture>();
    const earthTexture = createEarthTexture();
    const cloudTexture = createCloudTexture();
    if (earthTexture) textures.add(earthTexture);
    if (cloudTexture) textures.add(cloudTexture);

    const world = new THREE.Group();
    world.position.set(-0.55, -0.05, -0.5);
    world.rotation.z = 0.22;
    scene.add(world);
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 64, 48),
      new THREE.MeshPhongMaterial({ map: earthTexture, color: earthTexture ? '#ffffff' : '#183b51', specular: '#628d9b', shininess: 22 }),
    );
    earth.rotation.y = -1.15;
    world.add(earth);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.415, 48, 32),
      new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true, opacity: 0.5, depthWrite: false, color: '#e1f2fa' }),
    );
    clouds.rotation.y = -1.15;
    world.add(clouds);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color('#39b4e6') }, strength: { value: 0.75 } },
      vertexShader: `varying vec3 vNormal; varying vec3 vEye;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal); vEye = -mv.xyz;
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 glowColor; uniform float strength; varying vec3 vNormal; varying vec3 vEye;
        void main() { float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vEye))), 3.2);
          gl_FragColor = vec4(glowColor, rim * strength); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    world.add(new THREE.Mesh(new THREE.SphereGeometry(2.47, 48, 32), atmosphereMaterial));
    const outerAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.52, 40, 28),
      atmosphereMaterial.clone(),
    );
    outerAtmosphere.material.uniforms.strength.value = 0.2;
    world.add(outerAtmosphere);

    const orbit = new THREE.Group();
    orbit.position.copy(world.position);
    orbit.rotation.set(1.05, 0.22, -0.48);
    const orbitalPoints: THREE.Vector3[] = [];
    for (let index = 0; index < 180; index++) {
      const angle = index / 180 * Math.PI * 2;
      orbitalPoints.push(new THREE.Vector3(Math.cos(angle) * 3.18, Math.sin(angle) * 3.18, 0));
    }
    const orbitalMaterial = new THREE.LineBasicMaterial({ color: '#8db2c0', transparent: true, opacity: 0.3 });
    orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(orbitalPoints), orbitalMaterial));
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: '#c6f2ee' }));
    orbit.add(satellite);
    scene.add(orbit);

    const astronaut = createAstronaut(textures);
    astronaut.position.set(2.35, -0.02, 1.1);
    astronaut.scale.setScalar(0.76);
    scene.add(astronaut);

    const random = seededRandom(8188);
    const positions = new Float32Array(900 * 3);
    const colors = new Float32Array(900 * 3);
    for (let index = 0; index < 900; index++) {
      positions[index * 3] = (random() - 0.5) * 85;
      positions[index * 3 + 1] = (random() - 0.5) * 60;
      positions[index * 3 + 2] = -8 - random() * 45;
      const brightness = 0.3 + random() * 0.6;
      colors[index * 3] = brightness * 0.85;
      colors[index * 3 + 1] = brightness * 0.94;
      colors[index * 3 + 2] = brightness;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true, depthWrite: false })));

    scene.add(new THREE.AmbientLight('#4a7190', 0.65));
    const sunlight = new THREE.DirectionalLight('#fff4dd', 3.4);
    sunlight.position.set(-3, 4, 5);
    scene.add(sunlight);
    const rimLight = new THREE.PointLight('#75d5ff', 32, 16);
    rimLight.position.set(4, 2, 2);
    scene.add(rimLight);
    const backLight = new THREE.DirectionalLight('#386d9a', 0.55);
    backLight.position.set(2, -2, -4);
    scene.add(backLight);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = media.matches;
    let raf = 0;
    let lastTime = 0;
    let sceneTime = 0;
    let disposed = false;
    let contextLost = false;
    const pointer = new THREE.Vector2();
    const cameraTarget = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3();
    const orbitColor = new THREE.Color('#8db2c0');
    const alertColor = new THREE.Color('#efaa69');
    const canAnimate = () => !optionsRef.current.paused && !reducedMotion && !document.hidden && !contextLost;

    function updateScene(delta: number, snap = false) {
      sceneTime += delta;
      const crewMode = optionsRef.current.mode === 'crew';
      const blend = snap ? 1 : 0.07;
      const parallaxX = reducedMotion ? 0 : pointer.x * 0.12;
      const parallaxY = reducedMotion ? 0 : pointer.y * 0.08;
      cameraPosition.set(crewMode ? 1.25 : 0, 0.15 + parallaxY, crewMode ? 5.55 : 9.4);
      cameraPosition.x += parallaxX;
      cameraTarget.set(crewMode ? 1.6 : 0, crewMode ? 0.05 : 0, crewMode ? 0.5 : 0);
      camera.position.lerp(cameraPosition, blend);
      currentLookAt.lerp(cameraTarget, blend);
      camera.lookAt(currentLookAt);
      earth.rotation.y = -1.15 + sceneTime * 0.014;
      clouds.rotation.y = -1.15 + sceneTime * 0.018;
      astronaut.position.y = -0.02 + Math.sin(sceneTime * 0.48) * 0.11;
      astronaut.rotation.z = 0.12 + Math.sin(sceneTime * 0.3) * 0.045;
      astronaut.rotation.y = -0.34 + Math.sin(sceneTime * 0.2) * 0.04;
      const angle = 0.4 + sceneTime * 0.065;
      satellite.position.set(Math.cos(angle) * 3.18, Math.sin(angle) * 3.18, 0);
      orbitalMaterial.color.copy(optionsRef.current.alert ? alertColor : orbitColor);
      orbitalMaterial.opacity = optionsRef.current.alert ? 0.55 : 0.3;
    }

    function frame(now: number) {
      raf = 0;
      if (disposed || !canAnimate()) return;
      if (now - lastTime >= 1000 / 30) {
        const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.065) : 0;
        lastTime = now;
        updateScene(delta);
        renderer.render(scene, camera);
      }
      raf = window.requestAnimationFrame(frame);
    }

    function invalidate() {
      if (disposed || contextLost) return;
      if (canAnimate()) {
        if (!raf) { lastTime = 0; raf = window.requestAnimationFrame(frame); }
      } else {
        window.cancelAnimationFrame(raf);
        raf = 0;
        if (!document.hidden) { updateScene(0, true); renderer.render(scene, camera); }
      }
    }
    invalidateRef.current = invalidate;

    function resize() {
      if (disposed) return;
      const width = Math.max(1, mount!.clientWidth);
      const height = Math.max(1, mount!.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      updateScene(0, true);
      renderer.render(scene, camera);
    }
    function pointerMove(event: PointerEvent) {
      if (reducedMotion || optionsRef.current.paused) return;
      const bounds = mount!.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height * 2 - 1));
    }
    function pointerLeave() { pointer.set(0, 0); }
    function motionChange(event: MediaQueryListEvent) { reducedMotion = event.matches; invalidate(); }
    function handleContextLost(event: Event) {
      event.preventDefault();
      contextLost = true;
      window.cancelAnimationFrame(raf);
      raf = 0;
      setFailed(true);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    mount.addEventListener('pointermove', pointerMove);
    mount.addEventListener('pointerleave', pointerLeave);
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    document.addEventListener('visibilitychange', invalidate);
    media.addEventListener('change', motionChange);
    resize();
    invalidate();

    return () => {
      disposed = true;
      invalidateRef.current = null;
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeEventListener('pointermove', pointerMove);
      mount.removeEventListener('pointerleave', pointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      document.removeEventListener('visibilitychange', invalidate);
      media.removeEventListener('change', motionChange);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const entries = Array.isArray(object.material) ? object.material : [object.material];
          entries.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className="space-scene" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {failed && (
        <div className="scene-fallback" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 56% 51%, rgba(22,73,106,.38), transparent 63%)' }}>
          <div style={{ position: 'absolute', width: '65%', aspectRatio: '1', borderRadius: '50%', left: '18%', top: '12%', background: 'radial-gradient(circle at 30% 28%, #547e8b, #173c56 34%, #081823 65%, #02080e 78%)', boxShadow: '0 0 3px 2px #378ab1, 0 0 48px rgba(38,126,176,.3)' }} />
        </div>
      )}
    </div>
  );
}

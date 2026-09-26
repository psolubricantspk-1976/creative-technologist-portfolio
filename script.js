document.addEventListener('DOMContentLoaded', () => {
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = 'Thanks — your message has been queued for a response.';
    }
    contactForm.reset();
  });

  if (!window.THREE || !window.gsap) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const background = document.getElementById('three-bg');
  if (!background) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.065);

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.2, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  background.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x00ffcc, 28, 30, 2.2);
  pointLight.position.set(3, 2, 5);
  scene.add(pointLight);

  const rimLight = new THREE.PointLight(0x7a74ff, 18, 30, 2);
  rimLight.position.set(-5, -2, 4);
  scene.add(rimLight);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd9fff6,
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    reflectivity: 1,
    envMapIntensity: 1.8,
    emissive: 0x08332d,
    emissiveIntensity: 0.9,
  });

  const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.38, 220, 32), coreMaterial);
  scene.add(torusKnot);

  const outlineMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.62, 0.04, 160, 12),
    new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.4, wireframe: true })
  );
  scene.add(outlineMesh);

  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    const radius = 2.8 + Math.random() * 4.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi) * 0.8;
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleField = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      color: 0x8df4dd,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particleField);

  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const resizeScene = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resizeScene);
  resizeScene();

  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      lerp: 0.08,
    });
    lenis.on('scroll', () => ScrollTrigger.update());
  }

  const scrollScene = () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    const targetZ = 5.8 - progress * 2.4;

    gsap.to(camera.position, {
      x: pointer.x * 0.65,
      y: pointer.y * 0.5 + progress * 0.55,
      z: targetZ,
      duration: 1.1,
      ease: 'power2.out',
    });

    gsap.to(torusKnot.rotation, {
      x: 0.8 + pointer.y * 0.7 + progress * 0.8,
      y: progress * 4.2 + pointer.x * 1.2,
      z: pointer.x * 0.8,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(outlineMesh.rotation, {
      x: 0.3 + pointer.y * 0.4,
      y: progress * 2.4 - pointer.x * 0.8,
      duration: 1.2,
      ease: 'power2.out',
    });
  };

  const updateActiveNav = () => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45;
    });

    navLinks.forEach((link) => {
      const active = current && link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('active', Boolean(active));
    });
  };

  const updateOnScroll = () => {
    scrollScene();
    updateActiveNav();
  };

  window.addEventListener('scroll', updateOnScroll, { passive: true });

  const animate = (time) => {
    const t = time * 0.001;

    torusKnot.rotation.x += 0.003;
    torusKnot.rotation.y += 0.004;
    torusKnot.rotation.z = pointer.x * 0.68;

    outlineMesh.rotation.x += 0.002;
    outlineMesh.rotation.y -= 0.002;

    particleField.rotation.y += 0.0005;
    particleField.rotation.x = Math.sin(t * 0.3) * 0.25;

    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.45;
    torusKnot.position.x += (targetX - torusKnot.position.x) * 0.04;
    torusKnot.position.y += (targetY - torusKnot.position.y) * 0.04;

    camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.025;
    camera.position.y += (-pointer.y * 0.35 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
  updateOnScroll();

  if (lenis) {
    const animateLenis = (time) => {
      lenis.raf(time);
      requestAnimationFrame(animateLenis);
    };
    requestAnimationFrame(animateLenis);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent = 'Thanks — your message has been queued for a response.';
    contactForm.reset();
  });

  if (!window.THREE || !window.gsap) return;

  const background = document.getElementById('three-bg');
  if (!background) return;

  let renderer;
  try {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.065);
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 6);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    background.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0x00ffcc, 28, 30, 2.2);
    pointLight.position.set(3, 2, 5);
    scene.add(pointLight);
    const rimLight = new THREE.PointLight(0x7a74ff, 18, 30, 2);
    rimLight.position.set(-5, -2, 4);
    scene.add(rimLight);

    const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.38, 180, 24), new THREE.MeshPhysicalMaterial({ color: 0xd9fff6, metalness: 1, roughness: 0.18, clearcoat: 1, emissive: 0x08332d, emissiveIntensity: 0.9 }));
    scene.add(torusKnot);
    const outlineMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.62, 0.04, 140, 10), new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.4, wireframe: true }));
    scene.add(outlineMesh);

    const positions = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i += 1) {
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
    const particleField = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0x8df4dd, size: 0.035, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(particleField);

    const pointer = { x: 0, y: 0 };
    window.addEventListener('pointermove', (event) => { pointer.x = (event.clientX / window.innerWidth) * 2 - 1; pointer.y = -(event.clientY / window.innerHeight) * 2 + 1; });
    const resizeScene = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', resizeScene);
    resizeScene();

    const updateActiveNav = () => {
      const sections = [...document.querySelectorAll('main section[id]')];
      const current = sections.find((section) => { const rect = section.getBoundingClientRect(); return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45; });
      navLinks.forEach((link) => link.classList.toggle('active', Boolean(current && link.getAttribute('href') === `#${current.id}`)));
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    const animate = (time) => {
      const t = time * 0.001;
      torusKnot.rotation.x += 0.003; torusKnot.rotation.y += 0.004; torusKnot.rotation.z = pointer.x * 0.68;
      outlineMesh.rotation.x += 0.002; outlineMesh.rotation.y -= 0.002;
      particleField.rotation.y += 0.0005; particleField.rotation.x = Math.sin(t * 0.3) * 0.25;
      torusKnot.position.x += (pointer.x * 0.6 - torusKnot.position.x) * 0.04;
      torusKnot.position.y += (pointer.y * 0.45 - torusKnot.position.y) * 0.04;
      camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.025;
      camera.position.y += (-pointer.y * 0.35 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0); renderer.render(scene, camera); requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    updateActiveNav();
  } catch (error) {
    console.warn('3D background unavailable; continuing with the static experience.', error);
    renderer?.dispose();
  }
});

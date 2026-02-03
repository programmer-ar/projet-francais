// --- THREE.JS BACKGROUND ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Abstract Shapes (Media Noise)
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 100, flatShading: true, transparent: true, opacity: 0.7 });
    const particleGroup = new THREE.Group();
    const particleCount = 80; 

    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 70;
        mesh.position.y = (Math.random() - 0.5) * 70;
        mesh.position.z = (Math.random() - 0.5) * 50;
        mesh.userData = { rotX: (Math.random() - 0.5) * 0.01, rotY: (Math.random() - 0.5) * 0.01 };
        const scale = Math.random() * 1.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        particleGroup.add(mesh);
    }

    // Accent Shapes (Data points)
    const accentGeo = new THREE.TetrahedronGeometry(1);
    const accentMatBlue = new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true });
    const accentMatRed = new THREE.MeshBasicMaterial({ color: 0xff4b4b, wireframe: true });

    for(let i=0; i<15; i++) {
        const mat = Math.random() > 0.5 ? accentMatBlue : accentMatRed;
        const mesh = new THREE.Mesh(accentGeo, mat);
        mesh.position.x = (Math.random() - 0.5) * 60;
        mesh.position.y = (Math.random() - 0.5) * 60;
        mesh.position.z = (Math.random() - 0.5) * 40;
        mesh.userData = { rotX: (Math.random() - 0.5) * 0.03, rotY: (Math.random() - 0.5) * 0.03 };
        particleGroup.add(mesh);
    }

    scene.add(particleGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00d2ff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        particleGroup.rotation.y += 0.05 * (mouseX * 0.005 - particleGroup.rotation.y);
        particleGroup.rotation.x += 0.05 * (mouseY * 0.005 - particleGroup.rotation.x);
        
        particleGroup.children.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotX;
            mesh.rotation.y += mesh.userData.rotY;
        });
        particleGroup.rotation.z += 0.0005;
        renderer.render(scene, camera);
    };

    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- GSAP ANIMATIONS ---
const initAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from("#hero h1", { duration: 1.2, y: 80, opacity: 0, ease: "power3.out" });
    gsap.from("#hero .hero-authors", { duration: 1.2, y: 40, opacity: 0, delay: 0.2, ease: "power3.out" });
    gsap.from("#hero p.hero-sub", { duration: 1.2, y: 40, opacity: 0, delay: 0.3, ease: "power3.out" });
    gsap.from("#hero .btn", { duration: 1, scale: 0.8, opacity: 0, delay: 0.6, ease: "back.out(1.7)" });

    // Sections Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: "top 85%" },
            x: -30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
    });

    // Glass Cards (Stagger)
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 90%" },
            y: 50, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power2.out"
        });
    });

    // Timeline Animation
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 80%" },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
    
    // Navbar shrink on scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if(window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
};

window.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initAnimations();
});

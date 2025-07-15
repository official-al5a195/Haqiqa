        // --- Main Element References ---
        const sceneContainer = document.getElementById('scene-container');
        const verifyButton = document.getElementById('verify-button');
        const urlInput = document.getElementById('url-input');
        const inputForm = document.getElementById('input-form');
        const resultsPanel = document.getElementById('results-panel');
        const resultTitle = document.getElementById('result-title');
        const resultContent = document.getElementById('result-content');
        const resetButton = document.getElementById('reset-button');
        
        // --- 3D Scene Setup ---
        let scene, camera, renderer, core, particles;

        function init() {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            sceneContainer.appendChild(renderer.domElement);

            // --- 3D OBJECTS ---

            // The Haqiqa Core
            const coreGeometry = new THREE.IcosahedronGeometry(1, 5);
            const coreMaterial = new THREE.MeshPhongMaterial({
                color: 0x2563eb,
                emissive: 0x1d4ed8,
                shininess: 100,
                specular: 0xffffff,
                flatShading: true,
            });
            core = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(core);

            // Background Particles
            const particleCount = 5000;
            const particlePositions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i++) {
                particlePositions[i] = (Math.random() - 0.5) * 20;
            }
            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            const particleMaterial = new THREE.PointsMaterial({
                color: 0x4f8ac9,
                size: 0.015,
                transparent: true,
                opacity: 0.5
            });
            particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0x87ceeb, 1, 100); // Sky blue light
            pointLight.position.set(2, 3, 4);
            scene.add(pointLight);
        }

        // --- Animation ---
        let isAnalyzing = false;
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Core animation
            core.rotation.y += 0.001;
            core.rotation.x += 0.001;
            core.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

            if (isAnalyzing) {
                // Speed up rotation and pulsate emissive light when analyzing
                core.rotation.y += 0.05;
                core.material.emissiveIntensity = Math.abs(Math.sin(elapsedTime * 10)) * 0.5 + 0.5;
            } else {
                core.material.emissiveIntensity = 1.0;
            }

            // Particle animation
            particles.rotation.y = elapsedTime * 0.05;

            renderer.render(scene, camera);
        }

        // --- UI & INTERACTION LOGIC ---

        function handleVerify() {
            if (!urlInput.value) {
                // Simple validation
                urlInput.classList.add('border-red-500', 'animate-pulse');
                setTimeout(() => urlInput.classList.remove('border-red-500', 'animate-pulse'), 2000);
                return;
            }

            isAnalyzing = true;
            
            // Hide the input form
            inputForm.classList.add('opacity-0');
            
            // Simulate AI analysis (2.5 seconds)
            setTimeout(() => {
                isAnalyzing = false;
                displayResults();
            }, 2500);
        }

        function displayResults() {
            // Mock results - randomly pick one
            const mockResults = [
                {
                    status: 'Verified',
                    color: 'text-green-400',
                    icon: '✅',
                    title: 'Content Verified',
                    content: `<p>Claim: The video shows a recent event.</p><p class="font-bold text-green-300">Status: True.</p><p>Source: Cross-referenced with major news outlets and public records. The event occurred on the date specified.</p>`
                },
                {
                    status: 'False',
                    color: 'text-red-400',
                    icon: '❌',
                    title: 'Content Debunked',
                    content: `<p>Claim: This image is from the recent protest.</p><p class="font-bold text-red-300">Status: False.</p><p>Correction: This image is from a different event that occurred 3 years ago. Reverse image search confirms the original context.</p>`
                },
                {
                    status: 'Unverifiable',
                    color: 'text-yellow-400',
                    icon: '⚠️',
                    title: 'Unverifiable Claim',
                    content: `<p>Claim: The audio in this voice note is authentic.</p><p class="font-bold text-yellow-300">Status: Unverifiable.</p><p>Context: AI analysis could not detect signs of digital manipulation, but the origin and speaker could not be confirmed. Exercise caution.</p>`
                }
            ];
            const result = mockResults[Math.floor(Math.random() * mockResults.length)];

            // Populate and show the results panel
            resultTitle.innerHTML = `<span class="mr-3 text-3xl">${result.icon}</span> ${result.title}`;
            resultTitle.className = `text-2xl font-bold mb-4 flex items-center ${result.color}`;
            resultContent.innerHTML = result.content;
            
            resultsPanel.classList.remove('hidden');
            setTimeout(() => {
                resultsPanel.classList.remove('opacity-0', 'scale-95');
            }, 10); // Short delay to allow display:block to apply before transition
        }

        function handleReset() {
            // Hide results panel
            resultsPanel.classList.add('opacity-0', 'scale-95');
            setTimeout(() => resultsPanel.classList.add('hidden'), 500);

            // Show input form
            urlInput.value = '';
            inputForm.classList.remove('opacity-0');
        }

        // --- EVENT LISTENERS ---
        verifyButton.addEventListener('click', handleVerify);
        resetButton.addEventListener('click', handleReset);
        
        // Handle window resizing
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // --- INITIALIZE ---
        init();
        animate();

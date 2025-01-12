let camera, scene, renderer;
let mesh;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const frontTexture = textureLoader.load('front_texture.jpg');
    const backTexture = textureLoader.load('back_texture.jpg');

    // Create materials for both sides
    const materials = [
        new THREE.MeshBasicMaterial({ map: frontTexture }),
        new THREE.MeshBasicMaterial({ map: backTexture })
    ];

    // Create double-sided mesh
    mesh = new THREE.Mesh(geometry, materials);
    mesh.material[1].side = THREE.BackSide;
    mesh.material[0].side = THREE.FrontSide;
    scene.add(mesh);

    // Position camera
    camera.position.z = 5;

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    
    // Mouse/Touch events
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('touchstart', onPointerDown);
    
    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('touchmove', onPointerMove);
    
    renderer.domElement.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('touchend', onPointerUp);
}

function onPointerDown(event) {
    isDragging = true;
    if (event.type === 'touchstart') {
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    } else {
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onPointerMove(event) {
    if (!isDragging) return;

    let currentPosition;
    if (event.type === 'touchmove') {
        currentPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    } else {
        currentPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    const deltaMove = {
        x: currentPosition.x - previousMousePosition.x,
        y: currentPosition.y - previousMousePosition.y
    };

    rotation.x += deltaMove.y * 0.005;
    rotation.y += deltaMove.x * 0.005;

    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;

    previousMousePosition = currentPosition;
}

function onPointerUp() {
    isDragging = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
} 
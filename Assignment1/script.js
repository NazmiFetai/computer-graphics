import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd1ffff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;

// Increase shadow map size for higher resolution
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

// Adjust near and far planes of the shadow camera
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// Slight bias to avoid shadow artifacts
directionalLight.shadow.bias = -0.0005;

// Rotate directional light slightly to improve shadows on building803
directionalLight.position.set(5, 15, 5);
directionalLight.target.position.set(-3, 0.5, 3);
scene.add(directionalLight.target);

scene.add(directionalLight);

// Additional Point Light for more brightness
const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
pointLight.position.set(-5, 10, -5);
pointLight.castShadow = true;
scene.add(pointLight);

// Geometry and materials
const buildingSmall = new THREE.BoxGeometry(1, 1, 2);
const buildingLarge = new THREE.BoxGeometry(1, 1, 4);
const roadGeo = new THREE.PlaneGeometry(1, 10);
const road2Geo = new THREE.PlaneGeometry(1, 4);
const plain = new THREE.PlaneGeometry(10, 10);

const blue = new THREE.MeshStandardMaterial({ color: 0x2f7bc2 });
const green = new THREE.MeshStandardMaterial({ color: 0x1aa135 });
const gray = new THREE.MeshStandardMaterial({ color: 0x484a48 });
const red = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Meshes
const grass = new THREE.Mesh(plain, green);
grass.receiveShadow = true;
const road = new THREE.Mesh(roadGeo, gray);
road.receiveShadow = true;
const road1 = new THREE.Mesh(road2Geo, gray);
road1.receiveShadow = true;
const road2 = new THREE.Mesh(road2Geo, gray);
road2.receiveShadow = true;
const building303 = new THREE.Mesh(buildingSmall, blue);
building303.castShadow = true;
const building807 = new THREE.Mesh(buildingLarge, blue);
building807.castShadow = true;
const building803 = new THREE.Mesh(buildingLarge, blue);
building803.castShadow = true;  // Enable shadow casting
building803.receiveShadow = true; // Enable shadow receiving

// Adjust shadow bias specifically for building803 to improve shadow quality
building803.shadow = { bias: -0.0001 };

// Slightly reposition building803 for optimal shadowing
building803.position.set(-3, 0.5, 3);
building803.rotateY(-0.8);

const movingSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), red);
movingSphere.castShadow = true;

// Set rotations
grass.rotation.x = -Math.PI / 2;
road.rotation.x = -Math.PI / 2;
road1.rotation.x = -Math.PI / 2;
road2.rotation.x = -Math.PI / 2;

// Set initial positions
grass.position.set(0, 0, 0);
road.position.set(0, 0.01, 0);
road1.position.set(-1.5, 0.01, 3.3);
road1.rotateZ(-0.8);

road2.position.set(1.5, 0.01, -3.3);
road2.rotateZ(-1.2);

building303.position.set(2, 0.5, -2);
building303.rotateY(-1.2);

building807.position.set(1.5, 0.5, 2);
building807.rotateY(0);

// Set sphere initial position
movingSphere.position.set(0, 0.3, -4);

// Add objects to the scene
scene.add(grass, road, road1, road2, building303, building807, building803, movingSphere);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 4;

// GSAP Animation
const timeline = gsap.timeline({ repeat: -1, yoyo: true, ease: "power1.inOut" });

timeline
  .to(movingSphere.position, { x: 0, z: 2, duration: 3 }) // Move along the main road
  .to(movingSphere.position, { x: -1.5, z: 3.3, duration: 2 }) // Turn left to follow road1
  .to(movingSphere.position, { x: 0, z: 1.4, duration: 3 }) // Return to the main road center
  .to(movingSphere.position, { x: 0, z: -2.6, duration: 3 }) // Turn right to follow road2
  .to(movingSphere.position, { x: 3, z: -4, duration: 2 }); // Return to the starting position

// Animation Loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

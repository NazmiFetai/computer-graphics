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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Function to create a more defined number texture with outline
function createNumberTexture(number) {
  const canvas = document.createElement('canvas');
  const size = 512; // Higher resolution for sharper details
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  // Set background color matching the building's color
  context.fillStyle = '#2f7bc2';
  context.fillRect(0, 0, size, size);

  // Define text styling
  context.font = 'bold 180px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Outline for contrast
  context.strokeStyle = '#000000';
  context.lineWidth = 16;
  context.strokeText(number, size / 2, size / 2);

  // Draw main white text
  context.fillStyle = '#ffffff';
  context.fillText(number, size / 2, size / 2);

  // Create and return texture
  return new THREE.CanvasTexture(canvas);
}

// Materials
const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x2f7bc2 });
const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x1aa135 });
const grayMaterial = new THREE.MeshStandardMaterial({ color: 0x484a48 });
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Geometry for ground and roads
const roadGeo = new THREE.PlaneGeometry(1, 10);
const road2Geo = new THREE.PlaneGeometry(1, 4);
const plain = new THREE.PlaneGeometry(10, 10);

// Meshes
const grass = new THREE.Mesh(plain, greenMaterial);
grass.receiveShadow = true;
const road = new THREE.Mesh(roadGeo, grayMaterial);
road.receiveShadow = true;
const road1 = new THREE.Mesh(road2Geo, grayMaterial);
road1.receiveShadow = true;
const road2 = new THREE.Mesh(road2Geo, grayMaterial);
road2.receiveShadow = true;
const movingSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), redMaterial);
movingSphere.castShadow = true;

// Function to create buildings with number labels on top
function createBuildingWithNumber(geometry, number) {
  const building = new THREE.Mesh(geometry, blueMaterial);
  building.castShadow = true;

  // Number label on top of the building
  const numberTexture = createNumberTexture(number);
  const numberMaterial = new THREE.MeshBasicMaterial({ map: numberTexture, transparent: true });
  const numberPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), numberMaterial);

  // Position number plane slightly above the building top
  numberPlane.position.set(0, geometry.parameters.height / 2 + 0.01, 0);
  numberPlane.rotation.x = -Math.PI / 2;

  // Group the building and number plane together
  const group = new THREE.Group();
  group.add(building);
  group.add(numberPlane);

  return group;
}

// Create buildings with numbered tops
const building303 = createBuildingWithNumber(new THREE.BoxGeometry(1, 1, 2), 303);
const building807 = createBuildingWithNumber(new THREE.BoxGeometry(1, 1, 4), 807);
const building803 = createBuildingWithNumber(new THREE.BoxGeometry(1, 1, 4), 803);

// Set positions and rotations
grass.rotation.x = -Math.PI / 2;
road.rotation.x = -Math.PI / 2;
road1.rotation.x = -Math.PI / 2;
road2.rotation.x = -Math.PI / 2;

grass.position.set(0, 0, 0);
road.position.set(0, 0.01, 0);
road1.position.set(-1.5, 0.01, 3.3);
road1.rotateZ(-0.8);

road2.position.set(1.5, 0.01, -3.3);
road2.rotateZ(-1.2);

building303.position.set(2, 0, -2);
building303.rotation.y = -1.2;

building807.position.set(1.5, 0, 2);
building807.rotation.y = 0;

building803.position.set(-3, 0, 3);
building803.rotation.y = -0.8;

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
  .to(movingSphere.position, { x: 0, z: 2, duration: 3 })
  .to(movingSphere.position, { x: -1.5, z: 3.3, duration: 2 })
  .to(movingSphere.position, { x: 0, z: 1.4, duration: 3 })
  .to(movingSphere.position, { x: 0, z: -2.6, duration: 3 })
  .to(movingSphere.position, { x: 3, z: -4, duration: 2 });

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

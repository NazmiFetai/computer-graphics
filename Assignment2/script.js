// Import dependencies from npm-installed modules.
import * as THREE from "https://cdn.skypack.dev/three@0.173.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.173.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn/skypack.dev/three@0.173.0/examples/jsm/loaders/GLTFLoader.js";

// Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();

// Skybox
const cubeTextureLoader = new THREE.CubeTextureLoader();
const skyboxTexture = cubeTextureLoader.load([
  "/textures/CubeTextures/px.jpg", // positive X
  "/textures/CubeTextures/nx.jpg", // negative X
  "/textures/CubeTextures/py.jpg", // positive Y
  "/textures/CubeTextures/ny.jpg", // negative Y
  "/textures/CubeTextures/pz.jpg", // positive Z
  "/textures/CubeTextures/nz.jpg", // negative Z
]);
scene.background = skyboxTexture;

// Room Dimensions
const roomWidth = 30;
const roomHeight = 15;
const roomDepth = 30;

// PerspectiveCamera and position it inside the room.
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// Renderer.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Overhead (point) light
const overheadLight = new THREE.PointLight(0xffffff, 0.8, 100, 0.5);
overheadLight.position.set(0, roomHeight / 2, 0);
scene.add(overheadLight);

// Additional point lights
const additionalLight1 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight1.position.set(roomWidth / 4, roomHeight / 2, roomDepth / 4);
scene.add(additionalLight1);

const additionalLight2 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight2.position.set(-roomWidth / 4, roomHeight / 2, roomDepth / 4);
scene.add(additionalLight2);

const additionalLight3 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight3.position.set(roomWidth / 4, roomHeight / 2, -roomDepth / 4);
scene.add(additionalLight3);

const additionalLight4 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight4.position.set(-roomWidth / 4, roomHeight / 2, -roomDepth / 4);
scene.add(additionalLight4);

// TEXTURES for Floor and Walls
const textureLoader = new THREE.TextureLoader();

// Floor textures
const floorTexture = textureLoader.load(
  "/textures/floor/floor.png",
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  }
);
const floorNormTexture = textureLoader.load(
  "/textures/floor/FloorNormal.png",
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  }
);
const floorRoughnessTexture = textureLoader.load(
  "/textures/floor/FloorRoughness.jpg",
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  }
);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  normalMap: floorNormTexture,
  roughnessMap: floorRoughnessTexture,
  roughness: 1,
});

// Wall textures
const wallTexture = textureLoader.load("/textures/wall/wall.png", (texture) => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
});
const wallNormalTexture = textureLoader.load(
  "/textures/wall/wallNormal.png",
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  }
);
const wallRoughnessTexture = textureLoader.load(
  "/textures/wall/wallRoughness.png",
  (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  }
);
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallTexture,
  normalMap: wallNormalTexture,
  roughnessMap: wallRoughnessTexture,
  roughness: 0.2,
});

// Room Geometry
// Floor
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -roomHeight / 2;
scene.add(floorMesh);

// Ceiling
const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const ceilingMaterial = new THREE.MeshStandardMaterial({
  map: wallTexture,
  normalMap: wallNormalTexture,
  roughnessMap: wallRoughnessTexture,
  roughness: 0.2,
});
const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingMesh.rotation.x = Math.PI / 2;
ceilingMesh.position.y = roomHeight / 2;
scene.add(ceilingMesh);

// Back Wall
const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.z = roomDepth / 2;
backWall.position.y = 0;
backWall.rotation.y = Math.PI;
scene.add(backWall);

// Left Wall
const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.x = -roomWidth / 2;
leftWall.position.y = 0;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// Right Wall
const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.x = roomWidth / 2;
rightWall.position.y = 0;
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// Front Wall with an Open Gap
// Top Panel
const topPanelHeight = 3;
const topPanelGeometry = new THREE.PlaneGeometry(roomWidth, topPanelHeight);
const topPanel = new THREE.Mesh(topPanelGeometry, wallMaterial);
topPanel.position.set(0, roomHeight / 2 - topPanelHeight / 2, -roomDepth / 2);
topPanel.rotation.y = 0;
scene.add(topPanel);

// Bottom Panel
const bottomPanelHeight = 3;
const bottomPanelGeometry = new THREE.PlaneGeometry(
  roomWidth,
  bottomPanelHeight
);
const bottomPanel = new THREE.Mesh(bottomPanelGeometry, wallMaterial);
bottomPanel.position.set(
  0,
  -roomHeight / 2 + bottomPanelHeight / 2,
  -roomDepth / 2
);
bottomPanel.rotation.y = 0;
scene.add(bottomPanel);

// Middle Row
const middlePanelHeight = roomHeight - topPanelHeight - bottomPanelHeight;
const windowGapWidth = 6;
const sidePanelWidth = (roomWidth - windowGapWidth) / 2;

// Left Middle Panel
const leftMiddleGeometry = new THREE.PlaneGeometry(
  sidePanelWidth,
  middlePanelHeight
);
const leftMiddlePanel = new THREE.Mesh(leftMiddleGeometry, wallMaterial);
leftMiddlePanel.position.set(
  -roomWidth / 2 + sidePanelWidth / 2,
  0,
  -roomDepth / 2
);
leftMiddlePanel.rotation.y = 0;
scene.add(leftMiddlePanel);

// Right Middle Panel
const rightMiddleGeometry = new THREE.PlaneGeometry(
  sidePanelWidth,
  middlePanelHeight
);
const rightMiddlePanel = new THREE.Mesh(rightMiddleGeometry, wallMaterial);
rightMiddlePanel.position.set(
  roomWidth / 2 - sidePanelWidth / 2,
  0,
  -roomDepth / 2
);
rightMiddlePanel.rotation.y = 0;
scene.add(rightMiddlePanel);

// GLTF Model Loader
function loadGLTFModel(url, options, scene) {
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      if (options.position) {
        model.position.set(
          options.position.x,
          options.position.y,
          options.position.z
        );
      }
      if (options.scale) {
        if (typeof options.scale === "number") {
          model.scale.set(options.scale, options.scale, options.scale);
        } else {
          model.scale.set(options.scale.x, options.scale.y, options.scale.z);
        }
      }
      if (options.rotation) {
        model.rotation.set(
          options.rotation.x,
          options.rotation.y,
          options.rotation.z
        );
      }
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading model: " + url, error);
    }
  );
}

// Place Desks and Chairs
const deskPositions = [
  { x: -6, y: -roomHeight / 2, z: -6 }, // Front left desk
  { x: 6, y: -roomHeight / 2, z: -6 }, // Front right desk
  { x: -6, y: -roomHeight / 2, z: 6 }, // Back left desk
  { x: 6, y: -roomHeight / 2, z: 6 }, // Back right desk
];

// Load each desk model
deskPositions.forEach((deskPos) => {
  loadGLTFModel(
    "/models/desk/scene.gltf",
    {
      position: deskPos,
      scale: 0.009, // Adjust as needed
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    scene
  );
});

// For each desk, load two chairs side by side
deskPositions.forEach((deskPos) => {
  // Left chair
  loadGLTFModel(
    "/models/chair/scene.gltf",
    {
      position: { x: deskPos.x - 1.4, y: deskPos.y, z: deskPos.z + 4.5 },
      scale: 5,
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    scene
  );
  // Right chair
  loadGLTFModel(
    "/models/chair/scene.gltf",
    {
      position: { x: deskPos.x - 1.4, y: deskPos.y, z: deskPos.z + 1.6 },
      scale: 5,
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    scene
  );
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

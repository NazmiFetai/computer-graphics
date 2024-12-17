import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();

raycaster.near = 0.0;
raycaster.far = 100;

const mouse = new THREE.Vector2();
const cubes = [];
let lastSelectedCube = null;
let lastSelectedCubeColor = null;

for (let i = 0; i < 30; i++) {
  const size = randBetween(0.2, 1);
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = randBetween(-4, 4);
  mesh.position.y = randBetween(-4, 4);
  mesh.position.z = randBetween(-5, 0);

  scene.add(mesh);
  cubes.push(mesh);
}

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement); // Append to body

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes); 

  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;

    if (lastSelectedCube && lastSelectedCube !== selectedCube) {
      lastSelectedCube.material.color.set(lastSelectedCubeColor);
    }

    lastSelectedCube = selectedCube;
    lastSelectedCubeColor = selectedCube.material.color.getHex();
    selectedCube.material.color.set(0xffffff);
  }
});


const animate = () => {
  controls.update();
  renderer.render(scene, camera); 
  requestAnimationFrame(animate);
};

animate();

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  return Math.random() * 0xffffff;
}
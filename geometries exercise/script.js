import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();


const geometry = new THREE.BoxGeometry(1, 1, 1);


const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); 


const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
directionalLight.position.set(5, 5, 5); 
scene.add(directionalLight);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 5);
scene.add(camera);


const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


const clock = new THREE.Clock();
const tick = () => {
    mesh.rotation.x += 0.01; 
    mesh.rotation.y += 0.01; 

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
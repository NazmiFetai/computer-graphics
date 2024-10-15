import * as THREE from 'three';

const scene= new THREE.Scene();

const camera= new THREE.PerspectiveCamera(
    75,window.innerWidth/window.innerHeight,
    0.1,1000);



const renderer =new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0x00ff00});
const cube = new THREE.Mesh(geometry,material);

scene.add(cube);


cube.position.x = -2;
camera.position.z = 5;

const tick = ()=> {
    console.log("A");
    renderer.render(scene,camera);
    requestAnimationFrame(tick);
}
 tick();
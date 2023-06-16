import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 8;
controls.lookSpeed = 0.08;

camera.position.set(5, 8, 30);

const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = function(url, item, total) {
//     console.log(`Started loading: ${url}`);
// }

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
}

// loadingManager.onError = function(url) {
//     console.error(`Got a problem loading: ${url}`);
// }

const gltfLoader = new GLTFLoader(loadingManager);

const rgbeLoader = new RGBELoader(loadingManager);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

rgbeLoader.load('./assets/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('./assets/mars_one_mission_-_base/scene.gltf', function(gltf) {
        const model = gltf.scene;
        scene.add(model);
    });
});

const clock = new THREE.Clock();
function animate() {
    renderer.render(scene, camera);
    controls.update( clock.getDelta() );
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
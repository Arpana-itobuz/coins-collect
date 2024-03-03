import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Timer } from "three/addons/misc/Timer.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { keyDown, keyUp } from "./keyboardController";
import { joystickController } from "./joystickController";
import { setMusic } from "./music";

const negativeCoinsLength = 10;

const bgAudio = setMusic(
  "https://res.cloudinary.com/dppmvx1jo/video/upload/v1709422911/music/mfgfyxbxg27nnzznzuvb.mp3"
);
const gameOver = setMusic(
  "https://res.cloudinary.com/dppmvx1jo/video/upload/v1709423656/music/nj26sm3qfh8jc8djbeda.wav"
);
const collectCoin = setMusic(
  "https://res.cloudinary.com/dppmvx1jo/video/upload/v1709427690/music/jlqicut1mjwlvevxshur.mp3"
);
import { noOfCoins, staticCoin } from "./coinPosition";

function init(font) {
  console.log("first");
  const canvas = document.querySelector("canvas.webgl");
  bgAudio.play();
  let positiveCoinsLength = noOfCoins;
  let positiveCoinHitCount = 0;
  let negativeCoinHitCount = 0;

  const scene = new THREE.Scene();
  // scene.background(null);
  const gltfLoader = new GLTFLoader();
  let model = null;
  let mixer = null;
  let modelInitPosition;

  let collectCoin = null;
  // let idle = null;
  let run = null;

  const sphereRadius = 1;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0,
  });
  const characterSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  characterSphere.position.set(0, 0.5, 0);
  // console.log("modelInitPosition :: ", modelInitPosition);
  scene.add(characterSphere);

  gltfLoader.load(
    "https://res.cloudinary.com/do0evtipd/image/upload/v1709456510/vicaoz2utolpaknynwa9.glb",
    (object) => {
      console.log("XBOT :: ", object);
      model = object.scene.children[0];
      modelInitPosition = new THREE.Vector3(object.scene.position);
      console.log(object.scene.position, modelInitPosition);
      mixer = new THREE.AnimationMixer(model);
      run = mixer.clipAction(object.animations[6]);
      collectCoin = mixer.clipAction(object.animations[0]);
      model.scale.set(0.2, 0.2, 0.2)
      scene.add(model);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  // Set your initial position
  // characterSphere.position.copy(modelInitPosition);

  // console.log(characterSphere)

  // const textureLoader = new THREE.TextureLoader();
  // const groundTexture = textureLoader.load(
  //     "https://console.cloudinary.com/pm/c-db3995cee4508d6151eff999593e10/media-explorer?assetId=44e9d397afbb216236937ac9fd42a755"
  // );

  // Create video texture from camera feed
  // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //   const video = document.createElement("video");
  //   video.srcObject = stream;
  //   video.play();

  //   const texture = new THREE.VideoTexture(video);
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.format = THREE.RGBAFormat;

  //   const geometry = new THREE.PlaneGeometry(16, 9);
  //   const material = new THREE.MeshBasicMaterial({ map: texture });
  //   const plane = new THREE.Mesh(geometry, material);
  //   scene.add(plane);
  // });

  // const textureLoader = new THREE.TextureLoader();
  // const groundTexture = textureLoader.load(
  //   "https://console.cloudinary.com/pm/c-db3995cee4508d6151eff999593e10/media-explorer?assetId=44e9d397afbb216236937ac9fd42a755"
  // );
  // groundTexture.magFilter = THREE.NearestFilter;

  // groundTexture.repeat.set(64, 64);
  // groundTexture.wrapS = THREE.RepeatWrapping;
  // groundTexture.wrapT = THREE.RepeatWrapping;

  // const ground = new THREE.Mesh(
  //   new THREE.PlaneGeometry(160, 160),
  //   new THREE.MeshStandardMaterial({
  //     map: groundTexture,
  //     metalness: 0,
  //     roughness: 0.9,
  //   })
  // );
  // ground.receiveShadow = true;
  // ground.rotation.x = -Math.PI * 0.5;
  // scene.add(ground);

  // let textureVid = document.createElement("video")
  const texturePath =
    "https://res.cloudinary.com/do0evtipd/image/upload/v1709437382/r5yauerfuzx5nzzb6mte.gif";

  const spriteTexture = new THREE.TextureLoader().load(texturePath);

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: spriteTexture,
    transparent: true,
  });

  const negativeTexturePath =
    "https://res.cloudinary.com/do0evtipd/image/upload/v1709451168/hhz4sasdbhfyjbf3qtr1.gif";
  const negativeCoinTexture = new THREE.TextureLoader().load(
    negativeTexturePath
  );
  const negativeCoinMaterial = new THREE.MeshBasicMaterial({
    map: negativeCoinTexture,
    transparent: true,
  });

  const coins = [];
  const negativeCoins = [];
  function placeNegetiveCoin() {
    for (let i = 0; i < negativeCoinsLength; i++) {
      const mesh = new THREE.Mesh(geometry, negativeCoinMaterial);
      mesh.rotation.set(Math.PI / 2, 0, 0);
      const x1 = Math.random() * 20 - 10; // Adjust the range according to your scene
      const z1 = Math.random() * 20 - 10; // Adjust the range according to your scene
      mesh.position.set(x1, 0.5, z1);
      negativeCoins.push(mesh);
      scene.add(mesh);
    }
  }

  function placeCoins() {
    for (let i = 0; i < positiveCoinsLength; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(Math.PI / 2, 0, 0);
  
      // mesh.rotateOnAxis(axis, degToRad(25))
      const x = staticCoin[i].x;
      const z = staticCoin[i].z;
      mesh.position.set(x, 0.5, z);
      scene.add(mesh);
      coins.push(mesh);
    }
  }

  function animateCoinsN() {
    coins.forEach((coin) => {
      coin.rotation.x += 0.01;
      coin.rotation.y += 0.1;
      coin.rotation.z += 0.1;
    });
    negativeCoins.forEach((coin) => {
      coin.rotation.x += 0.01;
      coin.rotation.y += 0.1;
      coin.rotation.z += 0.1;
    });
  }

  // const raycaster = new THREE.Raycaster();
  // const mouse = new THREE.Vector2();

  // import('@dimforge/rapier3d').then(RAPIER => {
  // const bodyDesc = RAPIER.RigidBodyDesc.dynamic();
  // let rigidBody = world.createRigidBody(bodyDesc);
  // collider = RAPIER.ColliderDesc.ball(0.5);
  // world.createCollider(collider, rigidBody.handle);
  // scene.remove()

  // })

  function boxCollision(model, coin) {
    // console.log("CHILD :: ", model,coin)
    const center1 = coin.position;
    const center2 = model.position;

    // Calculate the distance between the centers
    const distance = center1.distanceTo(center2);
    return distance < 0.5 + 0.5 ? true : false;
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.castShadow = false;

  directionalLight.position.set(-5, 5, 5);
  scene.add(directionalLight);

  //

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // window.addEventListener("resize", () => {
  //   // Update sizes
  //   sizes.width = window.innerWidth;
  //   sizes.height = window.innerHeight;

  //   // Update camera
  //   camera.aspect = sizes.width / sizes.height;
  //   camera.updateProjectionMatrix();
  //   // Update camera
  //   camera.aspect = sizes.width / sizes.height;
  //   camera.updateProjectionMatrix();

  //   // Update renderer
  //   renderer.setSize(sizes.width, sizes.height);
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // });

  //
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // const camera = new THREE.PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000
  // );
  // camera.position.set(4.61, 2.74, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  const arButton = ARButton.createButton(renderer);
  arButton.id = "ar-button";
  document.body.appendChild(arButton);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // camera.position.z = 5;
  // console.log(ground.top);

  const keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
  };

  let runningSpeed = 0.03;
  // let runningSpeed = 0.3;
  window.addEventListener("keydown", (event) => {
    keyDown({ event, model, characterSphere, runningSpeed, run, keys });
  });
  window.addEventListener("keyup", (event) => {
    keyUp({ event, run, keys });
  });

  const cameraOffset = new THREE.Vector3(10, -5, 10); // distance between camera and object
  let modelPosition = new THREE.Vector3();
  // camera.position.copy(modelPosition).add(cameraOffset);

  const controller1 = joystickController(renderer, keys.a, keys.s, 1);
  const controller2 = joystickController(renderer, keys.d, keys.w, 0);

  scene.add(controller1);
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();

  const controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  const controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  // scene.add(controllerGrip1);
  scene.add(controllerGrip2);

  // const enemies = [];

  // let frames = 0;
  // let spawnRate = 200;
  const clock = new THREE.Clock();
  let previousTime = 0;

  const timer = new Timer();

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // update mixer
    if (mixer) {
      mixer.update(deltaTime);
    }

    if (model) {
      model.getWorldPosition(modelPosition);
      camera.position.copy(model.position).add(cameraOffset);
      camera.lookAt(model.position);
    }

    animateCoinsN();
    // Update orbit controls
    // controls.update();

    // Update camera
    // camera.position.copy(modelPosition).add(cameraOffset);
    // camera.lookAt(modelPosition);
    // renderer.setAnimationLoop(animate);
    // // requestAnimationFrame(animate);
    // renderer.render(scene, camera);

    // movement code
    // Update orbit controls
    // controls.update();

    // Update camera
    renderer.setAnimationLoop(animate);
    renderer.render(scene, camera);

    // movement code

    if (keys.a.pressed) {
      if (model.rotation.y !== -Math.PI / 2) {
        model.rotation.y = -Math.PI / 2;
      }
      model.position.x -= runningSpeed;
      characterSphere.position.x -= runningSpeed;
      run.play();
    } else if (keys.d.pressed) {
      if (model.rotation.y !== Math.PI / 2) {
        model.rotation.y = Math.PI / 2;
      }
      model.position.x += runningSpeed;
      characterSphere.position.x += runningSpeed;
      run.play();
    }

    if (keys.s.pressed) {
      if (model.rotation.y !== 0) {
        model.rotation.y = 0;
      }
      model.position.z += runningSpeed;
      characterSphere.position.z += runningSpeed;
      run.play(); // will play when we update the mixer on each frame
    } else if (keys.w.pressed) {
      if (model.rotation.y !== Math.PI) {
        model.rotation.y = Math.PI;
      }
      model.position.z -= runningSpeed;
      characterSphere.position.z -= runningSpeed;
      run.play();
    }
    // console.log(characterSphere)
    coins.forEach((coin) => {
      if (boxCollision(characterSphere, coin)) {
        run.stop()
        collectCoin.play()
        scene.remove(coin);
        const index = coins.indexOf(coin);
        if (index > -1) {
          // only splice array when item is found
          coins.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      positiveCoinHitCount = positiveCoinsLength - coins.length;
      upDateCountText(String(positiveCoinHitCount - negativeCoinHitCount));
    });
    negativeCoins.forEach((coin) => {
      if (boxCollision(characterSphere, coin)) {
        scene.remove(coin);
        const index = negativeCoins.indexOf(coin);
        if (index > -1) {
          // only splice array when item is found
          negativeCoins.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      negativeCoinHitCount = negativeCoinsLength - negativeCoins.length;
      upDateCountText(String(positiveCoinHitCount - negativeCoinHitCount));
    });
  }
  animate();

  placeCoins();
  placeNegetiveCoin();

  let timerText;
  let countText;
  let durationInSeconds = 120;

  function startTimer() {
    startTime = Date.now();
    updateTimer(); // Call updateTimer immediately to initialize the timer text
    timerInterval = setInterval(updateTimer, 1000);
  }

  function createTimerText() {
    const textGeometry = new TextGeometry("0:00", {
      font: font,
      size: 0.5,
      height: 0.2,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    timerText = new THREE.Mesh(textGeometry, textMaterial);
    timerText.position.set(0, 1, -5); // Adjust the position as needed
    scene.add(timerText);
  }

  function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const seconds = durationInSeconds - Math.floor(elapsedTime / 1000);
    if (seconds <= 0) {
      bgAudio.pause();
      gameOver.play();
      scene.remove(timerText);
      scene.remove(characterSphere);
      scene.remove(model);
      coins.forEach((coin) => {
        scene.remove(coin);
      });
      negativeCoins.forEach((coin) => {
        scene.remove(coin);
      });
      countText.position.set(0, 1, -5);
    }
    if (seconds <= -2) {
      // gameOver.play();
      gameOver.pause();
      const session = renderer.xr.getSession();
      if (session) {
        console.log("end--");
        // bgAudio.pause();
        gameOver.pause();
        const textGeometry = new TextGeometry("Click Select on Controller", {
          font: font,
          size: 0.3,
          height: 0.01,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let replayText = new THREE.Mesh(textGeometry, textMaterial);
        replayText.position.set(-2, -1, -4); // Adjust the position as needed
        scene.add(replayText);
        const controllerRight = renderer.xr.getController(1);
        controllerRight.addEventListener("selectstart", () => {
          location.reload();
        });
        const controllerLeft = renderer.xr.getController(0);
        controllerLeft.addEventListener("selectstart", () => {
          location.reload();
        });

        // scene.add(doreplayButton);
        document.querySelector("#ar-button").style.display = "none";
        clearInterval(timerInterval);
      } else {
        console.error("No active XR session to end.");
      }
    }
    const formattedTime = formatTime(seconds);
    // Update the text content of the timer text mesh
    timerText.geometry.dispose();
    timerText.geometry = new TextGeometry(formattedTime, {
      font: font,
      size: 0.5,
      height: 0.2,
    });
  }

  function createCountText() {
    const textGeometry = new TextGeometry("0", {
      font: font,
      size: 1,
      height: 0.8,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    countText = new THREE.Mesh(textGeometry, textMaterial);
    countText.position.set(2, 1, -5); // Adjust the position as needed
    scene.add(countText);
  }

  function upDateCountText(k) {
    // collectCoin.play()
    countText.geometry.dispose();
    countText.geometry = new TextGeometry(k, {
      font: font,
      size: 0.5,
      height: 0.2,
    });
  }

  function formatTime(seconds) {
    // collectCoin.pause()
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  createTimerText();
  createCountText();
  startTimer();
}

let startTime; // Timestamp when the game starts
let timerInterval; // Interval variable to hold the timer update

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  // Call a function to start your game here
  const fontLoader = new FontLoader();
  let font;
  fontLoader.load(
    "https://res.cloudinary.com/dyw4usob0/raw/upload/v1709383556/cjie2pi7nnrexi9zfrvo.json",
    (loadedFont) => {
      font = loadedFont;
      // Call your init() function here to ensure it's called after the font is loaded
      init(font);
      document.querySelector("#info").style.display = "none";
    },
    (event) => {
      console.log(document.querySelector("#info"));
      setTimeout(() => {
        document.querySelector("#ar-button").click();
      }, 100);
    }
  );
  // Example: Transition to main game scene, load assets, etc.
});

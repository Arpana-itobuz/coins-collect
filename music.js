import * as THREE from "three";

export function setMusic(stream) {
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const gameMusic = new THREE.Audio(listener);
    audioLoader.load(stream, function (buffer) {
        gameMusic.setBuffer(buffer);
        gameMusic.setLoop(true);
    });
    return gameMusic
}
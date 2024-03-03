export function keyDown({event, model, characterSphere, runningSpeed, idle, run, keys}){
    console.log(model, characterSphere, idle, run, keys);
    // window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyA":
                if (model.rotation.y !== -Math.PI / 2) {
                    model.rotation.y = -Math.PI / 2;
                }
                model.position.x -= runningSpeed;
                characterSphere.position.x -= runningSpeed;
                run.play();
                keys.a.pressed = true;
                break;
            case "KeyD":
                if (model.rotation.y !== Math.PI / 2) {
                    model.rotation.y = Math.PI / 2;
                }
                model.position.x += runningSpeed;
                characterSphere.position.x += runningSpeed;
                run.play();
                keys.d.pressed = true;
                break;
            case "KeyS":
                if (model.rotation.y !== 0) {
                    model.rotation.y = 0;
                }
                model.position.z += runningSpeed;
                characterSphere.position.z += runningSpeed;
                run.play();
                keys.s.pressed = true;
                break;
            case "KeyW":
                if (model.rotation.y !== Math.PI) {
                    model.rotation.y = Math.PI;
                }
                model.position.z -= runningSpeed;
                characterSphere.position.z -= runningSpeed;
                run.play();
                keys.w.pressed = true;
                break;
        }
    // });
}
    export function keyUp({event, idle, run, keys}){

    // }
    // window.addEventListener("keyup", (event) => {
        switch (event.code) {
            case "KeyA":
                run.stop();
                keys.a.pressed = false;
                break;
            case "KeyD":
                run.stop();
                keys.d.pressed = false;
                break;
            case "KeyS":
                run.stop();
                keys.s.pressed = false;
                break;
            case "KeyW":
                run.stop();
                keys.w.pressed = false;
                break;
        }
    // });
}
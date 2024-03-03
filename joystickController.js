import { buildController } from "./buildController";

export function joystickController(renderer, key1,key2, value) {
    const controller = renderer.xr.getController(value);

    controller.addEventListener("selectstart", (e) => {
        key2.pressed = true;
    });
    controller.addEventListener("selectend", (e) => {
        key2.pressed = false;
    });

    // controller.addEventListener("thumbstickmoved", (e) => {
    //     console.log("thumbstickmoved ::", e);
    // });

    controller.addEventListener("squeezestart", (e) => {
        key1.pressed = true;
    });
    controller.addEventListener("squeezeend", (e) => {
        key1.pressed = false;
    });
    controller.addEventListener("connected", function (event) {
        this.add(buildController(event.data));
    });
    controller.addEventListener("disconnected", function () {
        this.remove(this.children[0]);
    });

    return controller
}
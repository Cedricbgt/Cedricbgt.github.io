// Gestion des entrées clavier/souris
export default class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };

        // Initialiser les écouteurs
        this.initListeners();
    }

    initListeners() {
        window.onkeydown = (event) => {
            this.inputStates[event.code] = true;
            // Pour les touches de direction
            if (event.code === "ArrowRight") this.inputStates.ArrowRight = true;
            if (event.code === "ArrowLeft") this.inputStates.ArrowLeft = true;
            if (event.code === "ArrowUp") this.inputStates.ArrowUp = true;
            if (event.code === "ArrowDown") this.inputStates.ArrowDown = true;
            
            // Pour les touches ZQSD
            if (event.key === "z" || event.key === "Z") this.inputStates.KeyZ = true;
            if (event.key === "q" || event.key === "Q") this.inputStates.KeyQ = true;
            if (event.key === "s" || event.key === "S") this.inputStates.KeyS = true;
            if (event.key === "d" || event.key === "D") this.inputStates.KeyD = true;
        };

        window.onkeyup = (event) => {
            this.inputStates[event.code] = false;
            // Pour les touches de direction
            if (event.code === "ArrowRight") this.inputStates.ArrowRight = false;
            if (event.code === "ArrowLeft") this.inputStates.ArrowLeft = false;
            if (event.code === "ArrowUp") this.inputStates.ArrowUp = false;
            if (event.code === "ArrowDown") this.inputStates.ArrowDown = false;
            
            // Pour les touches ZQSD
            if (event.key === "z" || event.key === "Z") this.inputStates.KeyZ = false;
            if (event.key === "q" || event.key === "Q") this.inputStates.KeyQ = false;
            if (event.key === "s" || event.key === "S") this.inputStates.KeyS = false;
            if (event.key === "d" || event.key === "D") this.inputStates.KeyD = false;
        };

        this.canvas.onmousemove = (event) => {
            this.inputStates.mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
            this.inputStates.mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
        };
    }

    isKeyDown(keyCode) {
        return !!this.inputStates[keyCode];
    }

    getMousePosition() {
        return {
            x: this.inputStates.mouseX,
            y: this.inputStates.mouseY
        };
    }
} 
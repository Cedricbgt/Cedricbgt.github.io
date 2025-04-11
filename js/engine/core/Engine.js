// Moteur de jeu principal qui gère la boucle de jeu, le canvas, etc.
import InputManager from './InputManager.js';

export default class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.inputManager = new InputManager(canvas);
        this.inputStates = this.inputManager.inputStates;
        this.currentScene = null;
        this.running = false;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
    }

    setScene(scene) {
        this.currentScene = scene;
        this.currentScene.init(this);
    }

    start() {
        if (!this.currentScene) {
            console.error("Aucune scène n'a été définie avant de démarrer le moteur !");
            return;
        }

        this.running = true;
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
        console.log("Moteur de jeu démarré");
    }

    gameLoop(timestamp) {
        if (!this.running) return;

        // Calculer le deltaTime (temps écoulé depuis la dernière frame)
        this.deltaTime = (timestamp - this.lastFrameTime) / 1000; // en secondes
        this.lastFrameTime = timestamp;

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Mettre à jour et dessiner la scène actuelle
        this.currentScene.update(this.deltaTime);
        this.currentScene.draw(this.ctx);

        // Planifier la prochaine frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    stop() {
        this.running = false;
    }
} 
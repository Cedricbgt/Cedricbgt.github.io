// Classe de base pour les scènes
export default class Scene {
    constructor() {
        this.engine = null;
        this.gameObjects = [];
    }

    init(engine) {
        this.engine = engine;
    }

    update(deltaTime) {
        // À implémenter dans les sous-classes
    }

    draw(ctx) {
        // À implémenter dans les sous-classes
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        gameObject.scene = this;
    }

    removeGameObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    getObjectsByType(type) {
        return this.gameObjects.filter(obj => obj instanceof type);
    }
} 
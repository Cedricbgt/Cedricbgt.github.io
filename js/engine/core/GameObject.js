// Classe de base pour les objets du jeu
export default class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = null;
        this.tags = [];
    }

    update(deltaTime, scene) {
        // À implémenter dans les sous-classes
    }

    draw(ctx) {
        // À implémenter dans les sous-classes
    }

    // Ajout d'une méthode utile pour détecter les collisions
    isColliding(otherObject) {
        return !(
            this.x + this.width / 2 < otherObject.x - otherObject.width / 2 ||
            this.x - this.width / 2 > otherObject.x + otherObject.width / 2 ||
            this.y + this.height / 2 < otherObject.y - otherObject.height / 2 ||
            this.y - this.height / 2 > otherObject.y + otherObject.height / 2
        );
    }

    // Méthode pour ajouter un tag à l'objet
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    // Méthode pour vérifier si l'objet a un tag
    hasTag(tag) {
        return this.tags.includes(tag);
    }
} 
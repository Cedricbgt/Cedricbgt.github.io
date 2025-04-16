import ObjectGraphique from "../../engine/core/ObjectGraphique.js";

export default class Projectile extends ObjectGraphique {
    constructor(x, y, directionX, directionY, vitesse = 20000, portee = 60) {
        super(x, y, 10, 10);
        this.directionX = directionX;
        this.directionY = directionY;
        this.vitesse = vitesse;
        this.couleur = "yellow";
        this.rayon = 5;
        this.portee = portee; // distance max en pixels
        this.distanceParcourue = 0;
    }

    move(deltaTime) {
        const dx = this.directionX * this.vitesse * deltaTime;
        const dy = this.directionY * this.vitesse * deltaTime;
        this.x += dx;
        this.y += dy;
        this.distanceParcourue += Math.sqrt(dx * dx + dy * dy);
    }

    estHorsPortee() {
        return this.distanceParcourue >= this.portee;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rayon, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
} 
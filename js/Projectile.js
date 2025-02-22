import ObjectGraphique from "./ObjectGraphique.js";

export default class Projectile extends ObjectGraphique {
    constructor(x, y, directionX, directionY, vitesse = 7) {
        super(x, y, 10, 10);
        this.directionX = directionX;
        this.directionY = directionY;
        this.vitesse = vitesse;
        this.couleur = "yellow";
    }

    move() {
        this.x += this.directionX * this.vitesse;
        this.y += this.directionY * this.vitesse;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
} 
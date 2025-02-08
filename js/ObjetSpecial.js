import ObjectGraphique from "./ObjectGraphique.js";

export default class ObjetSpecial extends ObjectGraphique {
    constructor(x, y, w, h, couleur) {
        super(x, y, w, h, couleur);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.w / 2, this.y - this.h);
        ctx.lineTo(this.x + this.w, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
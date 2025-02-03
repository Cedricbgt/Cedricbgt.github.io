import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";   

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 100, 100);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "pink";
        this.angle = 0;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        //this.ctx.scale(0.5, 0.5);

        // tete du monstre
        ctx.fillStyle = "pink";
        ctx.fillRect(0, 0, this.w, this.h);
        
        // yeux
        drawCircleImmediat(ctx, 20, 20, 10, "red");
        drawCircleImmediat(ctx, 60, 20, 10, "red");

        // bouche
        ctx.fillStyle = "black";
        ctx.fillRect(30, 60, 40, 10);

        // bras
        ctx.fillStyle = "pink";
        ctx.fillRect(-20, 20, 20, 60); // bras gauche
        ctx.fillRect(100, 20, 20, 60); // bras droit

        // jambes
        ctx.fillRect(20, 100, 20, 40); // jambe gauche
        ctx.fillRect(60, 100, 20, 40); // jambe droite

        // antennes
        drawCircleImmediat(ctx, 10, -10, 5, "pink");
        drawCircleImmediat(ctx, 70, -10, 5, "pink");

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}
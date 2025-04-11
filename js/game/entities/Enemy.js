import ObjectGraphique from "../../engine/core/ObjectGraphique.js";
import { drawCircleImmediat } from "../../engine/utils/Drawing.js";

export default class Enemy extends ObjectGraphique {
    constructor(x, y, vitesse = 2) {
        super(x, y, 60, 60);
        this.vitesse = vitesse;
        this.couleur = "purple";
        this.vie = 3; // Nombre de coups avant de mourir
        this.angle = 0;
    }

    draw(ctx) {
        ctx.save();
        
        // Système de coordonnées centré sur l'ennemi
        ctx.translate(this.x, this.y);
        ctx.translate(-this.w / 2, -this.h / 2);
        
        // Corps du monstre
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, this.w, this.h);
        
        // Yeux
        drawCircleImmediat(ctx, 15, 15, 8, "yellow");
        drawCircleImmediat(ctx, 45, 15, 8, "yellow");
        
        // Pupilles
        drawCircleImmediat(ctx, 15, 15, 4, "black");
        drawCircleImmediat(ctx, 45, 15, 4, "black");
        
        // Bouche
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(30, 45, 20, 0, Math.PI, false);
        ctx.fill();
        
        // Dents
        ctx.fillStyle = "white";
        ctx.fillRect(20, 45, 5, 10);
        ctx.fillRect(30, 45, 5, 10);
        ctx.fillRect(40, 45, 5, 10);
        
        ctx.restore();
        
        // Barre de vie au-dessus
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.w;
        const barHeight = 5;
        const x = this.x - this.w / 2;
        const y = this.y - this.h / 2 - 10;
        
        // Fond rouge
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Partie verte proportionnelle à la vie
        ctx.fillStyle = "green";
        ctx.fillRect(x, y, barWidth * (this.vie / 3), barHeight);
    }
    
    // Fonction pour faire suivre le joueur
    suivreJoueur(joueur) {
        const dx = joueur.x - this.x;
        const dy = joueur.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.vitesse;
            this.y += (dy / distance) * this.vitesse;
        }
    }
    
    // Fonction pour prendre des dégâts et vérifier si l'ennemi est mort
    estTouche() {
        this.vie--;
        return this.vie <= 0;
    }
} 
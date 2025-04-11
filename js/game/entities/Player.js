import ObjectGraphique from "../../engine/core/ObjectGraphique.js";
import { drawCircleImmediat } from "../../engine/utils/Drawing.js";   
import Projectile from "./Projectile.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 100, 100);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "pink";
        this.angle = 0;
        this.projectiles = [];
        this.lastShootTime = 0;
        this.shootCooldown = 250; // temps en ms entre chaque tir
        
        // Système de points de vie
        this.maxHearts = 3;
        this.hearts = this.maxHearts; // 3 cœurs pleins
        this.invincible = false;
        this.invincibleTime = 0;
        this.invincibleDuration = 1000; // 1 seconde d'invincibilité après avoir été touché

        // Multiplicateurs pour les effets des objets
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
        this.defenseMultiplier = 1;
        this.projectileSpeedMultiplier = 1;
        this.projectileSizeMultiplier = 1;
        this.lifeSteal = 0;
    }

    shoot(inputStates) {
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime < this.shootCooldown) return;

        let directionX = 0;
        let directionY = 0;

        // On utilise event.key car c'est plus fiable pour les différentes dispositions de clavier
        if (inputStates.KeyZ) directionY = -1; // Z (haut)
        if (inputStates.KeyS) directionY = 1;  // S (bas)
        if (inputStates.KeyQ) directionX = -1; // Q (gauche)
        if (inputStates.KeyD) directionX = 1;  // D (droite)

        if (directionX !== 0 || directionY !== 0) {
            // Normaliser la direction pour avoir la même vitesse dans toutes les directions
            const longueur = Math.sqrt(directionX * directionX + directionY * directionY);
            directionX /= longueur;
            directionY /= longueur;

            // Ajouter la vitesse du joueur à la direction du projectile
            const playerSpeed = 6; // Vitesse de base du joueur
            const projectileBaseSpeed = 7; // Vitesse de base du projectile
            
            // Calculer la vitesse du joueur en X et Y
            const playerVelocityX = this.vitesseX / playerSpeed;
            const playerVelocityY = this.vitesseY / playerSpeed;
            
            // Ajouter la vitesse du joueur à la direction du projectile
            directionX += playerVelocityX * 0.5; // 0.5 pour réduire l'effet
            directionY += playerVelocityY * 0.5;
            
            // Re-normaliser la direction
            const newLength = Math.sqrt(directionX * directionX + directionY * directionY);
            directionX /= newLength;
            directionY /= newLength;

            const projectile = new Projectile(
                this.x + this.w/2, 
                this.y + this.h/2,
                directionX,
                directionY,
                projectileBaseSpeed * this.projectileSpeedMultiplier
            );
            
            // Appliquer le multiplicateur de taille aux projectiles
            projectile.rayon *= this.projectileSizeMultiplier;
            
            this.projectiles.push(projectile);
            this.lastShootTime = currentTime;
        }
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

        // Dessiner les projectiles
        this.projectiles.forEach(projectile => projectile.draw(ctx));

        // Dessiner les cœurs
        this.drawHearts(ctx);

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    // Dessiner les cœurs du joueur
    drawHearts(ctx) {
        const heartSize = 20;
        const heartSpacing = 25;
        const startX = 20;
        const startY = 20;
        
        for (let i = 0; i < this.maxHearts; i++) {
            const x = startX + i * heartSpacing;
            const y = startY;
            
            // Dessiner le contour du cœur
            ctx.save();
            
            // Déterminer si c'est un cœur complet, un demi-cœur ou un cœur vide
            if (i < Math.floor(this.hearts)) {
                // Cœur complet
                ctx.fillStyle = "red";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                this.drawHeart(ctx, x, y, heartSize);
            } else if (i < Math.ceil(this.hearts)) {
                // Demi-cœur - on dessine seulement la moitié gauche
                ctx.fillStyle = "red";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                this.drawHalfHeart(ctx, x, y, heartSize);
            } else {
                // Cœur vide - on dessine seulement le contour
                ctx.fillStyle = "transparent";
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                this.drawHeart(ctx, x, y, heartSize);
            }
            
            ctx.restore();
        }
    }
    
    // Dessiner un cœur complet
    drawHeart(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size/4);
        ctx.bezierCurveTo(
            x, y, 
            x - size/2, y, 
            x - size/2, y + size/4
        );
        ctx.bezierCurveTo(
            x - size/2, y + size/2, 
            x, y + size, 
            x, y + size
        );
        ctx.bezierCurveTo(
            x, y + size, 
            x + size/2, y + size/2, 
            x + size/2, y + size/4
        );
        ctx.bezierCurveTo(
            x + size/2, y, 
            x, y, 
            x, y + size/4
        );
        ctx.fill();
        ctx.stroke();
    }
    
    // Dessiner un demi-cœur (moitié gauche)
    drawHalfHeart(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size/4);
        ctx.bezierCurveTo(
            x, y, 
            x - size/2, y, 
            x - size/2, y + size/4
        );
        ctx.bezierCurveTo(
            x - size/2, y + size/2, 
            x, y + size, 
            x, y + size
        );
        ctx.bezierCurveTo(
            x, y + size, 
            x + size/4, y + size/2, 
            x + size/4, y + size/4
        );
        ctx.bezierCurveTo(
            x + size/4, y, 
            x, y, 
            x, y + size/4
        );
        ctx.fill();
        ctx.stroke();
    }

    // Perdre un demi-cœur
    takeDamage() {
        if (!this.invincible) {
            // Appliquer le multiplicateur de défense aux dégâts
            const damage = 0.5 / this.defenseMultiplier;
            this.hearts -= damage;
            
            this.invincible = true;
            this.invincibleTime = Date.now();
            
            // Si le joueur n'a plus de points de vie
            if (this.hearts <= 0) {
                this.hearts = 0;
                // Ici, vous pourriez ajouter une logique pour game over
                console.log("Game Over!");
            }
        }
    }

    move() {
        this.x += this.vitesseX * this.speedMultiplier;
        this.y += this.vitesseY * this.speedMultiplier;
    }

    update(canvas) {
        this.move();
        
        // Vérifier l'invincibilité
        if (this.invincible && Date.now() - this.invincibleTime > this.invincibleDuration) {
            this.invincible = false;
        }
        
        // Mettre à jour les projectiles
        for(let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].move();
            
            // Supprimer les projectiles hors écran
            if(this.projectiles[i].x < 0 || this.projectiles[i].x > canvas.width ||
               this.projectiles[i].y < 0 || this.projectiles[i].y > canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }
    }
}
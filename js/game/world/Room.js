import Enemy from "../entities/Enemy.js";
import Obstacle from "./Obstacle.js";
import { rectsOverlap } from "../../engine/utils/Collision.js";

export default class Room {
    constructor(x, y, type = "normal", canvas) {
        this.x = x; // Position x dans la grille de salles
        this.y = y; // Position y dans la grille de salles
        this.width = canvas ? canvas.width : 700; // Utiliser la largeur du canvas
        this.height = canvas ? canvas.height : 700; // Utiliser la hauteur du canvas
        this.type = type; // Type de salle (normal, boss, trésor, etc.)
        this.obstacles = [];
        this.enemies = [];
        this.doors = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        this.visited = false;
    }

    // Générer le contenu de la salle
    generate(difficulty, player) {
        this.obstacles = [];
        this.enemies = [];

        // Zone de sécurité au centre pour le spawn du joueur
        const safeZone = {
            x: this.width * 0.4,
            y: this.height * 0.4,
            w: this.width * 0.2,
            h: this.height * 0.2
        };

        // Générer des obstacles
        const obstacleCount = 3 + Math.floor(Math.random() * difficulty);
        for (let i = 0; i < obstacleCount; i++) {
            let obstacle;
            let attempts = 0;
            do {
                obstacle = new Obstacle(
                    this.width * 0.1 + Math.random() * this.width * 0.8,
                    this.height * 0.1 + Math.random() * this.height * 0.8,
                    30 + Math.random() * 60,
                    30 + Math.random() * 60,
                    "gray"
                );
                attempts++;
                // Éviter boucle infinie
                if (attempts > 50) break;
            } while (
                rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 
                    safeZone.x, safeZone.y, safeZone.w, safeZone.h) ||
                this.obstacleOverlapsWithDoors(obstacle)
            );
            
            if (attempts <= 50) {
                this.obstacles.push(obstacle);
            }
        }

        // Générer des ennemis
        const enemyCount = this.type === "boss" ? 1 : Math.ceil(difficulty / 2);
        for (let i = 0; i < enemyCount; i++) {
            const enemy = new Enemy(
                this.width * 0.2 + Math.random() * this.width * 0.6,
                this.height * 0.2 + Math.random() * this.height * 0.6,
                1 + difficulty * 0.2
            );
            this.enemies.push(enemy);
        }
    }

    obstacleOverlapsWithDoors(obstacle) {
        // Vérifier si l'obstacle bloque une porte
        const doorSize = 80;
        
        // Porte du haut
        if (this.doors.top) {
            const doorArea = {
                x: this.width/2 - doorSize/2,
                y: 0,
                w: doorSize,
                h: doorSize
            };
            if (rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 
                doorArea.x, doorArea.y, doorArea.w, doorArea.h)) {
                return true;
            }
        }
        
        // Porte de droite
        if (this.doors.right) {
            const doorArea = {
                x: this.width - doorSize,
                y: this.height/2 - doorSize/2,
                w: doorSize,
                h: doorSize
            };
            if (rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 
                doorArea.x, doorArea.y, doorArea.w, doorArea.h)) {
                return true;
            }
        }
        
        // Porte du bas
        if (this.doors.bottom) {
            const doorArea = {
                x: this.width/2 - doorSize/2,
                y: this.height - doorSize,
                w: doorSize,
                h: doorSize
            };
            if (rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 
                doorArea.x, doorArea.y, doorArea.w, doorArea.h)) {
                return true;
            }
        }
        
        // Porte de gauche
        if (this.doors.left) {
            const doorArea = {
                x: 0,
                y: this.height/2 - doorSize/2,
                w: doorSize,
                h: doorSize
            };
            if (rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 
                doorArea.x, doorArea.y, doorArea.w, doorArea.h)) {
                return true;
            }
        }
        
        return false;
    }

    // Dessiner la salle
    draw(ctx) {
        // Fond de la salle - couvrir tout le canvas
        ctx.fillStyle = this.visited ? "#222" : "#111";
        ctx.fillRect(0, 0, this.width, this.height);

        // Dessiner les portes
        this.drawDoors(ctx);

        // Dessiner les obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
    }

    // Dessiner les portes
    drawDoors(ctx) {
        const doorWidth = 80;
        const doorHeight = 80;
        
        ctx.save();
        
        // Porte du haut
        if (this.doors.top) {
            ctx.fillStyle = this.doors.top === "unlocked" ? "brown" : "darkgray";
            ctx.fillRect(this.width/2 - doorWidth/2, 0, doorWidth, doorHeight);
        }
        
        // Porte de droite
        if (this.doors.right) {
            ctx.fillStyle = this.doors.right === "unlocked" ? "brown" : "darkgray";
            ctx.fillRect(this.width - doorWidth, this.height/2 - doorHeight/2, doorWidth, doorHeight);
        }
        
        // Porte du bas
        if (this.doors.bottom) {
            ctx.fillStyle = this.doors.bottom === "unlocked" ? "brown" : "darkgray";
            ctx.fillRect(this.width/2 - doorWidth/2, this.height - doorHeight, doorWidth, doorHeight);
        }
        
        // Porte de gauche
        if (this.doors.left) {
            ctx.fillStyle = this.doors.left === "unlocked" ? "brown" : "darkgray";
            ctx.fillRect(0, this.height/2 - doorHeight/2, doorWidth, doorHeight);
        }
        
        ctx.restore();
    }

    // Vérifier si le joueur touche une porte
    checkDoorCollision(player) {
        const doorWidth = 80;
        const doorHeight = 80;
        const playerRect = {
            x: player.x - player.w/2,
            y: player.y - player.h/2,
            w: player.w,
            h: player.h
        };
        
        // Porte du haut
        if (this.doors.top === "unlocked") {
            const doorRect = {
                x: this.width/2 - doorWidth/2,
                y: 0,
                w: doorWidth,
                h: doorHeight
            };
            if (rectsOverlap(playerRect.x, playerRect.y, playerRect.w, playerRect.h,
                doorRect.x, doorRect.y, doorRect.w, doorRect.h)) {
                return "top";
            }
        }
        
        // Porte de droite
        if (this.doors.right === "unlocked") {
            const doorRect = {
                x: this.width - doorWidth,
                y: this.height/2 - doorHeight/2,
                w: doorWidth,
                h: doorHeight
            };
            if (rectsOverlap(playerRect.x, playerRect.y, playerRect.w, playerRect.h,
                doorRect.x, doorRect.y, doorRect.w, doorRect.h)) {
                return "right";
            }
        }
        
        // Porte du bas
        if (this.doors.bottom === "unlocked") {
            const doorRect = {
                x: this.width/2 - doorWidth/2,
                y: this.height - doorHeight,
                w: doorWidth,
                h: doorHeight
            };
            if (rectsOverlap(playerRect.x, playerRect.y, playerRect.w, playerRect.h,
                doorRect.x, doorRect.y, doorRect.w, doorRect.h)) {
                return "bottom";
            }
        }
        
        // Porte de gauche
        if (this.doors.left === "unlocked") {
            const doorRect = {
                x: 0,
                y: this.height/2 - doorHeight/2,
                w: doorWidth,
                h: doorHeight
            };
            if (rectsOverlap(playerRect.x, playerRect.y, playerRect.w, playerRect.h,
                doorRect.x, doorRect.y, doorRect.w, doorRect.h)) {
                return "left";
            }
        }
        
        return null;
    }

    // Vérifier si tous les ennemis sont morts
    areAllEnemiesDead() {
        return this.enemies.length === 0;
    }
} 
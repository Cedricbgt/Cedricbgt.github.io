import Scene from '../../engine/core/Scene.js';
import Player from '../entities/Player.js';
import Room from '../world/Room.js';
import { rectsOverlap } from '../../engine/utils/Collision.js';
import { drawCircleWithStroke } from '../../engine/utils/Drawing.js';

export default class GameScene extends Scene {
    constructor() {
        super();
        this.etage = 1; // Niveau actuel (étage)
        this.rooms = {}; // Map des salles
        this.currentRoom = null; // Salle actuelle
        this.currentRoomCoords = { x: 0, y: 0 }; // Coordonnées de la salle actuelle
        this.transitioning = false; // En transition entre deux salles
        this.transitionCooldown = 0; // Temps de refroidissement après transition
    }

    init(engine) {
        super.init(engine);
        
        this.canvas = engine.canvas;
        this.ctx = engine.ctx;
        this.inputStates = engine.inputStates;
        
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Générer l'étage
        this.generateFloor(this.etage);
        
        console.log("GameScene initialisée");
    }

    // Générer un nouvel étage
    generateFloor(difficulty) {
        this.rooms = {};
        
        // Générer la salle de départ
        const startRoom = new Room(0, 0, "start", this.canvas);
        this.rooms["0,0"] = startRoom;
        
        // Nombre de salles à générer
        const roomCount = 5 + Math.floor(difficulty * 1.5);
        
        // Liste de coordonnées possibles pour les salles
        let possibleCoords = this.getPossibleRoomCoordinates([{ x: 0, y: 0 }]);
        
        // Générer les salles
        for (let i = 0; i < roomCount && possibleCoords.length > 0; i++) {
            // Choisir une coordonnée aléatoire
            const randomIndex = Math.floor(Math.random() * possibleCoords.length);
            const coords = possibleCoords[randomIndex];
            
            // Créer la salle
            const roomType = i === roomCount - 1 ? "boss" : "normal";
            const newRoom = new Room(coords.x, coords.y, roomType, this.canvas);
            this.rooms[`${coords.x},${coords.y}`] = newRoom;
            
            // Mettre à jour les possibilités
            possibleCoords = this.getPossibleRoomCoordinates(Object.values(this.rooms).map(r => ({ x: r.x, y: r.y })));
        }
        
        // Configurer les portes entre les salles
        this.setupDoors();
        
        // Générer le contenu des salles
        this.generateRoomContents(difficulty);
        
        // Définir la salle de départ
        this.currentRoom = this.rooms["0,0"];
        this.currentRoomCoords = { x: 0, y: 0 };
        this.currentRoom.visited = true;
        
        // Positionner le joueur au centre de la salle de départ
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
    }

    // Obtenir les coordonnées possibles pour les nouvelles salles
    getPossibleRoomCoordinates(existingCoords) {
        const possibleCoords = [];
        
        existingCoords.forEach(coord => {
            const neighbors = [
                { x: coord.x, y: coord.y - 1 }, // haut
                { x: coord.x + 1, y: coord.y }, // droite
                { x: coord.x, y: coord.y + 1 }, // bas
                { x: coord.x - 1, y: coord.y }  // gauche
            ];
            
            neighbors.forEach(neighbor => {
                // Vérifier si cette salle n'existe pas déjà
                const exists = existingCoords.some(c => c.x === neighbor.x && c.y === neighbor.y);
                if (!exists && !possibleCoords.some(c => c.x === neighbor.x && c.y === neighbor.y)) {
                    possibleCoords.push(neighbor);
                }
            });
        });
        
        return possibleCoords;
    }

    // Configurer les portes entre les salles
    setupDoors() {
        for (const key in this.rooms) {
            const room = this.rooms[key];
            const [x, y] = key.split(",").map(Number);
            
            // Vérifier les salles adjacentes
            const topKey = `${x},${y-1}`;
            const rightKey = `${x+1},${y}`;
            const bottomKey = `${x},${y+1}`;
            const leftKey = `${x-1},${y}`;
            
            if (this.rooms[topKey]) {
                room.doors.top = "locked"; // Toutes les portes sont verrouillées par défaut
                this.rooms[topKey].doors.bottom = "locked";
            }
            
            if (this.rooms[rightKey]) {
                room.doors.right = "locked";
                this.rooms[rightKey].doors.left = "locked";
            }
            
            if (this.rooms[bottomKey]) {
                room.doors.bottom = "locked";
                this.rooms[bottomKey].doors.top = "locked";
            }
            
            if (this.rooms[leftKey]) {
                room.doors.left = "locked";
                this.rooms[leftKey].doors.right = "locked";
            }
        }
    }

    // Générer le contenu des salles
    generateRoomContents(difficulty) {
        for (const key in this.rooms) {
            const room = this.rooms[key];
            room.generate(difficulty, this.player);
        }
    }

    update(deltaTime) {
        // Mettre à jour le cooldown de transition
        if (this.transitionCooldown > 0) {
            this.transitionCooldown -= deltaTime; // En secondes
        }
        
        // Déplacer le joueur
        this.movePlayer(deltaTime);
        
        // Mettre à jour les ennemis
        this.updateEnemies(deltaTime);
        
        // Tester les collisions projectiles-ennemis
        this.testCollisionProjectilesEnemies();
        
        // Vérifier les portes
        if (this.transitionCooldown <= 0) {
            this.checkDoors();
        }
        
        // Débloquer les portes si tous les ennemis sont morts
        if (this.currentRoom.areAllEnemiesDead()) {
            for (const direction in this.currentRoom.doors) {
                if (this.currentRoom.doors[direction] === "locked") {
                    this.currentRoom.doors[direction] = "unlocked";
                }
            }
            
            // Faire apparaître un objet si tous les ennemis sont morts
            this.currentRoom.spawnItem();
        }
        
        // Vérifier les collisions avec les objets
        this.currentRoom.checkItemCollision(this.player);
    }

    draw(ctx) {
        // Dessiner la salle courante
        this.currentRoom.draw(ctx);
        
        // Dessiner les ennemis
        this.currentRoom.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
        
        // Dessiner le joueur
        this.player.draw(ctx);
        
        // Dessiner la minimap
        this.drawMinimap(ctx);
    }

    drawMinimap(ctx) {
        const mapSize = 120; // Taille de la minimap
        const roomSize = 15; // Taille d'une salle sur la minimap
        const padding = 5; // Espace entre les salles
        const offsetX = this.canvas.width - mapSize - 20; // Position X de la minimap
        const offsetY = 20; // Position Y de la minimap
        
        // Fond de la minimap
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(offsetX, offsetY, mapSize, mapSize);
        
        // Trouver les limites de la carte
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        for (const key in this.rooms) {
            const [x, y] = key.split(",").map(Number);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        
        // Calculer le centre de la minimap
        const centerX = offsetX + mapSize / 2;
        const centerY = offsetY + mapSize / 2;
        
        // Dessiner chaque salle sur la minimap
        for (const key in this.rooms) {
            const room = this.rooms[key];
            const [x, y] = key.split(",").map(Number);
            
            // Calculer la position de la salle sur la minimap
            const roomX = centerX + (x * (roomSize + padding));
            const roomY = centerY + (y * (roomSize + padding));
            
            // Couleur de la salle
            if (x === this.currentRoomCoords.x && y === this.currentRoomCoords.y) {
                // Salle actuelle
                ctx.fillStyle = "white";
            } else if (room.visited) {
                // Salle visitée
                ctx.fillStyle = room.type === "boss" ? "red" : "green";
            } else {
                // Salle non visitée
                ctx.fillStyle = "gray";
            }
            
            // Dessiner la salle
            ctx.fillRect(roomX - roomSize / 2, roomY - roomSize / 2, roomSize, roomSize);
            
            // Dessiner les portes
            ctx.fillStyle = "brown";
            if (room.doors.top) {
                ctx.fillRect(roomX - 2, roomY - roomSize / 2 - 3, 4, 3);
            }
            if (room.doors.right) {
                ctx.fillRect(roomX + roomSize / 2, roomY - 2, 3, 4);
            }
            if (room.doors.bottom) {
                ctx.fillRect(roomX - 2, roomY + roomSize / 2, 4, 3);
            }
            if (room.doors.left) {
                ctx.fillRect(roomX - roomSize / 2 - 3, roomY - 2, 3, 4);
            }

            // Dessiner un symbole d'objet si la salle contient des objets non collectés
            if (room.items && room.items.length > 0 && room.items.some(item => !item.collected)) {
                ctx.save();
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(roomX, roomY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    movePlayer(deltaTime) {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        const baseSpeed = 300; // pixels/seconde
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = baseSpeed;
        } 
        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -baseSpeed;
        } 
        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -baseSpeed;
        } 
        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = baseSpeed;
        } 

        // Tir
        this.player.shoot(this.inputStates);

        // Mettre à jour la position du joueur
        this.player.move(deltaTime);
        this.player.update(this.canvas, deltaTime);

        // Gérer les collisions avec les bords du canvas
        this.testCollisionPlayerBordsEcran();
        
        // Gérer les collisions avec les obstacles
        this.testCollisionPlayerObstacles();
        
        // Gérer les collisions avec les ennemis
        this.testCollisionPlayerEnnemis();
    }

    checkDoors() {
        if (this.transitioning) return;
        
        // Vérifier si la salle actuelle a des ennemis
        if (this.currentRoom.enemies.length > 0) {
            // Si des ennemis sont présents, les portes restent verrouillées
            return;
        }
        
        const doorDirection = this.currentRoom.checkDoorCollision(this.player);
        if (doorDirection) {
            this.transitioning = true;
            
            // Supprimer tous les projectiles du joueur lors du changement de salle
            this.player.projectiles = [];
            
            // Déterminer la nouvelle salle
            let newX = this.currentRoomCoords.x;
            let newY = this.currentRoomCoords.y;
            
            switch (doorDirection) {
                case "top":
                    newY--;
                    // Positionner le joueur plus à l'intérieur de la nouvelle salle
                    this.player.y = this.canvas.height - this.player.h - 20;
                    break;
                case "right":
                    newX++;
                    this.player.x = this.player.w + 20;
                    break;
                case "bottom":
                    newY++;
                    this.player.y = this.player.h + 20;
                    break;
                case "left":
                    newX--;
                    this.player.x = this.canvas.width - this.player.w - 20;
                    break;
            }
            
            // Changer de salle
            const newRoomKey = `${newX},${newY}`;
            this.currentRoom = this.rooms[newRoomKey];
            this.currentRoomCoords = { x: newX, y: newY };
            this.currentRoom.visited = true;
            
            // Définir un temps de refroidissement après la transition
            this.transitionCooldown = 0.5; // 0.5 seconde
            this.transitioning = false;
        }
    }

    testCollisionPlayerBordsEcran() {
        if(this.player.x - this.player.w/2 < 0) {
            this.player.vitesseX = 0;
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            this.player.x = this.canvas.width - this.player.w/2;
        }
        if(this.player.y - this.player.h/2 < 0) {
            this.player.y = this.player.h/2;
            this.player.vitesseY = 0;
        }
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h/2;
        }
    }

    testCollisionPlayerObstacles() {
        this.currentRoom.obstacles.forEach(obstacle => {
            if(rectsOverlap(
                this.player.x - this.player.w/2, this.player.y - this.player.h/2, 
                this.player.w, this.player.h,
                obstacle.x, obstacle.y, obstacle.w, obstacle.h
            )) {
                if (this.player.x < obstacle.x) {
                    this.player.x = obstacle.x - this.player.w/2;
                } else if (this.player.x > obstacle.x + obstacle.w) {
                    this.player.x = obstacle.x + obstacle.w + this.player.w/2;
                }

                if (this.player.y < obstacle.y) {
                    this.player.y = obstacle.y - this.player.h/2;
                } else if (this.player.y > obstacle.y + obstacle.h) {
                    this.player.y = obstacle.y + obstacle.h + this.player.h/2;
                }

                this.player.vitesseX = 0;
                this.player.vitesseY = 0;
            }
        });
    }

    updateEnemies(deltaTime) {
        this.currentRoom.enemies.forEach(enemy => {
            if(typeof enemy.suivreJoueur === 'function')
                enemy.suivreJoueur(this.player, deltaTime);
        });
    }

    testCollisionProjectilesEnemies() {
        // Pour chaque projectile du joueur
        for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.player.projectiles[i];
            
            // Vérifier collision avec chaque ennemi
            for (let j = this.currentRoom.enemies.length - 1; j >= 0; j--) {
                const enemy = this.currentRoom.enemies[j];
                
                // Vérifier si le projectile touche l'ennemi
                if (this.collisionProjectileEnnemi(projectile, enemy)) {
                    console.log("Ennemi touché !");
                    
                    // L'ennemi prend des dégâts
                    if (enemy.estTouche()) {
                        console.log("Ennemi mort !");
                        // Si ennemi mort, le supprimer
                        this.currentRoom.enemies.splice(j, 1);
                    }
                    
                    // Supprimer le projectile
                    this.player.projectiles.splice(i, 1);
                    break; // Passer au projectile suivant
                }
            }
        }
    }

    collisionProjectileEnnemi(projectile, enemy) {
        // Calcul de distance entre le centre du projectile et le centre de l'ennemi
        const dx = projectile.x - enemy.x;
        const dy = projectile.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si la distance est inférieure à la somme des rayons, il y a collision
        return distance < (enemy.w / 2 + projectile.rayon);
    }

    testCollisionPlayerEnnemis() {
        for (let i = 0; i < this.currentRoom.enemies.length; i++) {
            const enemy = this.currentRoom.enemies[i];
            if (rectsOverlap(
                this.player.x - this.player.w/2, this.player.y - this.player.h/2, 
                this.player.w, this.player.h,
                enemy.x - enemy.w/2, enemy.y - enemy.h/2, 
                enemy.w, enemy.h
            )) {
                // Collision joueur-ennemi
                console.log("Collision avec ennemi");
                // Faire perdre un demi-cœur au joueur
                this.player.takeDamage();
            }
        }
    }

    drawEnemies() {
        this.currentRoom.enemies.forEach(enemy => {
            drawCircleWithStroke(
                this.ctx,
                enemy.position,
                enemy.radius,
                enemy.color,
                enemy.color
            );
        });
    }
}
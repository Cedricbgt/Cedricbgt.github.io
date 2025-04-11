import Room from './Room.js';
import Item from '../entities/Item.js';

export default class Dungeon {
    constructor(canvas) {
        this.canvas = canvas;
        this.rooms = {};
        this.currentRoom = null;
        this.currentRoomCoords = { x: 0, y: 0 };
        this.etage = 1;
        this.difficulty = 1;
        this.itemSpawned = false;
        this.itemType = null;
    }

    // Générer un nouvel étage
    generateFloor(difficulty) {
        this.rooms = {};
        this.etage = difficulty;
        this.difficulty = difficulty;
        this.itemSpawned = false;
        this.itemType = this.getRandomItemType();
        
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
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
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
            room.generate(difficulty);
        }
    }

    // Obtenir un type d'objet aléatoire
    getRandomItemType() {
        const itemTypes = [
            "health",         // +1 point de vie
            "damage",         // +50% de dégâts
            "speed",          // +30% de vitesse
            "defense",        // -30% de dégâts reçus
            "projectileSpeed", // +40% de vitesse des projectiles
            "projectileSize",  // +50% de taille des projectiles
            "fireRate",       // -30% de délai entre les tirs
            "lifeSteal",      // 10% de vol de vie
            "shield",         // +1 bouclier
            "extraHeart"      // +1 cœur maximum
        ];
        
        return itemTypes[Math.floor(Math.random() * itemTypes.length)];
    }

    // Faire apparaître l'objet de l'étage dans une salle
    spawnItem(room) {
        if (!this.itemSpawned && room.enemies.length === 0 && room.items.length === 0) {
            const item = new Item(
                room.width / 2,
                room.height / 2,
                this.itemType
            );
            room.items.push(item);
            this.itemSpawned = true;
            console.log(`Objet ${this.itemType} apparaît dans la salle (${room.x}, ${room.y}) de l'étage ${this.etage}`);
        }
    }

    // Vérifier si tous les ennemis sont morts dans la salle actuelle
    areAllEnemiesDead() {
        return this.currentRoom.enemies.length === 0;
    }

    // Vérifier les collisions avec les objets
    checkItemCollision(player) {
        return this.currentRoom.checkItemCollision(player);
    }

    // Mettre à jour la salle actuelle
    update(deltaTime) {
        this.currentRoom.update(deltaTime);
    }

    // Dessiner la salle actuelle
    draw(ctx) {
        this.currentRoom.draw(ctx);
    }

    // Dessiner la minimap
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
        }
    }

    // Vérifier les collisions avec les portes
    checkDoorCollision(player) {
        return this.currentRoom.checkDoorCollision(player);
    }

    // Changer de salle
    changeRoom(direction) {
        let newX = this.currentRoomCoords.x;
        let newY = this.currentRoomCoords.y;
        
        switch (direction) {
            case "top":
                newY--;
                break;
            case "right":
                newX++;
                break;
            case "bottom":
                newY++;
                break;
            case "left":
                newX--;
                break;
        }
        
        const newRoomKey = `${newX},${newY}`;
        if (this.rooms[newRoomKey]) {
            this.currentRoom = this.rooms[newRoomKey];
            this.currentRoomCoords = { x: newX, y: newY };
            this.currentRoom.visited = true;
            
            // Positionner le joueur à l'entrée de la nouvelle salle
            switch (direction) {
                case "top":
                    return { x: this.canvas.width / 2, y: this.canvas.height - 100 };
                case "right":
                    return { x: 100, y: this.canvas.height / 2 };
                case "bottom":
                    return { x: this.canvas.width / 2, y: 100 };
                case "left":
                    return { x: this.canvas.width - 100, y: this.canvas.height / 2 };
            }
        }
        
        return null;
    }
} 
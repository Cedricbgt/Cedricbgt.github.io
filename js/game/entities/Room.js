class Room {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.items = [];
        this.doors = {
            top: null,
            right: null,
            bottom: null,
            left: null
        };
        this.cleared = false;
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    addItem(item) {
        this.items.push(item);
    }

    addDoor(direction, room) {
        this.doors[direction] = room;
    }

    update(deltaTime) {
        // Mise à jour des ennemis
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Vérifier si tous les ennemis sont morts
        if (!this.cleared && this.enemies.every(enemy => enemy.health <= 0)) {
            this.cleared = true;
            this.unlockDoors();
        }
    }

    draw(ctx) {
        // Dessiner les murs
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Dessiner les ennemis
        this.enemies.forEach(enemy => enemy.draw(ctx));

        // Dessiner les objets
        this.items.forEach(item => item.draw(ctx));

        // Dessiner les portes
        this.drawDoors(ctx);
    }

    drawDoors(ctx) {
        const doorWidth = 40;
        const doorHeight = 10;
        
        // Porte du haut
        if (this.doors.top) {
            ctx.fillStyle = this.doors.top.cleared ? "#00ff00" : "#ff0000";
            ctx.fillRect(this.x + this.width/2 - doorWidth/2, this.y, doorWidth, doorHeight);
        }

        // Porte de droite
        if (this.doors.right) {
            ctx.fillStyle = this.doors.right.cleared ? "#00ff00" : "#ff0000";
            ctx.fillRect(this.x + this.width - doorHeight, this.y + this.height/2 - doorWidth/2, doorHeight, doorWidth);
        }

        // Porte du bas
        if (this.doors.bottom) {
            ctx.fillStyle = this.doors.bottom.cleared ? "#00ff00" : "#ff0000";
            ctx.fillRect(this.x + this.width/2 - doorWidth/2, this.y + this.height - doorHeight, doorWidth, doorHeight);
        }

        // Porte de gauche
        if (this.doors.left) {
            ctx.fillStyle = this.doors.left.cleared ? "#00ff00" : "#ff0000";
            ctx.fillRect(this.x, this.y + this.height/2 - doorWidth/2, doorHeight, doorWidth);
        }
    }

    unlockDoors() {
        // Débloquer toutes les portes
        Object.keys(this.doors).forEach(direction => {
            if (this.doors[direction]) {
                this.doors[direction].cleared = true;
            }
        });
    }

    spawnItem() {
        if (this.cleared && this.items.length === 0) {
            // Liste des types d'objets possibles
            const itemTypes = [
                "health", "damage", "speed", "defense",
                "projectileSpeed", "projectileSize", "fireRate",
                "lifeSteal", "shield", "extraHeart"
            ];
            
            // Choisir un type aléatoire
            const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            
            // Créer un nouvel objet au centre de la salle
            const item = new Item(
                this.x + this.width/2,
                this.y + this.height/2,
                randomType
            );
            
            this.addItem(item);
        }
    }

    checkItemCollision(player) {
        this.items.forEach(item => {
            if (!item.collected) {
                const dx = player.x - item.x;
                const dy = player.y - item.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < player.radius + item.radius) {
                    item.applyEffect(player);
                }
            }
        });
    }
} 
import ObjectGraphique from "../../engine/core/ObjectGraphique.js";
import { drawCircleWithStroke } from "../../engine/utils/Drawing.js";

export default class Item extends ObjectGraphique {
    constructor(x, y, type) {
        super(x, y, 30, 30);
        this.type = type;
        this.collected = false;
        this.effects = this.getEffectsByType(type);
        this.notification = null;
        this.notificationStartTime = 0;
        this.notificationDuration = 2000; // 2 secondes
    }

    draw(ctx) {
        if (this.collected) {
            // Dessiner la notification si elle existe
            if (this.notification) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - this.notificationStartTime;
                
                if (elapsedTime < this.notificationDuration) {
                    // Calculer l'opacité pour un effet de fondu
                    const opacity = 1 - (elapsedTime / this.notificationDuration);
                    
                    ctx.save();
                    ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * opacity})`;
                    ctx.fillRect(10, 10, 200, 60);
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.font = "bold 16px Arial";
                    ctx.textAlign = "left";
                    ctx.fillText(this.notification.name, 20, 35);
                    
                    ctx.font = "14px Arial";
                    ctx.fillText(this.notification.effect, 20, 55);
                    ctx.restore();
                } else {
                    // Supprimer la notification après la durée
                    this.notification = null;
                }
            }
            return;
        }

        // Dessiner l'objet selon son type
        ctx.save();
        
        // Couleur de base
        let color = "gold";
        
        // Couleur spécifique selon le type
        switch (this.type) {
            case "health":
                color = "red";
                break;
            case "damage":
                color = "orange";
                break;
            case "speed":
                color = "blue";
                break;
            case "defense":
                color = "green";
                break;
            case "projectileSpeed":
                color = "purple";
                break;
            case "projectileSize":
                color = "pink";
                break;
            case "fireRate":
                color = "yellow";
                break;
            case "lifeSteal":
                color = "darkred";
                break;
            case "shield":
                color = "cyan";
                break;
            case "extraHeart":
                color = "hotpink";
                break;
        }
        
        // Dessiner un cercle avec contour
        drawCircleWithStroke(
            ctx,
            this.x,
            this.y,
            this.w / 2,
            color,
            "white"
        );
        
        // Dessiner un symbole selon le type
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let symbol = "?";
        switch (this.type) {
            case "health":
                symbol = "+";
                break;
            case "damage":
                symbol = "⚔";
                break;
            case "speed":
                symbol = "⚡";
                break;
            case "defense":
                symbol = "🛡";
                break;
            case "projectileSpeed":
                symbol = "→";
                break;
            case "projectileSize":
                symbol = "●";
                break;
            case "fireRate":
                symbol = "⚙";
                break;
            case "lifeSteal":
                symbol = "♥";
                break;
            case "shield":
                symbol = "○";
                break;
            case "extraHeart":
                symbol = "♥";
                break;
        }
        
        ctx.fillText(symbol, this.x, this.y);
        ctx.restore();
    }

    // Obtenir les effets de l'objet selon son type
    getEffectsByType(type) {
        switch (type) {
            case "health":
                return { health: 1 }; // +1 point de vie
            case "damage":
                return { damageMultiplier: 1.5 }; // +50% de dégâts
            case "speed":
                return { speedMultiplier: 1.3 }; // +30% de vitesse
            case "defense":
                return { defenseMultiplier: 0.7 }; // -30% de dégâts reçus
            case "projectileSpeed":
                return { projectileSpeedMultiplier: 1.4 }; // +40% de vitesse des projectiles
            case "projectileSize":
                return { projectileSizeMultiplier: 1.5 }; // +50% de taille des projectiles
            case "fireRate":
                return { fireRateMultiplier: 0.7 }; // -30% de délai entre les tirs
            case "lifeSteal":
                return { lifeSteal: 0.1 }; // 10% de vol de vie
            case "shield":
                return { shield: 1 }; // +1 bouclier
            case "extraHeart":
                return { maxHearts: 1 }; // +1 cœur maximum
            default:
                return {};
        }
    }

    // Obtenir le nom de l'objet selon son type
    getItemName() {
        switch (this.type) {
            case "health":
                return "Potion de Vie";
            case "damage":
                return "Cristal de Force";
            case "speed":
                return "Bottes de Vitesse";
            case "defense":
                return "Bouclier Magique";
            case "projectileSpeed":
                return "Cristal de Rapidité";
            case "projectileSize":
                return "Cristal de Taille";
            case "fireRate":
                return "Cristal de Cadence";
            case "lifeSteal":
                return "Cristal de Vol de Vie";
            case "shield":
                return "Bouclier";
            case "extraHeart":
                return "Cœur Supplémentaire";
            default:
                return "Objet Inconnu";
        }
    }

    // Obtenir la description de l'effet selon le type
    getEffectDescription() {
        switch (this.type) {
            case "health":
                return "+1 point de vie";
            case "damage":
                return "+50% de dégâts";
            case "speed":
                return "+30% de vitesse";
            case "defense":
                return "-30% de dégâts reçus";
            case "projectileSpeed":
                return "+40% de vitesse des projectiles";
            case "projectileSize":
                return "+50% de taille des projectiles";
            case "fireRate":
                return "-30% de délai entre les tirs";
            case "lifeSteal":
                return "10% de vol de vie";
            case "shield":
                return "+1 bouclier";
            case "extraHeart":
                return "+1 cœur maximum";
            default:
                return "Effet inconnu";
        }
    }

    // Appliquer les effets de l'objet au joueur
    applyEffects(player) {
        if (this.collected) return;
        
        this.collected = true;
        
        // Créer la notification
        this.notification = {
            name: this.getItemName(),
            effect: this.getEffectDescription()
        };
        this.notificationStartTime = Date.now();
        
        // Appliquer les effets selon le type
        if (this.effects.health) {
            player.hearts = Math.min(player.hearts + this.effects.health, player.maxHearts);
        }
        
        if (this.effects.maxHearts) {
            player.maxHearts += this.effects.maxHearts;
            player.hearts += this.effects.maxHearts;
        }
        
        if (this.effects.damageMultiplier) {
            player.damageMultiplier = (player.damageMultiplier || 1) * this.effects.damageMultiplier;
        }
        
        if (this.effects.speedMultiplier) {
            player.speedMultiplier = (player.speedMultiplier || 1) * this.effects.speedMultiplier;
        }
        
        if (this.effects.defenseMultiplier) {
            player.defenseMultiplier = (player.defenseMultiplier || 1) * this.effects.defenseMultiplier;
        }
        
        if (this.effects.projectileSpeedMultiplier) {
            player.projectileSpeedMultiplier = (player.projectileSpeedMultiplier || 1) * this.effects.projectileSpeedMultiplier;
        }
        
        if (this.effects.projectileSizeMultiplier) {
            player.projectileSizeMultiplier = (player.projectileSizeMultiplier || 1) * this.effects.projectileSizeMultiplier;
        }
        
        if (this.effects.fireRateMultiplier) {
            player.shootCooldown *= this.effects.fireRateMultiplier;
        }
        
        if (this.effects.lifeSteal) {
            player.lifeSteal = (player.lifeSteal || 0) + this.effects.lifeSteal;
        }
        
        if (this.effects.shield) {
            player.shield = (player.shield || 0) + this.effects.shield;
        }
        
        console.log(`Objet collecté: ${this.getItemName()} - ${this.getEffectDescription()}`);
    }
} 
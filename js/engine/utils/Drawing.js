// Fonctions de dessin utilitaires

/**
 * Dessine un cercle 
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X du centre
 * @param {number} y - Position Y du centre
 * @param {number} radius - Rayon du cercle
 * @param {string} color - Couleur du cercle
 */
export function drawCircle(ctx, x, y, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

/**
 * Dessine un cercle (version alternative utilisée dans le code existant)
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X du centre
 * @param {number} y - Position Y du centre
 * @param {number} r - Rayon du cercle
 * @param {string} color - Couleur du cercle
 */
export function drawCircleImmediat(ctx, x, y, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.translate(x, y);     
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/**
 * Dessine un cercle avec contour
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X du centre
 * @param {number} y - Position Y du centre
 * @param {number} radius - Rayon du cercle
 * @param {string} fillColor - Couleur de remplissage
 * @param {string} strokeColor - Couleur du contour
 * @param {number} lineWidth - Épaisseur du contour
 */
export function drawCircleWithStroke(ctx, x, y, radius, fillColor, strokeColor, lineWidth = 1) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

/**
 * Dessine un rectangle
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X (coin supérieur gauche)
 * @param {number} y - Position Y (coin supérieur gauche)
 * @param {number} width - Largeur du rectangle
 * @param {number} height - Hauteur du rectangle
 * @param {string} color - Couleur du rectangle
 */
export function drawRect(ctx, x, y, width, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}

/**
 * Dessine un rectangle avec contour
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X (coin supérieur gauche)
 * @param {number} y - Position Y (coin supérieur gauche)
 * @param {number} width - Largeur du rectangle
 * @param {number} height - Hauteur du rectangle
 * @param {string} fillColor - Couleur de remplissage
 * @param {string} strokeColor - Couleur du contour
 * @param {number} lineWidth - Épaisseur du contour
 */
export function drawRectWithStroke(ctx, x, y, width, height, fillColor, strokeColor, lineWidth = 1) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}

/**
 * Dessine une barre de vie
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} width - Largeur totale de la barre
 * @param {number} height - Hauteur de la barre
 * @param {number} currentValue - Valeur actuelle
 * @param {number} maxValue - Valeur maximale
 * @param {string} fillColor - Couleur de remplissage
 * @param {string} emptyColor - Couleur de la partie vide
 * @param {string} borderColor - Couleur de la bordure (optionnel)
 */
export function drawHealthBar(ctx, x, y, width, height, currentValue, maxValue, fillColor = 'green', emptyColor = 'red', borderColor = null) {
    const fillWidth = (currentValue / maxValue) * width;
    
    // Fond (partie vide)
    ctx.save();
    ctx.fillStyle = emptyColor;
    ctx.fillRect(x, y, width, height);
    
    // Partie remplie
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, fillWidth, height);
    
    // Bordure (optionnelle)
    if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
    }
    
    ctx.restore();
}

/**
 * Dessine une grille
 * @param {CanvasRenderingContext2D} ctx - Le contexte de canvas
 * @param {HTMLCanvasElement} canvas - L'élément canvas
 * @param {number} nbLignes - Nombre de lignes
 * @param {number} nbColonnes - Nombre de colonnes
 * @param {string} couleur - Couleur des lignes
 * @param {number} largeurLignes - Épaisseur des lignes
 */
export function drawGrid(ctx, canvas, nbLignes, nbColonnes, couleur, largeurLignes) {
    ctx.save();

    ctx.strokeStyle = couleur;
    ctx.lineWidth = largeurLignes;

    let largeurColonnes = canvas.width / nbColonnes;
    let hauteurLignes = canvas.height / nbLignes;

    ctx.beginPath();

    // on dessine les lignes verticales
    for (let i = 1; i < nbColonnes; i++) {
        ctx.moveTo(i * largeurColonnes, 0);
        ctx.lineTo(i * largeurColonnes, canvas.height);
    }

    // on dessine les lignes horizontales
    for (let i = 1; i < nbLignes; i++) {
        ctx.moveTo(0, i * hauteurLignes);
        ctx.lineTo(canvas.width, i * hauteurLignes);
    }

    // gpu call pour dessiner d'un coup toutes les lignes
    ctx.stroke();

    ctx.restore();
} 
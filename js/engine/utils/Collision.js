// Fonctions utilitaires pour la détection de collision

/**
 * Vérifie si deux rectangles se chevauchent
 * @param {number} x1 - Position X du premier rectangle
 * @param {number} y1 - Position Y du premier rectangle
 * @param {number} w1 - Largeur du premier rectangle
 * @param {number} h1 - Hauteur du premier rectangle
 * @param {number} x2 - Position X du deuxième rectangle
 * @param {number} y2 - Position Y du deuxième rectangle
 * @param {number} w2 - Largeur du deuxième rectangle
 * @param {number} h2 - Hauteur du deuxième rectangle
 * @returns {boolean} - true si les rectangles se chevauchent, false sinon
 */
export function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 > x2 + w2 || x1 + w1 < x2 || y1 > y2 + h2 || y1 + h1 < y2);
}

/**
 * Vérifie si deux cercles se chevauchent
 * @param {number} x1 - Position X du centre du premier cercle
 * @param {number} y1 - Position Y du centre du premier cercle
 * @param {number} r1 - Rayon du premier cercle
 * @param {number} x2 - Position X du centre du deuxième cercle
 * @param {number} y2 - Position Y du centre du deuxième cercle
 * @param {number} r2 - Rayon du deuxième cercle
 * @returns {boolean} - true si les cercles se chevauchent, false sinon
 */
export function circlesOverlap(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2);
}

/**
 * Autre fonction pour vérifier si deux cercles se chevauchent (même fonction, nom différent)
 */
export function circleCollide(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2) * (r1 + r2));
}

/**
 * Vérifie si un point est à l'intérieur d'un rectangle
 * @param {number} px - Position X du point
 * @param {number} py - Position Y du point
 * @param {number} rx - Position X du rectangle
 * @param {number} ry - Position Y du rectangle
 * @param {number} rw - Largeur du rectangle
 * @param {number} rh - Hauteur du rectangle
 * @returns {boolean} - true si le point est à l'intérieur du rectangle, false sinon
 */
export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * Vérifie si un point est à l'intérieur d'un cercle
 * @param {number} px - Position X du point
 * @param {number} py - Position Y du point
 * @param {number} cx - Position X du centre du cercle
 * @param {number} cy - Position Y du centre du cercle
 * @param {number} r - Rayon du cercle
 * @returns {boolean} - true si le point est à l'intérieur du cercle, false sinon
 */
export function pointInCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return (dx * dx + dy * dy) <= (r * r);
}

/**
 * Collisions entre rectangle et cercle
 * @param {number} x0 - Position X du rectangle
 * @param {number} y0 - Position Y du rectangle
 * @param {number} w0 - Largeur du rectangle
 * @param {number} h0 - Hauteur du rectangle
 * @param {number} cx - Position X du centre du cercle
 * @param {number} cy - Position Y du centre du cercle
 * @param {number} r - Rayon du cercle
 * @returns {boolean} - true si le rectangle et le cercle se chevauchent, false sinon
 */
export function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX = cx;
    var testY = cy;
    if (testX < x0) testX = x0;
    if (testX > (x0 + w0)) testX = (x0 + w0);
    if (testY < y0) testY = y0;
    if (testY > (y0 + h0)) testY = (y0 + h0);
    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
} 
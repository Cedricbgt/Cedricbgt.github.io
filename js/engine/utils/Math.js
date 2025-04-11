// Fonctions mathématiques utilitaires

/**
 * Génère un nombre aléatoire entre min et max (inclus)
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - Un nombre aléatoire entre min et max
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Génère un nombre aléatoire décimal entre min et max
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - Un nombre décimal aléatoire entre min et max
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Limite une valeur entre min et max
 * @param {number} value - Valeur à limiter
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - La valeur limitée
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Interpole linéairement entre deux valeurs
 * @param {number} a - Première valeur
 * @param {number} b - Deuxième valeur
 * @param {number} t - Facteur d'interpolation (entre 0 et 1)
 * @returns {number} - La valeur interpolée
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Calcule la distance entre deux points
 * @param {number} x1 - Coordonnée X du premier point
 * @param {number} y1 - Coordonnée Y du premier point
 * @param {number} x2 - Coordonnée X du deuxième point
 * @param {number} y2 - Coordonnée Y du deuxième point
 * @returns {number} - La distance entre les deux points
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcule l'angle entre deux points (en radians)
 * @param {number} x1 - Coordonnée X du premier point
 * @param {number} y1 - Coordonnée Y du premier point
 * @param {number} x2 - Coordonnée X du deuxième point
 * @param {number} y2 - Coordonnée Y du deuxième point
 * @returns {number} - L'angle en radians
 */
export function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Convertit des degrés en radians
 * @param {number} degrees - Angle en degrés
 * @returns {number} - Angle en radians
 */
export function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convertit des radians en degrés
 * @param {number} radians - Angle en radians
 * @returns {number} - Angle en degrés
 */
export function toDegrees(radians) {
    return radians * (180 / Math.PI);
} 
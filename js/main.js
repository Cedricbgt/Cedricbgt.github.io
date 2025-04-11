// Point d'entrée principal du jeu
import Engine from './engine/core/Engine.js';
import GameScene from './game/scenes/GameScene.js';

window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    
    // Ajuster la taille du canvas pour qu'il prenne toute la taille de l'écran
    function resizeCanvas() {
        // Utiliser toute la largeur et hauteur de la fenêtre
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // S'assurer que le canvas occupe tout l'espace disponible
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialiser le moteur de jeu
    const engine = new Engine(canvas);
    
    // Créer et définir la scène du jeu
    const gameScene = new GameScene();
    engine.setScene(gameScene);
    
    // Démarrer le jeu
    engine.start();
}; 
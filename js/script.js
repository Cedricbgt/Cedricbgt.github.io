import Game from "./Game.js";

// Bonne pratique : avoir une fonction appelée une fois
// que la page est prête, que le DOM est chargé, etc.
window.onload = init;

async function init() {
   // On recupère le canvas
   let canvas = document.querySelector("#myCanvas");

   // On cree une instance du jeu
    let game = new Game(canvas);
    // ici on utilise await car la méthode init est asynchrone
    // typiquement dans init on charge des images, des sons, etc.
    await game.init();

    // on peut démarrer le jeu
    game.start();
}

function resizeCanvas() {
    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
}

// Resize the canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial resize
resizeCanvas();


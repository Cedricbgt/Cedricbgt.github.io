import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";
import Sortie from "./Sortie.js";
import ObjetSpecial from "./ObjetSpecial.js";

export default class Game {
    objetsGraphiques = [];
    niveau = 1;

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
    }

    async init() {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(this.canvas.width * 0.1, this.canvas.height * 0.1);
        this.objetsGraphiques.push(this.player);

        // Un objert qui suite la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "orange");
        this.objetsGraphiques.push(this.objetSouris);

        this.initNiveau(this.niveau);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    initNiveau(niveau) {
        // Supprimer les anciens obstacles et la sortie
        this.objetsGraphiques = this.objetsGraphiques.filter(obj => !(obj instanceof Obstacle || obj instanceof Sortie || obj instanceof ObjetSpecial));

        // Réinitialiser la position du joueur
        this.player.x = this.canvas.width * 0.1;
        this.player.y = this.canvas.height * 0.1;

        // zone de début pour eviter de mettre des obstacles dessus
        const startZone = {
            x: this.player.x - this.player.w / 2,
            y: this.player.y - this.player.h / 2,
            w: this.player.w * 2,
            h: this.player.h * 2
        };

        // generation des obstacles
        for (let i = 0; i < niveau; i++) {
            let obstacle;
            do {
                obstacle = new Obstacle(
                    Math.random() * this.canvas.width * 0.8,
                    Math.random() * this.canvas.height * 0.8,
                    40 + Math.random() * 90,
                    80 + Math.random() * 60,
                    "red"
                );
            } while (rectsOverlap(obstacle.x, obstacle.y, obstacle.w, obstacle.h, startZone.x, startZone.y, startZone.w, startZone.h));
            this.objetsGraphiques.push(obstacle);
        }

        // Ajouter la sortie
        this.sortie = new Sortie(this.canvas.width * 0.9, this.canvas.height * 0.5, 100, 100, "purple");
        this.objetsGraphiques.push(this.sortie);

        // Ajout l'objet spécial avec une probabilité de 20% à partir du niveau 5
        if (niveau >= 5 && Math.random() < 0.2) {
            let objetSpecial;
            do {
                objetSpecial = new ObjetSpecial(
                    Math.random() * this.canvas.width * 0.8,
                    Math.random() * this.canvas.height * 0.8,
                    30,
                    30,
                    "lightblue"
                );
            } while (rectsOverlap(objetSpecial.x, objetSpecial.y, objetSpecial.w, objetSpecial.h, startZone.x, startZone.y, startZone.w, startZone.h));
            this.objetsGraphiques.push(objetSpecial);
        }
    }

    resizeCanvas() {
        this.objetsGraphiques = [];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        console.log("Game démarré");

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.init(); // Re-initialize objects on resize
        });

        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde
        
        // Déplacement du joueur. 
        this.movePlayer();

        // on met à jour la position de objetSouris avec la position de la souris
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // On regarde si le joueur a atteint la sortie
        this.testCollisionPlayerSortie();

        // On regarde si le joueur a atteint l'objet spécial
        this.testCollisionPlayerObjetSpecial();
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = 6;
        } 
        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -6;
        } 

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -6;
        } 

        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = 6;
        } 

        this.player.move();

        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
    }

    testCollisionPlayerBordsEcran() {
        // Raoppel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
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

    testCollisionPlayerSortie() {
        if (this.sortie && rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, this.sortie.x, this.sortie.y, this.sortie.w, this.sortie.h)) {
            this.niveau++;
            this.initNiveau(this.niveau);
        }
    }

    testCollisionPlayerObjetSpecial() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof ObjetSpecial) {
                if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    this.niveau++;
                    this.initNiveau(this.niveau);
                }
            }
        });
    }

    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if(obj instanceof Obstacle) {
                if(rectsOverlap(this.player.x-this.player.w/2, this.player.y - this.player.h/2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    // collision

                    // ICI TEST BASIQUE QUI ARRETE LE JOUEUR EN CAS DE COLLIION.
                    // SI ON VOULAIT FAIRE MIEUX, ON POURRAIT PAR EXEMPLE REGARDER OU EST LE JOUEUR
                    // PAR RAPPORT A L'obstacle courant : il est à droite si son x est plus grand que le x de l'obstacle + la largeur de l'obstacle
                    // il est à gauche si son x + sa largeur est plus petit que le x de l'obstacle
                    // etc.
                    // Dans ce cas on pourrait savoir comment le joueur est entré en collision avec l'obstacle et réagir en conséquence
                    // par exemple en le repoussant dans la direction opposée à celle de l'obstacle...
                    // Là par défaut on le renvoie en x=10 y=10 et on l'arrête
                    console.log("Collision avec obstacle");
                    if (this.player.x < obj.x) {
                        this.player.x = obj.x - this.player.w / 2;
                    } else if (this.player.x > obj.x + obj.w) {
                        this.player.x = obj.x + obj.w + this.player.w / 2;
                    }
    
                    if (this.player.y < obj.y) {
                        this.player.y = obj.y - this.player.h / 2;
                    } else if (this.player.y > obj.y + obj.h) {
                        this.player.y = obj.y + obj.h + this.player.h / 2;
                    }
    
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                }
            }
        });
    }
}
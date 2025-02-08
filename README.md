# Jeu9fevCanva

Jeu pour le 9 février

## Description

Ce projet est un jeu développé en utilisant HTML5 Canvas et JavaScript. Le joueur contrôle un monstre qui doit éviter les obstacles et atteindre la sortie pour passer au niveau suivant. À partir du niveau 5, un objet spécial peut apparaître avec une probabilité de 20%, permettant au joueur de passer directement au niveau suivant.

## Fonctionnalités

- Contrôle du monstre avec les touches fléchées.
- Obstacles générés aléatoirement à chaque niveau.
- Sortie pour passer au niveau suivant.
- Objet spécial apparaissant à partir du niveau 5 avec une probabilité de 20%, permettant de passer directement au niveau suivant.

## Comment jouer

1. Utilisez les touches fléchées pour déplacer le monstre.
2. Évitez les obstacles rouges.
3. Atteignez la sortie violette pour passer au niveau suivant.
4. À partir du niveau 5, cherchez l'objet spécial bleu clair pour passer directement au niveau suivant.

## Lien d'accès au jeu

Vous pouvez jouer au jeu en ligne en suivant ce lien : [Jeu9fevCanva](https://cedricbgt.github.io/)

## Structure du projet

- `index.html` : Contient la structure HTML de la page.
- `css/style.css` : Contient les styles CSS pour le jeu.
- `js/Game.js` : Gère la logique du jeu.
- `js/Player.js` : Définit la classe `Player`.
- `js/Obstacle.js` : Définit la classe `Obstacle`.
- `js/ObjetSouris.js` : Définit la classe `ObjetSouris`.
- `js/ObjetSpecial.js` : Définit la classe `ObjetSpecial`.
- `js/collisions.js` : Contient les fonctions de détection de collision.
- `js/ecouteurs.js` : Initialise les écouteurs d'événements pour le clavier et la souris.
- `js/script.js` : Point d'entrée principal du jeu.

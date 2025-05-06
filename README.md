# Jeu9fevCanva

## Description

**Jeu9fevCanva** est un jeu développé en HTML5 Canvas et JavaScript. Le joueur incarne un monstre qui doit naviguer à travers des salles remplies d'obstacles et d'ennemis. L'objectif est d'éliminer tous les ennemis pour révéler un escalier permettant de passer au niveau suivant. À partir du niveau 5, un objet spécial peut apparaître, offrant une manière alternative de progresser.

## Fonctionnalités

- **Déplacement du joueur** : Contrôlez le monstre avec les touches fléchées.
- **Gestion des ennemis** : Éliminez tous les ennemis pour révéler l'escalier.
- **Système d'étages** : Passez au niveau suivant en utilisant l'escalier.
- **Objet spécial** : À partir du niveau 5, un objet spécial peut apparaître avec une probabilité de 20%, permettant de passer directement au niveau suivant.
- **Obstacles dynamiques** : Évitez les obstacles rouges générés aléatoirement.
- **Progression infinie** : Chaque étage est généré de manière unique, augmentant la difficulté au fil du temps.

## Comment jouer

1. Utilisez les **touches fléchées** pour déplacer le monstre.
2. Éliminez tous les ennemis dans une salle pour révéler l'escalier.
3. Prenez l'escalier pour passer au niveau suivant.
4. À partir du **niveau 5**, cherchez l'objet spécial bleu clair pour passer directement au niveau suivant.

## Technologies utilisées

- **HTML5 Canvas** : Pour le rendu graphique.
- **JavaScript** : Pour la logique du jeu et les interactions.
- **CSS** : Pour le style de la page.

## Structure du projet

- `index.html` : Structure HTML de la page.
- `css/style.css` : Styles CSS pour le jeu.
- `js/main.js` : Point d'entrée principal du jeu.
- `js/Game.js` : Gère la logique principale du jeu.
- `js/Player.js` : Définit la classe `Player`.
- `js/Obstacle.js` : Définit la classe `Obstacle`.
- `js/ObjetSouris.js` : Définit la classe `ObjetSouris`.
- `js/ObjetSpecial.js` : Définit la classe `ObjetSpecial`.
- `js/collisions.js` : Contient les fonctions de détection de collision.
- `js/ecouteurs.js` : Initialise les écouteurs d'événements pour le clavier et la souris.

## Lien pour jouer

Jouez au jeu en ligne ici : [Jeu9fevCanva](https://cedricbgt.github.io/)

## Améliorations futures

- Ajout de nouveaux types d'ennemis avec des comportements variés.
- Système de score pour suivre la progression du joueur.
- Ajout de power-ups pour améliorer les capacités du joueur.
- Musiques et effets sonores pour une meilleure immersion.

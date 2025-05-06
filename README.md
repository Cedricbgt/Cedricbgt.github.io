# Jeu9fevCanva

## Description

**Jeu9fevCanva** est un jeu développé en HTML5 Canvas et JavaScript. Le joueur incarne un monstre qui doit explorer un donjon généré aléatoirement, éliminer les ennemis, éviter les obstacles et atteindre un escalier pour passer au niveau suivant. À partir du niveau 5, un objet spécial peut apparaître, offrant des bonus ou des moyens alternatifs de progression.

## Fonctionnalités

- **Exploration de donjons** : Chaque étage est généré aléatoirement avec des salles connectées.
- **Système d'ennemis** : Combattez des ennemis avec des projectiles.
- **Obstacles dynamiques** : Évitez les obstacles rouges dans chaque salle.
- **Escalier unique** : Révélez un escalier pour passer au niveau suivant en éliminant tous les ennemis de l'étage.
- **Objets spéciaux** : À partir du niveau 5, des objets spéciaux peuvent apparaître avec des effets variés (bonus de vie, vitesse, etc.).
- **Progression infinie** : La difficulté augmente à chaque étage.

## Comment jouer

1. **Déplacement** : Utilisez les touches fléchées pour déplacer le monstre.
2. **Tir** : Utilisez les touches `Z`, `Q`, `S`, `D` pour tirer dans différentes directions.
3. **Objectif** : Éliminez tous les ennemis pour révéler l'escalier et passez au niveau suivant.
4. **Bonus** : Collectez des objets spéciaux pour améliorer vos capacités.

## Structure du projet

### Fichiers principaux

- **`index.html`** : Structure HTML de la page.
- **`css/style.css`** : Styles CSS pour le jeu.
- **`js/main.js`** : Point d'entrée principal du jeu.

### Répertoire `js/engine`

Contient les composants du moteur de jeu :

- **`core/`** :
  - `Engine.js` : Gère la boucle de jeu et le rendu.
  - `Scene.js` : Classe de base pour les scènes.
  - `ObjectGraphique.js` : Classe de base pour les objets graphiques.
  - `GameObject.js` : Classe de base pour les objets du jeu.
  - `InputManager.js` : Gestion des entrées clavier/souris.
  - `ecouteurs.js` : Initialise les écouteurs d'événements.
- **`utils/`** :
  - `Collision.js` : Fonctions utilitaires pour la détection de collisions.
  - `Drawing.js` : Fonctions utilitaires pour le dessin.
  - `Math.js` : Fonctions mathématiques utilitaires.

### Répertoire `js/game`

Contient la logique spécifique au jeu :

- **`entities/`** :
  - `Player.js` : Définit la classe du joueur.
  - `Enemy.js` : Définit la classe des ennemis.
  - `Projectile.js` : Définit les projectiles tirés par le joueur.
  - `Item.js` : Définit les objets spéciaux collectables.
  - `ObjetSouris.js` : Exemple d'objet interactif.
- **`world/`** :
  - `Dungeon.js` : Gère la génération des étages.
  - `Room.js` : Définit les salles du donjon.
  - `Obstacle.js` : Définit les obstacles dans les salles.
  - `Sortie.js` : Définit l'escalier pour passer au niveau suivant.
  - `ObjetSpecial.js` : Définit les objets spéciaux.
- **`scenes/`** :
  - `GameScene.js` : Gère la logique principale de la scène de jeu.

## Lien pour jouer

Jouez au jeu en ligne ici : [Jeu9fevCanva](https://cedricbgt.github.io/)

## Améliorations futures

- Ajout de nouveaux types d'ennemis avec des comportements variés.
- Système de score pour suivre la progression du joueur.
- Ajout de musiques et d'effets sonores pour une meilleure immersion.
- Création de boss uniques pour certains étages.

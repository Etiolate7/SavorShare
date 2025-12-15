# SavorShare - Application Mobile

![React Native](https://img.shields.io/badge/React%20Native-0.71-blue)
![Expo](https://img.shields.io/badge/Expo-Managed%20Workflow-brightgreen)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![Redux Persist](https://img.shields.io/badge/Redux%20Persist-orange)

SavorShare est une application mobile créée avec React Native qui permet aux utilisateurs de partager leurs recettes avec une communauté entière.
Chaque utilisateur peut créer, modifier et supprimer ses propres recettes, mais aussi parcourir celles des autres, les sauvegarder en favoris et effectuer des recherches avancées selon différents critères.
Le backend est construit avec Express, MongoDB, Mongoose, et utilise bcrypt pour le chiffrement des mots de passe ainsi que uid32 pour la génération de tokens sécurisés.

---

## Fonctionnalités

- Créer, modifier et supprimer ses propres recettes.  
- Voir toutes les recettes partagées par les utilisateurs.
- Rechercher des recettes selon : 
  - nationalité : européen, asiatique, africain, etc.
  - type de plat : plat principal, dessert, boisson, accompagnement, etc.
  - mots-clés
  - recettes enregistrées en favoris
- Ajouter une recette aux bookmarks (favoris) et consulter uniquement celles sauvegardées.
- Authentification sécurisée grâce à bcrypt et gestion de session via uid32.
- Stockage des recettes et des utilisateurs avec MongoDB + Mongoose.

---

## Captures d’écran

<img width="195" height="422" alt="home-screen" src="https://github.com/user-attachments/assets/47e82e34-7af7-4b59-b2a6-e967e225adee" />
<img width="195" height="422" alt="connexion" src="https://github.com/user-attachments/assets/3c4f540c-c05e-4659-85e2-1e457716cc1c" />
<img width="195" height="422" alt="all-recipes" src="https://github.com/user-attachments/assets/7cfd4cb4-0759-4400-8f58-c4922f0f619f" />
<img width="195" height="422" alt="create-recipe" src="https://github.com/user-attachments/assets/0fe5e703-d175-4903-a9de-b43a93e823f9" />
<img width="195" height="422" alt="profile" src="https://github.com/user-attachments/assets/0ca1b058-ee07-45c4-be4d-2500900ff41a" />
<img width="195" height="422" alt="recipe-details" src="https://github.com/user-attachments/assets/ed6e9d79-1fb8-495b-8b13-716dbc31bdc8" />
<img width="195" height="422" alt="filter" src="https://github.com/user-attachments/assets/87ab3008-27f0-4b08-bfa9-cc6b986580c5" />

---

## Technologies utilisées

- **React Native** - Framework mobile pour le développement multiplateforme  
- **Expo** - Workflow géré pour construire et exécuter l’application  
- **Redux Toolkit** - Gestion globale de l’état de l’application  
- **Redux Persist** - Persistance de l’état entre les redémarrages de l’application  
- **AsyncStorage / SecureStorage** - Sauvegarde locale des tokens et données légères
- **Express** - API REST rapide et minimaliste
- **MongoDB / Mongoose** – Base de données NoSQL et ORM
- **bcrypt** – Hashage sécurisé des mots de passe
- **uid32** – Génération de tokens uniques pour la session

---

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/yourusername/SavorShare.git
```

2.	Installer les dépendances :
```bash
yarn install
```

3.	Lancer l’application avec Expo :
```bash
yarn start
```
---

## Utilisation

1. **Créer un compte / Se connecter :** Entrez un pseudonyme, un mot de passe et un email pour commencer à utiliser l’application.
2. **Créer une recette :** Remplir les champs : titre, ingrédients, instructions, nationalité, type de plat, image (optionnelle).
3. **Parcourir les recettes :** Voir toutes les recettes partagées par la communauté.  
4. **Rechercher :** Filtrer selon : Nationalité, type de plat, mots-clés, uniquement les favoris 
5. **Bookmark :** Ajouter ou retirer des recettes de vos favoris.
6. **Modifier / Supprimer :** Chaque utilisateur contrôle ses propres recettes.

---

## Contribution

1. Forker le dépôt  
2. Créer une nouvelle branche : `git checkout -b feature/VotreFonctionnalité`  
3. Effectuer vos modifications et les valider : `git commit -m "Ajouter une nouvelle fonctionnalité"`  
4. Pousser votre branche : `git push origin feature/VotreFonctionnalité`  
5. Créer une pull request  

---

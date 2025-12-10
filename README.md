# GSB Backend API

## Présentation du projet

Ce projet constitue l'API backend de l'application **GSB (Gestion de Suivi des Bordereaux)**, développée dans le cadre de l'**épreuve E5 du BTS SIO (Services Informatiques aux Organisations)**, option **SLAM (Solutions Logicielles et Applications Métier)**.

Cette API RESTful permet la gestion complète d'un système de suivi des bordereaux de frais pour une entreprise, avec authentification sécurisée, gestion des utilisateurs, gestion des bordereaux et stockage de fichiers sur le cloud.

---

## Table des matières
- [Contexte pédagogique](#contexte-pédagogique)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Installation et démarrage](#installation-et-démarrage)
- [Endpoints de l'API](#endpoints-de-lapi)
- [Sécurité et authentification](#sécurité-et-authentification)
- [Comptes de démonstration](#comptes-de-démonstration)

---

## Contexte pédagogique

### Objectifs pédagogiques
Ce projet démontre la maîtrise des compétences suivantes :
- **Développement d'une API REST** : Conception et implémentation d'une API RESTful complète
- **Gestion de base de données** : Utilisation de MongoDB avec Mongoose pour la modélisation des données
- **Sécurité** : Implémentation d'un système d'authentification JWT et gestion des rôles utilisateurs
- **Intégration cloud** : Utilisation d'AWS S3 pour le stockage de fichiers
- **Architecture logicielle** : Organisation du code selon une architecture MVC (Modèle-Vue-Contrôleur)
- **Gestion de projet** : Structure modulaire et code maintenable

### Compétences évaluées
- Analyse des besoins et conception de l'API
- Développement backend avec Node.js et Express
- Gestion des données avec MongoDB
- Sécurisation de l'application
- Intégration de services externes (AWS S3)

---

## Fonctionnalités principales

### Gestion des utilisateurs
- **Inscription** : Création de nouveaux comptes utilisateurs
- **Authentification** : Connexion sécurisée avec génération de tokens JWT
- **Gestion des rôles** : Système de rôles (utilisateur basique / administrateur)
- **Profil utilisateur** : Consultation et modification des informations personnelles
- **Changement de mot de passe** : Mise à jour sécurisée des mots de passe

### Gestion des bordereaux
- **Création** : Ajout de nouveaux bordereaux avec justificatifs
- **Consultation** : Récupération des bordereaux par utilisateur ou globalement
- **Modification** : Mise à jour des bordereaux existants
- **Suppression** : Suppression de bordereaux
- **Validation/Refus** : Gestion du workflow de validation par les administrateurs
- **Statistiques** : Calcul et récupération de statistiques sur les bordereaux

### Gestion des fichiers
- **Upload de justificatifs** : Téléversement de fichiers pour les bordereaux
- **Stockage cloud** : Stockage sécurisé sur AWS S3
- **Pièces jointes** : Gestion d'une bibliothèque de pièces jointes par utilisateur
- **Suppression** : Gestion de la suppression des fichiers

---

## Technologies utilisées

### Backend
- **Node.js** : Environnement d'exécution JavaScript côté serveur
- **Express** : Framework web pour créer l'API REST
- **MongoDB** : Base de données NoSQL pour le stockage des données
- **Mongoose** : Bibliothèque pour modéliser les données MongoDB

### Sécurité
- **JWT (JSON Web Tokens)** : Système d'authentification et d'autorisation
- **SHA-256** : Hachage sécurisé des mots de passe
- **CORS** : Gestion des requêtes cross-origin

### Services externes
- **AWS S3** : Stockage cloud des fichiers et justificatifs
- **AWS SDK** : Intégration avec les services Amazon Web Services

### Outils
- **Multer** : Gestion des uploads de fichiers
- **dotenv** : Gestion des variables d'environnement

---

## Architecture du projet

Le projet suit une architecture **MVC (Modèle-Vue-Contrôleur)** :

```
GSBbackend/
├── controllers/    # Logique métier (traitement des requêtes)
│   ├── bill_controller.js      → Gestion des bordereaux
│   ├── login_controller.js     → Authentification
│   ├── register_controller.js  → Inscription
│   └── user_controller.js      → Gestion des utilisateurs
│
├── models/         # Modèles de données (schémas MongoDB)
│   ├── bill_model.js   → Modèle Bordereau
│   └── user_model.js   → Modèle Utilisateur
│
├── routes/         # Définition des routes API
│   ├── bill_route.js    → Routes /api/bills
│   ├── login_route.js   → Routes /api/login
│   └── user_route.js    → Routes /api/users
│
├── middlewares/    # Middlewares Express
│   ├── errorHandler.js  → Gestion centralisée des erreurs
│   └── upload.js        → Configuration Multer pour les uploads
│
├── utils/          # Fonctions utilitaires
│   └── s3.js       → Fonctions d'interaction avec AWS S3
│
└── index.js        # Point d'entrée de l'application
```

### Modèles de données

#### Utilisateur
- Informations personnelles (nom, email)
- Mot de passe hashé
- Rôle (utilisateur / administrateur)
- Pièces jointes associées
- Date de création

#### Bordereau
- Date et montant
- Type (Repas, Transport, Hébergement, Autre)
- Description
- Justificatif (URL S3)
- Statut (En attente, Validée, Refusée)
- Utilisateur associé
- Date de création

---

## Installation et démarrage

### Prérequis
- Node.js installé (version 14 ou supérieure)
- MongoDB accessible (local ou cloud)
- Compte AWS avec accès S3 (pour le stockage des fichiers)

### Installation
1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Configurer les variables d'environnement :
   Créer un fichier `.env` à la racine avec :
   ```env
   URI=mongodb://[user]:[password]@[host]:[port]/[database]
   JWT_SALT=votre_sel_jwt
   JWT_SECRET=votre_clé_secrète_jwt
   AWS_ACCESS_KEY_ID=votre_clé_aws
   AWS_SECRET_ACCESS_KEY=votre_clé_secrète_aws
   AWS_BUCKET_NAME=nom_de_votre_bucket_s3
   ```

3. Démarrer le serveur :
   ```bash
   npm start
   ```

L'API sera accessible sur `http://localhost:3000`

---

## Endpoints de l'API

### Authentification
- `POST /api/login` → Connexion (retourne un token JWT)
- `POST /api/users` → Inscription d'un nouvel utilisateur

### Utilisateurs
- `GET /api/users` → Liste des utilisateurs (authentification requise)
- `GET /api/users/:_id` → Détails d'un utilisateur
- `GET /api/users/length/stats` → Statistiques sur les utilisateurs
- `PUT /api/users/:_id` → Modification d'un utilisateur
- `PUT /api/users/changePassword/:_id` → Changement de mot de passe
- `DELETE /api/users/:_id` → Suppression d'un utilisateur

### Pièces jointes
- `POST /api/users/attachment/create` → Création d'une pièce jointe (upload fichier)
- `GET /api/users/attachment/get` → Liste des pièces jointes
- `DELETE /api/users/attachment/delete/:attachmentUrl` → Suppression d'une pièce jointe

### Bordereaux
- `GET /api/bills` → Liste de tous les bordereaux
- `GET /api/bills/:_id` → Détails d'un bordereau
- `GET /api/bills/user/:id` → Bordereaux d'un utilisateur spécifique
- `GET /api/bills/stats/byUser` → Statistiques par utilisateur
- `POST /api/bills` → Création d'un bordereau (avec upload justificatif)
- `POST /api/bills/withAttachment` → Création avec pièce jointe existante
- `PUT /api/bills/:_id` → Modification d'un bordereau
- `PUT /api/bills/:_id/validate` → Validation (admin uniquement)
- `PUT /api/bills/:_id/reject` → Refus (admin uniquement)
- `DELETE /api/bills/:_id` → Suppression d'un bordereau
- `DELETE /api/bills/user/:_id` → Suppression de tous les bordereaux d'un utilisateur

---

## Sécurité et authentification

### Système d'authentification
- **JWT (JSON Web Tokens)** : Tokens sécurisés pour l'authentification
- **Hachage des mots de passe** : Utilisation de SHA-256 avec un sel
- **Protection des routes** : Middleware de vérification de token sur les routes sensibles
- **Gestion des rôles** : Vérification des permissions selon le rôle utilisateur

### Sécurité des données
- Validation des données d'entrée
- Gestion centralisée des erreurs
- Protection contre les injections
- Stockage sécurisé des fichiers sur AWS S3

---

## Comptes de démonstration

Pour faciliter la démonstration de l'application, deux comptes sont pré-configurés :

### Utilisateur standard
- **Email** : `jean@doe.com`
- **Mot de passe** : `password`
- **Rôle** : Utilisateur basique
- **Fonctionnalités accessibles** :
  - Création et gestion de ses bordereaux
  - Consultation de ses statistiques
  - Gestion de ses pièces jointes
  - Modification de son profil

### Administrateur
- **Email** : `jean@admin.com`
- **Mot de passe** : `password`
- **Rôle** : Administrateur
- **Fonctionnalités accessibles** :
  - Toutes les fonctionnalités utilisateur
  - Gestion de tous les utilisateurs
  - Validation et refus des bordereaux
  - Consultation des statistiques globales
  - Accès au tableau de bord administrateur

**Note** : Ces comptes doivent être présents dans la base de données MongoDB pour fonctionner.

---

## Points techniques remarquables

### Architecture
- **Séparation des responsabilités** : Contrôleurs, modèles et routes bien séparés
- **Middleware personnalisé** : Gestion d'erreurs centralisée
- **Modularité** : Code organisé et réutilisable

### Bonnes pratiques
- **Validation des données** : Vérification des entrées utilisateur
- **Gestion d'erreurs** : Traitement approprié des erreurs
- **Sécurité** : Authentification et autorisation robustes
- **Scalabilité** : Architecture permettant l'évolution de l'application

### Intégrations
- **Base de données MongoDB** : Stockage des données utilisateurs et bordereaux
- **AWS S3** : Stockage cloud des fichiers justificatifs
- **JWT** : Authentification moderne et sécurisée

---

## Conclusion

Cette API backend démontre la capacité à concevoir, développer et sécuriser une application web complète, en respectant les bonnes pratiques de développement et en intégrant des services cloud modernes. Elle constitue la base technique solide pour l'application GSB de gestion des bordereaux de frais.

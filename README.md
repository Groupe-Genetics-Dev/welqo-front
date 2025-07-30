# Welqo - Gestion Intelligente d'Immeubles


Welqo est une solution numérique complète pour la gestion moderne des résidences, utilisant des QR codes intelligents pour simplifier le contrôle d'accès, le suivi des gardiens et la communication entre tous les acteurs de votre immeuble.

## 🚀 Fonctionnalités Principales

### 🏠 **Pour les Résidents**
- Génération de QR codes sécurisés pour les visiteurs
- Contrôle total des autorisations d'accès
- Interface intuitive et responsive

### 🛡️ **Pour les Gardiens**
- Scanner QR codes via smartphone
- Pointage automatique avec géolocalisation
- Signalement d'incidents en temps réel avec photos

### 📊 **Pour les Gestionnaires/Syndics**
- Tableau de bord complet avec statistiques
- Rapports automatiques détaillés
- Gestion multi-immeubles
- Vue d'ensemble des activités

### 🔐 **Sécurité & Contrôle**
- Validation automatique des accès
- Notifications en temps réel
- Traçabilité complète des entrées/sorties

## 🛠️ Technologies Utilisées

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **3D Graphics**: Three.js avec React Three Fiber
- **Icons**: Lucide React
- **Animations**: Custom CSS + Three.js animations

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Un navigateur moderne supportant WebGL

## ⚡ Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/welqo.git
   cd welqo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Ouvrir dans le navigateur**
   Visitez [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du Projet

```
welqo/
├── app/
│   ├── page.tsx                 # Page d'accueil principale
│   ├── residents/
│   │   └── login/              # Interface résidents
│   ├── gardiens/
│   │   └── login/              # Interface gardiens
│   └── syndic/
│       └── login/              # Interface gestionnaires
├── components/
│   ├── ui/                     # Composants UI (shadcn/ui)
│   ├── cookie-banner.tsx       # Gestion des cookies
│   └── session-manager.tsx     # Gestion des sessions
├── hooks/
│   ├── use-session.ts          # Hook de gestion des sessions
│   └── use-cookies.ts          # Hook de gestion des cookies
└── public/
    ├── welqo-logo.png          # Logo principal
    └── demo.pdf                # Fichier de démonstration
```

## 🎨 Composants 3D

Le projet inclut plusieurs composants 3D animés :

- **AnimatedQRCode** : QR codes flottants animés
- **Building3D** : Immeubles 3D avec fenêtres éclairées
- **SecurityShield** : Boucliers de sécurité rotatifs
- **FloatingNotification** : Notifications flottantes avec effets

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Configuration de base
NEXT_PUBLIC_APP_NAME=Welqo
NEXT_PUBLIC_APP_VERSION=1.0.0

# URLs des APIs (à adapter selon votre backend)
NEXT_PUBLIC_API_URL=https://api.welqo.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.welqo.com
```

### Personnalisation des Couleurs

Les couleurs principales sont définies dans le CSS :
- **Bleu principal** : `#082038`
- **Jaune accent** : `#efb83b`

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints optimisés :
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px  
- **Desktop** : > 1024px

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel --prod
```

### Build Manuel

```bash
npm run build
npm start
```

## 🔒 Gestion des Cookies et Sessions

Le projet inclut un système de gestion des cookies conforme RGPD :

- **Cookies nécessaires** : Sessions utilisateur
- **Cookies analytiques** : Suivi des interactions (optionnel)
- **Cookies fonctionnels** : Préférences utilisateur

## 🎯 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Pushez la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📞 Support

- **Documentation** : [docs.welqo.com](https://docs.welqo.com)
- **Support technique** : support@welqo.com
- **Site web** : [groupegenetics.com](https://groupegenetics.com)

## 📄 Licence

Ce projet est la propriété de **Genetics Group**. Tous droits réservés.

## 👥 Équipe

Développé avec ❤️ par l'équipe **Genetics**

---

## 🔄 Changelog

### Version 1.0.0
- ✅ Interface d'accueil avec animations 3D
- ✅ Système de navigation responsive
- ✅ Gestion des cookies RGPD
- ✅ Sessions utilisateur
- ✅ Interfaces dédiées par type d'utilisateur
- ✅ Animations Three.js optimisées

---

**Welqo** - Simplifiez la gestion de votre résidence 🏠✨

export default {
  // global
  auth: {
    username: "Nom d'utilisateur",
    email: 'Email',
    password: 'Mot de passe',
    signup: 'Inscription',
    signin: 'Connexion',
    signout: 'Déconnexion',
    noAccount: "Vous n'avez pas de compte?",
    authenticating: 'authentifier...',
  },
  cmdk: {
    typeACommandOrSearch: 'Tapez une commande ou une recherche',
    frequentyUsed: 'Util utilisé',
    account: 'Compte',
    navigation: 'Navigation',
    pageActions: 'Actions de page',
  },
  theme: {
    title: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
  },
  teamSwitcher: {
    personalAccount: 'Compte personnel',
    searchTeam: 'Rechercher une équipe...',
    createTeam: 'Créer une équipe',
  },
  createTeam: {
    description: 'Ajoutez une nouvelle équipe pour gérer les produits et les clients.',
  },

  // pages
  settings: {
    title: 'Paramètres',
    sessions: 'Sessions',
    auditLogs: "Journaux d'audit",
    general: 'Général',
    security: 'Sécurité',
    twoFactor: {
      enable: "Activer l'authentification à deux facteurs",
      disable: "Désactiver l'authentification à deux facteurs",
      recoveryCodes: 'Codes de récupération',
      recoveryCodesDescription:
        "Les codes de récupération sont utilisés pour accéder à votre compte au cas où vous perdez l'accès à votre application d'authentification à deux facteurs.",
      regenerate: 'Régénérer les codes de récupération',
      show: 'Afficher les codes de récupération',
    },
    sessionsTable: {
      os: 'OS',
      browser: 'Navigateur',
      ipAddress: 'Adresse IP',
      expiresAt: 'Expire le',
      createdAt: 'Créé le',
    },
  },
  billing: {
    title: 'Facture',
  },
  home: {
    title: 'Accueil',
  },

  // admin
  admin: {
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
  },
} as const;

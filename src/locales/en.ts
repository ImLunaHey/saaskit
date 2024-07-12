import mapObject from 'map-obj';
import { localize } from 'pseudo-localization';

const en = {
  // global
  auth: {
    username: 'Username',
    email: 'Email',
    password: 'Password',
    signup: 'Sign up',
    signin: 'Sign in',
    signout: 'Sign out',
    noAccount: "Don't have an account?",
    authenticating: 'Authenticating...',
  },
  cmdk: {
    typeACommandOrSearch: 'Type a command or search...',
    frequentyUsed: 'Frequently used',
    account: 'Account',
    navigation: 'Navigation',
    pageActions: 'Page actions',
  },
  theme: {
    title: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  teamSwitcher: {
    personalAccount: 'Personal account',
    searchTeam: 'Search team...',
    createTeam: 'Create team',
  },
  createTeam: {
    description: 'Add a new team to manage products and customers.',
  },

  // pages
  settings: {
    title: 'Settings',
    sessions: 'Sessions',
    auditLogs: 'Audit logs',
    general: 'General',
    security: 'Security',
    twoFactor: {
      enable: 'Enable Two-Factor Authentication',
      disable: 'Disable Two-Factor Authentication',
      recoveryCodes: 'Recovery codes',
      recoveryCodesDescription:
        'Recovery codes are used to access your account in case you lose access to your two-factor authentication app.',
      regenerate: 'Regenerate recovery codes',
      show: 'Show recovery codes',
    },
    sessionsTable: {
      os: 'OS',
      browser: 'Browser',
      ipAddress: 'IP Address',
      expiresAt: 'Expires',
      createdAt: 'Created at',
    },
  },
  billing: {
    title: 'Billing',
  },
  home: {
    title: 'Home',
  },

  // admin
  admin: {
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
  },
} as const;

const pseudo = false;

export default pseudo
  ? (mapObject(
      en,
      (key, value) => {
        console.info('pseudo-localizing', key, value);
        return [key, typeof value === 'string' ? localize(value, { strategy: 'accented' }) : value];
      },
      { deep: true },
    ) as typeof en)
  : en;

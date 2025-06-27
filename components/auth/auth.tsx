import Constants from 'expo-constants';

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = Constants.expoConfig?.extra ?? {};

export { AUTH0_CLIENT_ID, AUTH0_DOMAIN };


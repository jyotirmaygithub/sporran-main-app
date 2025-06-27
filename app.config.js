import 'dotenv/config';

export default {
  expo: {
    name: "your-app-name",
    slug: "your-app-slug",
    version: "1.0.0",
     sdkVersion: "53.0.0",
    extra: {
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    },
  },
};

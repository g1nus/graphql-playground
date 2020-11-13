import env from './env';

const config = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
  },
};

export default config;

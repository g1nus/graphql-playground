import envalid, { str, port, bool } from 'envalid';

const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'test'] }),
    PORT: port({ devDefault: 8080 }),
    GRAPHQL_PATH: str({ default: '/graphql' }),
    GRAPHQL_PLAYGROUND: bool({ default: true }),
  },
  {
    strict: true,
  },
);

export default env;

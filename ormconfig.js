module.exports = [
  {
    name: 'development',
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscriberDir: 'src/subscriber'
    }
  },
  {
    name: 'test',
    type: 'sqlite',
    database: 'test.database.sqlite',
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscriberDir: 'src/subscriber'
    }
  }
  // {
  //   name: 'production',
  //   type: 'sqlite',
  //   url: process.env.DATABASE_URL,
  //   synchronize: true,
  //   logging: false,
  //   synchronize: true,
  //   logging: true,
  //   entities: ['dist/entity/**/*ts'],
  //   migrations: ['dist/migration/**/*.ts'],
  //   subscribers: ['dist/subscriber/**/*.ts'],
  //   cli: {
  //     entitiesDir: 'dist/entity',
  //     migrationsDir: 'dist/migration',
  //     subscriberDir: 'dist/subscriber'
  //   }
  // }
];

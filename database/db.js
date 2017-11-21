let Sequelize = require('sequelize')
  , sequelize = null;

if (!global.hasOwnProperty('db')) {
  if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
    // if the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  false //false
    })
  } else {
    // USE LOCAL MYSQL IF NO HEROKU
    sequelize = new Sequelize('test_1', 'root', '', {
      host: 'localhost',
      dialect: 'mysql'
    });
  }
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  const Users = sequelize.define('userito', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING
  });
  
  Users.sync();

  const save = (username, password, email) => {
    return Users.create({ username, password, email });
  };

  module.exports.save = save;
  module.exports.connection = sequelize;
  module.exports.Users = Users;
}


// POSTGRES WITHOUT SEQUELIZE
// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL || 'postgres://wairrcwaikkuob:b6f7a04b36dc888549bcedd0c99f7cec9c18eb3e83bda91f24bd31fbe60eba50@ec2-50-16-199-246.compute-1.amazonaws.com:5432/d10sjl0jdmpqhu',
//   ssl: true,
// });

// client.connect();

// client.query(`
//   CREATE TABLE USERINFO(
//     ID INT         PRIMARY KEY  NOT NULL,
//     USERNAME       CHAR(50)     NOT NULL,
//     PASSWORD       CHAR(50)     NOT NULL,
//     EMAIL          CHAR(50)     NOT NULL
//   );
//   `, (err, resp) => {
//   if (err) {
//     console.log('errored');
//     throw err;
//   }
//   // client.query(`
//   // SELECT password FROM company
//   // `, (err, resp) => {
//   //   if (err) {
//   //     console.log('errored 2');
//   //     throw err;
//   //   }
//   //   console.log('not errored');
//   //   console.log(resp);
//   // })
//   // client.query(`
//   // INSERT INTO company (ID, USERNAME, PASSWORD) VALUES (NULL, 'DAVID', 'BOWIE');
//   // `, (err, resp) => {
//   //   console.log('ADDED INTO DB');
//   //   console.log(resp)
//   //   client.end();
//   // })
// });
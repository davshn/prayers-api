const server = require("./src/server.js");
const { conection } = require("./src/models/index.js");

const { PORT } = process.env;

// Sync all models,

conection.sync({ force: false, logging: false }).then(() => {
  server.listen(PORT, () => {
    //Run server in PORT
    console.log("%s listening at " + PORT);
  });
});

module.exports = server;

//heroku logs --tail -a prayers-app
//heroku pg:psql postgresql-graceful-23585 --app prayers-app
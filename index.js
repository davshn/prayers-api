const server = require("./src/server.js");
const { conection } = require("./src/models/index.js");

const { PORT } = process.env;

// Sync all models,

conection.sync({ force: true }).then(() => {
  server.listen(PORT, () => {
    //Run server in PORT
    console.log("%s listening at " + PORT);
  });
});

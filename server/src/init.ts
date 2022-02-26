import "dotenv/config";
// import "regenerator-runtime";

import server from "./app";
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});

module.exports = server;

const http = require("http");
const app = require("./app");
const connectToDB = require("./src/config/db");
const { server_port } = require("./src/utils/secret");

const server = http.createServer(app);

const main = async () => {
  try {
    await connectToDB();
    server.listen(server_port, () => {
      console.log(
        `Bistro Boss Server is running on http://localhost:${server_port}`
      );
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

main();

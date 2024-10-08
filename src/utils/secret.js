require("dotenv").config();

const server_port = process.env.PORT || 1010;
const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id2js.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`; // MongoDB connection string using environment variables

module.exports = { server_port, mongodb_url };

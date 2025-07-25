require("dotenv").config();

const server_port = process.env.PORT || 1010;
// const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id2js.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
const mongodb_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id2js.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

module.exports = { server_port, mongodb_url, jwtSecret, jwtRefreshSecret };

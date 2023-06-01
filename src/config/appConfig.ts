require("dotenv").config();

const appConfig = {
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbType: process.env.DB_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: "7d",
};

export default appConfig;

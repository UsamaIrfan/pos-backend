require("dotenv").config();

const appConfig = {
  clientUrl: process.env.CLIENT_LOCAL_URL,
  resetPassUrl: process.env.CLIENT_LOCAL_RESET_PASSWORD_URL,
  emailVerifyUrl: process.env.CLIENT_LOCAL_VERIFY_EMAIL_URL,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbType: process.env.DB_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: "7d",
  emailHost: process.env.EMAIL_HOST,
  emailSender: process.env.EMAIL_SENDER_EMAIL,
  emailPassword: process.env.EMAIL_SENDER_PASSWORD,
};

export default appConfig;

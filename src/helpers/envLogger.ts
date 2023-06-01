import dotenv from "dotenv";
dotenv.config();

export const logEnvironmentVariables = () => {
  const envObject = {
    BACKEND_LIVE_URL: process.env.BACKEND_LIVE_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: parseInt(process.env.DB_PORT),
    DB_TYPE: process.env.DB_TYPE,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_USER: process.env.S3_USER,
    OO_SECRET: process.env.OO_SECRET,
  };
  return envObject;
};

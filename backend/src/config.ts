import dotenv from "dotenv";
import path from "path";



// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  MONGO_URL: string;
  JWT_SECRET: string;
  PORT: number;
}

// Export the config object
const config: Config = {
  MONGO_URL: process.env.MONGO_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "Secret",
  PORT: Number(process.env.PORT) || 5000,
};

export default config;

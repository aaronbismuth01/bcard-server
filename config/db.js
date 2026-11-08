const dns = require("dns");
const mongoose = require("mongoose");

// Some Windows networks refuse the DNS "SRV" lookup used by mongodb+srv:// addresses.
// Using public DNS servers makes the Atlas connection work on every network.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const ENVIRONMENT = process.env.NODE_ENV || "development";

const getConnectionString = () =>
  ENVIRONMENT === "production"
    ? process.env.MONGO_ATLAS_URI
    : process.env.MONGO_LOCAL_URI;

const connectToDb = async () => {
  const connectionString = getConnectionString();
  const target = ENVIRONMENT === "production" ? "MongoDB Atlas" : "local MongoDB";

  if (!connectionString) {
    console.error(`Missing connection string for ${target}. Check your .env file.`);
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log(`Connected to ${target}`);
  } catch (error) {
    console.error(`Could not connect to ${target}: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDb;
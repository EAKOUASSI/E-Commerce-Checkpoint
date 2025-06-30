import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ Connexion à MongoDB réussie: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Erreur de connexion à MongoDB:", error.message);
    } else {
      console.error(
        "❌ Erreur inconnue lors de la connexion à MongoDB:",
        error
      );
    }
  }
};

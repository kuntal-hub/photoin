import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

const dbConnect = async () => {
    if (connection.isConnected) {
        console.log("Using existing connection to DB");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        //console.log(db.connections[0].readyState)
        connection.isConnected = db.connections[0].readyState;
        console.log("Connection to DB established");
    } catch (error) {
        console.error("Error connecting to DB: ", error);
        process.exit(1);
    }
};

export default dbConnect;
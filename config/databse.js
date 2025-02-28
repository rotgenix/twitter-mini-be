const mongoose = require("mongoose")

const databaseConnection = () => {
    console.log(process.env.MONGO_DB)
    mongoose.connect(process.env.MONGO_DB, {
        dbName: "twitter"
    })
        .then((res) => {
            console.log(`Connected to DB`);
            console.log(`DB Host Url: ${res?.connection.host}`);
        })
        .catch((error) => {
            console.log(`DB Connection Error`);
            console.log(`Error: ${error}`)
        });
}

module.exports = databaseConnection
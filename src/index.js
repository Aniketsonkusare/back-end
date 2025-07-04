import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Error `, error);
  });

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("error", error);
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(`Error listening port ${error}`);
//     throw error;
//   }
// })();

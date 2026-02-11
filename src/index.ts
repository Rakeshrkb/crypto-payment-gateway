import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./constants/connectDb";
import { ErrorHandler } from "./middlewares/errorHandler";
import mainRouter from "./routes/index";


dotenv.config();

const app = express();
app.use(express.json());
connectDB();


app.use("/api/", mainRouter);

app.get("/", (_req, res) => {
  res.send("TS backend running 🚀");
});
app.use(ErrorHandler);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

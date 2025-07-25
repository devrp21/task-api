import express   from "express";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import sequelize from "./config/db.js";
import dotenv from "dotenv";    
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/tasks", taskRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;

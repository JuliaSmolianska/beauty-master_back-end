import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import clientsRouter from './routes/api/clients_router.js';
import userRouter from "./routes/api/users_router.js";
import authRouter from "./routes/api/auth_router.js";

const swaggerJson = JSON.parse(
  fs.readFileSync(`./swagger.json`)
);

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson)
);

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/clients", clientsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
})

export default app;
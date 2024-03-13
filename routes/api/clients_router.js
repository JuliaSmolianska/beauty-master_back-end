import express from "express";
import clientController from "../../controllers/client_controller.js";
import { isEmptyBody } from "../../middlewares/index.js";
import { isValidId } from "../../middlewares/isValidId.js";
import validateBody from "../../decorators/validateBody.js";
import { addClientSchema, updateClientSchema } from "../../models/Clients.js"
import authenticate from "../../middlewares/authenticate.js";

const clientRouter = express.Router();

clientRouter.use(authenticate);

clientRouter.get('/all-clients', clientController.getClientsList);

clientRouter.get('/', clientController.getAllClients);

clientRouter.post('/', isEmptyBody, validateBody(addClientSchema), clientController.addClient);

clientRouter.put('/:clientId', isValidId, isEmptyBody, validateBody(updateClientSchema), clientController.updateClientId);

clientRouter.delete('/:clientId', isValidId, clientController.deleteClientId)

export default clientRouter;
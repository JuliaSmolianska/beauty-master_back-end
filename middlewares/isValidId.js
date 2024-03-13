import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/index.js";

export const isValidId = (req, res, next) => {
    const { clientId } = req.params;
    if (!isValidObjectId(clientId)) {
        return next(HttpError(404, `Record with id=${clientId} not found`))
    }
    next();
}
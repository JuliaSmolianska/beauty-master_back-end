import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Client from "../models/Clients.js";


const getClientsList = async (req, res) => {
  const { _id: owner } = req.user;
  const allClientsList = await Client.aggregate([
    { $match: { owner } }, 
    { $group: { _id: "$name", clients: { $push: "$$ROOT" } } }, 
    { $project: { _id: 0, name: "$_id", clients: 1 } } 
  ]);
  res.json(allClientsList);
}


const getAllClients = async (req, res) => {
  const { _id: owner } = req.user;
  const allClientsList = await Client.find({ owner }, "-createdAt -updatedAt")
    .lean();
  allClientsList.forEach(client => {
    client.visitTimes.forEach(visitTime => {
      delete visitTime._id;
    });
  });
  res.json(allClientsList);
}


const addClient = async (req, res) => {
  const { _id: owner } = req.user;
  const newClient = await Client.create({ ...req.body, owner })
  res.status(201).json(newClient);
}

const updateClientId = async (req, res) => {
  const { clientId } = req.params;
  const { _id: owner } = req.user;
  const updateClient = await Client.findByIdAndUpdate({ _id: clientId, owner }, req.body);
  if (!updateClient) {
    throw HttpError(404, `Client record with id=${clientId} not found`);
  }
  res.json(updateClient);
}


const deleteClientId = async (req, res) => {
  const { clientId } = req.params;
  console.log(clientId)
  const { _id: owner } = req.user;
  const removeClientRecord = await Client.findOneAndDelete({ _id: clientId, owner })
  if (!removeClientRecord) {
    throw HttpError(404, `Client record with id=${clientId} not found`);
  }
  res.json({ message: "Deleted success" });
}


export default {
  getClientsList: ctrlWrapper(getClientsList),
  getAllClients: ctrlWrapper(getAllClients),
  addClient: ctrlWrapper(addClient),
  updateClientId: ctrlWrapper(updateClientId),
  deleteClientId: ctrlWrapper(deleteClientId)
};
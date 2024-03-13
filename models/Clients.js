import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const visitTimeSchema = new Schema({
  visitTime: String,
  visitEndTime: String,
  isSelected: Boolean
});

const clientSchema = new Schema({
  name: {
    type: String,
    min: 1,
    max: 64
  },
  phone: {
    type: String,
    min: 0,
    max: 20
  },
  serviceType: {
    type: [String]
  },
  visitTimes: [visitTimeSchema],

  notes: {
    type: String
  },
  date: {
    type: Number,
    min: 1,
    max: 31
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    min: 2024,
    max: 2030
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
},
  { versionKey: false, timestamps: true }
)

clientSchema.post("save", handleSaveError);
clientSchema.pre("findOneAndUpdate", preUpdate);
clientSchema.post("findOneAndUpdate", handleSaveError);

const Client = model("client", clientSchema);

export const addClientSchema = Joi.object({
  name: Joi.string().min(1).max(64).required().messages({ "any.required": "missing required client name field" }),
  phone: Joi.string().min(0).max(20),
  serviceType: Joi.array().items(Joi.string()).required().messages({ "any.required": "missing required service type field" }),
  visitTimes: Joi.array().items(
    Joi.object({
      visitTime: Joi.string().required(),
      visitEndTime: Joi.string().required(),
      isSelected: Joi.boolean().required()
    })
  ).required().messages({ "any.required": "missing required visit Times field" }),
  notes: Joi.string().allow('').optional(),
  date: Joi.number().min(1).max(31).required().messages({ "any.required": "missing required date field" }),
  month: Joi.number().min(1).max(12).required().messages({ "any.required": "missing required month field" }),
  year: Joi.number().min(2024).max(2030).required().messages({ "any.required": "missing required year field" }),
})

export const updateClientSchema = Joi.object({
  name: Joi.string().min(1).max(64),
  phone: Joi.string().min(0).max(20),
  serviceType: Joi.array().items(Joi.string()),
  visitTimes: Joi.array().items(
    Joi.object({
      visitTime: Joi.string().required(),
      visitEndTime: Joi.string().required(),
      isSelected: Joi.boolean().required()
    })
  ),
  notes: Joi.string().allow('').optional(),
  date: Joi.number().min(1).max(31),
  month: Joi.number().min(1).max(12),
  year: Joi.number().min(2024).max(2030)
})

export default Client;
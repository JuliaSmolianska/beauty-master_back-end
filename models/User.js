import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const freeWorkDaysSchema = new Schema({
    date: Number,
    month: Number,
    year: Number
});

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            match: emailRegexp,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        beautyMaster: {
            type: String,
            required: true,
        },
        avatarURL: {
            type: String,
        },
        workHourStart: {
            type: Number,
        },
        workHourEnd: {
            type: Number,
        },
        weekendSchedule: {
            type: [String]
        },
        freeWorkDays: [freeWorkDaysSchema],

        token: {
            type: String,
        },

    },
    { versionKey: false, timestamps: true }
)


userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", preUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);


export const authRegisterForm = Joi.object({
    name: Joi.string().min(1).max(32).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(8).max(32).required(),
    beautyMaster: Joi.string().required(),
    workHourStart: Joi.number(),
    workHourEnd: Joi.number(),
    weekendSchedule: Joi.array().items(Joi.string()),
    freeWorkDays: Joi.array().items(
        Joi.object({
            date: Number,
            month: Number,
            year: Number
        })
    ),
});

export const authLoginSchema = Joi.object({
    password: Joi.string().min(8).max(32).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    token: Joi.string(),
});

export const userUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(32),
    email: Joi.string().pattern(emailRegexp),
    password: Joi.string().min(8).max(32),
    newPassword: Joi.string().min(8).max(32),
    beautyMaster: Joi.string(),
    workHourStart: Joi.number(),
    workHourEnd: Joi.number(),
    weekendSchedule: Joi.array().items(Joi.string()),
    freeWorkDays: Joi.array().items(
        Joi.object({
            date: Number,
            month: Number,
            year: Number
        })
    ),
})

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({ "any.required": "missing required field email" }),
})


export default User;


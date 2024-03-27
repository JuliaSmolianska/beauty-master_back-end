import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use"); 
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const workHourStart = 8;
  const workHourEnd = 20;
  const weekendSchedule = [];
  const freeWorkDays = [];
  const newUser = await User.create({ ...req.body, name, password: hashPassword, workHourStart, workHourEnd, weekendSchedule, freeWorkDays });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      userId: newUser._id,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '120h' })
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      name: user.name,
      email,
      beautyMaster: user.beautyMaster,
      workHourStart: user.workHourStart, 
      workHourEnd: user.workHourEnd, 
      weekendSchedule: user.weekendSchedule, 
      freeWorkDays: user.freeWorkDays
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
}


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout)
};
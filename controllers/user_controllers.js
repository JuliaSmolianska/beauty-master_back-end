import User from "../models/User.js";
import "dotenv/config";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import bcrypt from "bcryptjs";
import generator from 'generate-password';

const generatePassword = generator.generate({
  length: 10,
  numbers: true
});


const currentUser = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id, "-createdAt -updatedAt");
  res.json(user)
}


const updateUser = async (req, res) => {
  const { _id } = req.user;
  const updateUserInfo = req.body;
  if ('password' in updateUserInfo && 'newPassword' in updateUserInfo) {
    try {
      await changePassword(req, res);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  } else {
    const updateUser = await User.findByIdAndUpdate(_id, updateUserInfo);

    if (!updateUser) {
      return res.status(404).json({ error: `User not found` })
    }
    res.status(200).json(updateUser);
  }
}

const changePassword = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id });
  const { password, newPassword } = req.body;
  const compareCurrentPassword = await bcrypt.compare(password, user.password);

  if (!compareCurrentPassword) {
    throw HttpError(401, "This password is wrong!")
  }

  const comparePassword = await bcrypt.compare(newPassword, user.password);
  if (comparePassword) {
    throw HttpError(401, "This Password is your current password")
  }
  const hashNewPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(_id, { password: hashNewPassword });
  res.status(200).json({ message: "Password changed successful" });
}


const forgotPasswordEmail = (email, generatePassword) => ({
  to: email,
  subject: "Ваш новий пароль",
  html: `<p>${generatePassword}</p><br/><a target="_blank" href="https://incomparable-bonbon-5cfefe.netlify.app/login"><button>Перейти на сторінку входу</button></a>`
});

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing email")
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found")
  }
  const hashNewPassword = await bcrypt.hash(generatePassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashNewPassword });
  await sendEmail(forgotPasswordEmail(email, generatePassword));

  res.status(200).json({ message: "Please, check your email" });
}


export default {
  currentUser: ctrlWrapper(currentUser),
  updateUser: ctrlWrapper(updateUser),
  forgotPassword: ctrlWrapper(forgotPassword)
};
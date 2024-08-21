import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(errorHandler(400, "User already exist, please Signin!"));
    }

    if (password !== confirmPassword) {
      return next(
        errorHandler(400, "Password does not match with Confirmed Password!")
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return next(errorHandler(404, "Please input valid email or password!"));
    }

    const validPassword = bcrypt.compareSync(password, userExist.password);
    if (!validPassword) {
      return next(errorHandler(401, "Please input valid email or password!"));
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = userExist._doc;

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { username, email, photoURL } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = userExist._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
    const newUser = new User({
      username:
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: email,
      password: hashedPassword,
      avatar: photoURL,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = newUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json('User has been logged out!')
  } catch (error) {
    next(error)
  }
}

import User from "../models/User.js";
import bcrypt from "bcrypt";

// Serviço de registro
export const registerUser = async ({ username, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    return await newUser.save();
};

// Serviço de autenticação
export const authenticateUser = async ({ username, password }) => {
    const user = await User.findOne({ username }).select("+password +email");
    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    return user;
};

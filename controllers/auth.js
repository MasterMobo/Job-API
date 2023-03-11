const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const User = require("../models/User");

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        msg: `Successfully created account for ${user.name}`,
        user: { name: user.name },
        token,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const passwordCorrect = await foundUser.comparePassword(password);

    if (!passwordCorrect) {
        throw new UnauthenticatedError("Password is incorrect");
    }

    const token = foundUser.createJWT();
    res.status(StatusCodes.OK).json({
        msg: `Welcome back, ${foundUser.name}!`,
        user: { name: foundUser.name },
        token,
    });
};

module.exports = { register, login };

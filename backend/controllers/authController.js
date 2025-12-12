import { EmailLoginSchema, userSchema } from "../schema/user.js";
import { compareSync, hashSync } from "bcryptjs";
import { prismaClient } from "../routes/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestException } from "../exceptions/bad-request.js";
import { UnprocessableEntityException } from "../exceptions/unprocessable-entity.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCodes } from "../exceptions/root.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerController = async (req, res, next) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const userData = result.data;
    if (!userData.name || !userData.email || !userData.password || !userData.phoneNo) {
        return next(new BadRequestException("Please fill all the fields", ErrorCodes.ALL_FIELDS_REQUIRED));
    }

    // Check if email already exists
    const existingUserByEmail = await prismaClient.user.findUnique({
        where: { email: userData.email }
    });
    if (existingUserByEmail) {
        return next(new BadRequestException("Email already exists. Please use a different email.", ErrorCodes.USER_ALREADY_EXISTS));
    }

    // Check if phone number already exists
    const existingUserByPhone = await prismaClient.user.findUnique({
        where: { phoneNo: userData.phoneNo }
    });
    if (existingUserByPhone) {
        return next(new BadRequestException("Phone number already exists. Please use a different phone number.", ErrorCodes.USER_ALREADY_EXISTS));
    }

    const hashPassword = await hashSync(userData.password, 10);
    const user = await prismaClient.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashPassword,
            phoneNo: userData.phoneNo
        }
    });
    return res.status(201).json({ message: "User created successfully", user: { name: user.name, email: user.email, phoneNo: user.phoneNo } });
}

export const loginController = async (req, res, next) => {
    const result = EmailLoginSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const userData = result.data;
    if (!userData.email || !userData.password) {
        return next(new BadRequestException("Please fill all the fields", ErrorCodes.ALL_FIELDS_REQUIRED));
    }
    const user = await prismaClient.user.findUnique({
        where: {
            email: userData.email
        }
    });
    if (!user) {
        return next(new NotFoundException("Invalid email or password", ErrorCodes.USER_NOT_FOUND));
    }
    const isPasswordMatch = compareSync(userData.password, user.password);
    if (!isPasswordMatch) {
        return next(new BadRequestException("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS));
    }

    // Generate JWT token directly
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    
    return res.status(200).json({
        message: "Login successfully",
        user: { name: user.name, email: user.email, phoneNo: user.phoneNo },
        token
    });
}

export const getUserController = async (req, res, next) => {
    // user comes from authMiddleware after token verification.
    const id = req.user.id;
    const dbUser = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });
    if (!dbUser) {
        return next(new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND));
    }
    return res.status(200).json({ message: "User Retrieved Successfully", user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, phoneNo: dbUser.phoneNo } });
}
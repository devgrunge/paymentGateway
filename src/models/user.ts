import mongoose, { Schema } from "mongoose";

interface IUser {
    email: string;
    username: string;
    password: string;
    paymentId?: string;
}

const userSchema = new Schema<IUser>({
email: { type: String, required: true, unique: false },
 username: { type: String, unique: true, required: true },
 password: { type: String, required: true, unique: false },
 paymentId: { type: String, required: false, unique: true },
 });
export const User = mongoose.model('User', userSchema);
import mongoose from "mongoose";

export const isMongoId = (str: string) => {
    return mongoose.Types.ObjectId.isValid(str);
};

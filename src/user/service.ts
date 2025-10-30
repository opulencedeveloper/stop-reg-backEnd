import { Types } from "mongoose";
import { IRegisterUserInput } from "../auth/interface";
import { hashPassword } from "../utils/auth";
import User from "./entity";
import { IRegisterInput, IUpdatePasswordInput } from "./interface";

class UserService {
  public async createUser(input: IRegisterInput) {
    const password = input.password;
    const hashedPassword = (await hashPassword(password)) as string;

    const user = new User({
      ...input,
      password: hashedPassword,
    });

    await user.save();

    return;
  }

  public async findUserByEmail(email: string) {
    const user = await User.findOne({
      email,
    });

    return user;
  }

  public async findUserByIdWithoutPassword(id: Types.ObjectId) {
    const user = await User.findById(id)
      .select("-password")
      .populate("planId", "name monthlyPrice apiLimit durationInDays isRecommended");

    return user;
  }

  public async findUserByIdWithPassword(id: Types.ObjectId) {
    const user = await User.findById(id);

    return user;
  }

  public async editPasswordById(input: IUpdatePasswordInput) {
    const { userId, password } = input;

    const hashedPassword = (await hashPassword(password)) as string;

    const updatedMenu = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: true }
    );

    return updatedMenu;
  }

  public async regeneratUserToken(apiToken: string, userId: Types.ObjectId) {
    const updatedMenu = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { apiToken } },
      { new: true, runValidators: true }
    );

    return updatedMenu;
  }
}

export const userService = new UserService();

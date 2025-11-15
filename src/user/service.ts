import { ClientSession, Types } from "mongoose";
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

  public async findUserById(userId: Types.ObjectId) {
    const user = await User.findById(userId).lean();

    return user;
  }

  public async findUserByIdWithoutPassword(id: Types.ObjectId) {
    const user = await User.findById(id)
      .select("-password")
      .populate(
        "planId",
        "name monthlyPrice apiLimit durationInDays isRecommended"
      )
      .lean();

    return user;
  }

  public async findUserByIdWithPassword(id: Types.ObjectId) {
    const user = await User.findById(id).lean();

    return user;
  }

  public async updateFulNameByUserId(userId: Types.ObjectId, fullName: string) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { fullName } },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate(
        "planId",
        "name monthlyPrice apiLimit durationInDays isRecommended"
      )
      .lean();

    return updatedUser;
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

  public async decrementApiRequestLeft(
    userId: Types.ObjectId,
    amount: number = 1
  ) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, apiRequestLeft: { $gt: 0 } },
      { $inc: { apiRequestLeft: -amount } },
      { new: true, projection: { _id: 1, apiRequestLeft: 1 } }
    ).lean();

    return updatedUser;
  }

  public async decrementApiRequestLeftByAPIToken(
    apiToken: string,
    amount: number = 1
  ) {
    const updatedUser = await User.findOneAndUpdate(
      { apiToken, apiRequestLeft: { $gt: 0 } },
      { $inc: { apiRequestLeft: -amount } },
      { new: true, projection: { _id: 1, apiRequestLeft: 1 } }
    ).lean();

    return updatedUser;
  }

  public async findUserForRateLimit(userId: Types.ObjectId) {
    return User.findById(userId)
      .select("_id tokenExpiresAt apiRequestLeft planId")
      .lean();
  }

  public async findUserByApiToken(apiToken: string) {
    return User.findOne({ apiToken })
      .select("_id tokenExpiresAt apiRequestLeft planId")
      .lean();
  }
}

export const userService = new UserService();

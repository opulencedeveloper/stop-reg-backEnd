import { IRegisterInput } from "../auth/interface";
import { hashPassword } from "../utils/auth";
import User from "./entity";

class UserService {
  public async createUser(input: IRegisterInput) {
    const password = input.password;
    const hashedPassword = (await hashPassword(password)) as string;

    const user = new User({
      ...input,
      password: hashedPassword
    });

    await user.save();

    return
  }

  public async findUserByEmail(email: string) {
    const user = await User.findOne({
      email,
    });

    return user;
  }
}

export const userService = new UserService();

import { ICreateMyBot } from "./interface";
import MyBot from "./entity";
import { hashPassword } from "../utils/auth";

class MyBotService {
  public async createBot(input: ICreateMyBot) {
    const hashedPassword = (await hashPassword(input.bot_password)) as string;
    const myBot = new MyBot({
      ...input,
      bot_password: hashedPassword,
    });

    const savedBot = await myBot.save();

    return savedBot;
  }

  public async findBotByUsername(bot_username: string) {
    const emailDomain = MyBot.findOne({
      bot_username,
    });

    return emailDomain;
  }
}

export const myBotService = new MyBotService();

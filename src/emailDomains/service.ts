import { IAddEmailDomainUserInput } from "./interface";
import EmailDomain from "./entity";
import { utils } from "../utils";

class EmailDomainService {
  public async addEmailDomain(input: IAddEmailDomainUserInput) {
    const domain = new EmailDomain({
      ...input,
    });

    const savedEmailDomain = await domain.save();

    return savedEmailDomain;
  }

  public async checkIfDomainExist(domain: string) {
    const emailDomain = EmailDomain.findOne({
      domain,
    });

    return emailDomain;
  }

  public async checkDisposableEmail(email: string) {
    const domain = email.split("@")[1].toLowerCase();

    const disposableEmail = await EmailDomain.findOne({ domain }).select(
      "-bot_username -bot_password"
    );

    return disposableEmail;
  }

  public async verifyBulkDomains(domains: string[]) {
    const cleanedDomains = domains.map(utils.normalizeDomain);

    const results = await EmailDomain.find({
      domain: { $in: cleanedDomains },
    });

    return results;
  }
}

export const emailDomainService = new EmailDomainService();

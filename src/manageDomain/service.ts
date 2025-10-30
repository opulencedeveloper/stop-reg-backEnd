import { IAddDomainInput } from "./interface";
import ManageDomain from "./entity";
import { Types } from "mongoose";

class ManageDomainService {
  public async addDomain(input: IAddDomainInput) {
    const domain = new ManageDomain({
      ...input,
    });

    const savedManagedDomain = await domain.save();

    return savedManagedDomain;
  }

  public async findDomainByName(domain: string) {
    const user = await ManageDomain.findOne({
      domain,
    });

    return user;
  }

  public async findDomainsByUserId(userId: Types.ObjectId) {
    const domain = await ManageDomain.find({
      userId,
    });

    return domain;
  }
}

export const manageDomainService = new ManageDomainService();

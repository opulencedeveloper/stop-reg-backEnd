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

  public async findDomainByNameAndUserId(domain: string, userId: Types.ObjectId) {
    const user = await ManageDomain.findOne({
      _id: userId,
      domain,
    });

    return user;
  }

    public async deleteDomainByIdAndUserId(domainId: Types.ObjectId, userId: Types.ObjectId) {
    const user = await ManageDomain.findOneAndDelete({
      _id: domainId,
      userId
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

import { Document, Types } from "mongoose";
import { SubPlan } from "./enum";

export interface ISubscriptionPlan extends Document {
  _id: Types.ObjectId;
  name: SubPlan;             
  monthlyPrice: number;     
  apiLimit: number | null;
  durationInDays: number;      
  isRecommended: boolean;   
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ICreateSubscriptionPlanUserInput {
  name: SubPlan;             
  monthlyPrice: number;     
  apiLimit: number | null;
  durationInDays: number;      
  isRecommended: boolean;   
}

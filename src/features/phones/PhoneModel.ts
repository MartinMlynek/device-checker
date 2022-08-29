import User from "../auth/User";

export enum OperationSystem {
  ANDROID = "ANDROID",
  WINDOWS = "WINDOWS",
  IOS = "IOS",
}

interface Phone {
  id: string;
  code: string;
  os: string;
  vendor: string;
  model: string;
  osVersion: string;
  image?: string;
  borrowed?: { date: number; user: User };
}

export default Phone;

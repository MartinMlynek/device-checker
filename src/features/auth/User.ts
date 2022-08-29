export enum Role {
  USER = "user",
  ADMIN = "admin",
}

interface User {
  id: number;
  type: Role;
  login: string;
  name: string;
  token: string;
  date: number;
}

export interface Credentials {
  login: string;
  password: string;
}

export default User;

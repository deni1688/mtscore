import { register, inject, TYPES, AxiosInstance } from "mts-core";

import { Config } from "../config";

type User = { id: number, name: string, username: string, email: string };
interface UserService { fetchUsers(): Promise<User[]>; }

@register("UserService")
class PlaceholderUserService implements UserService {
  constructor(
    @inject(TYPES.axios) private axios: AxiosInstance,
    @inject("Config") private config: Config
  ) { }

  async fetchUsers(): Promise<User[]> {
    const { data } = await this.axios.get(this.config.getUserServiceUrl());

    return data.map((user: User) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    }));
  }
}

export { UserService, PlaceholderUserService };

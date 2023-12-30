import { register, inject, TYPES, AxiosInstance } from "mts-core";
import { ConfigType, Config } from "./config";

const UserServiceType = Symbol.for("UserService");
type User = { id: number, name: string, username: string, email: string };
interface UserService { fetchUsers(): Promise<User[]>; }

@register(UserServiceType)
class PlaceholderUserService implements UserService {
  constructor(
    @inject(TYPES.axios) private axios: AxiosInstance,
    @inject(ConfigType) private config: Config
  ) { }

  async fetchUsers(): Promise<User[]> {
    const { data } = await this.axios.get(this.config.getUserServiceUrl());

    return data.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    }));
  }
}

export { UserServiceType, UserService, PlaceholderUserService };

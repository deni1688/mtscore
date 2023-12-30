import { register } from "mts-core";

const ConfigType = Symbol.for("Config");
interface Config { getPort(): number; getUserServiceUrl(): string; };

@register(ConfigType)
class AppConfig implements Config {
  private port: number = 6543;
  private userServiceUrl: string = 'https://jsonplaceholder.typicode.com/users';

  constructor() { }

  getPort() {
    return this.port;
  }

  getUserServiceUrl() {
    return this.userServiceUrl;
  }
}

export { ConfigType, Config, AppConfig };

import { register } from "mts-core";

interface Config { getPort(): number; getUserServiceUrl(): string; }

@register("Config")
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

export { Config, AppConfig };

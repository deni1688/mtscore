import * as express from 'express';
import { controller, inject, route, Http } from "mts-core";

import { UserServiceType, UserService } from "./userService";

@controller('users')
export class UserConroller {
  constructor(@inject(UserServiceType) private userService: UserService) { }

  @route(Http.GET)
  async getUsers(_req: express.Request, res: express.Response) {
    res.send(await this.userService.fetchUsers());
  }
}


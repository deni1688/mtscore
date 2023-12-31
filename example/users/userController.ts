import * as express from 'express';
import { controller, inject, route, Http } from "mts-core";

import {UserService} from "./userService";

@controller('users')
export class UserController {
  constructor(
      @inject("UserService") private userService: UserService
  ) { }

  @route(Http.GET)
  async getUsers(_req: express.Request, res: express.Response) {
    res.send(await this.userService.fetchUsers());
  }
}


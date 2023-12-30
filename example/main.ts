import * as express from 'express';
import { mtsCore, container } from 'mts-core';
import { ConfigType, Config } from './config';

import './userService';
import './userController';

function main(app: express.Application) {
  mtsCore.init(app);

  const port = container.get<Config>(ConfigType).getPort();

  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
}

main(express());




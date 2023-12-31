import * as express from 'express';
import { mtsCore, container } from 'mts-core';

import './users';
import './config';

import { Config } from './config';

function main(app: express.Application) {
  mtsCore.init(app);

  const port: number = container.get<Config>("Config").getPort();

  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
}

main(express());




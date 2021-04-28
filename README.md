# MTSCore
A small framework for creating declarative express routing with built in dependency injection.



###  Application main

```ts
import {mtsCore} from 'mts-core';

const app = express();

function bootstrapHttpServer() {
    // ... init other middleware with app.use
    // ... inject additional dependencies
    // ...
    mtsCore.init(app);

    app.listen(config.port);
}

const onServerStartSuccess = _ => console.log(`Server started on :${config.port}`);

bootstrapHttpServer()
    .then(onServerStartSuccess)
    .catch(console.error);

```

###  Controller

```ts
// Some Controller
import {Request, Response} from 'express';
import {container, controller, Http, inject, route} from 'mts-core';

import {TYPES, SomeService} from '../services';
import {someRouteSpecificMiddleware, someControllerMiddleware} from './middleware';

const config = container.get<{apiBaseUrl: string}>(Symbol.for('config'));

@controller(`${config.apiBaseUrl}/somewhere`, someControllerMiddleware)
export class SomeController {
    constructor(@inject(TYPES.SomeService) private someService: someService) {}

    @route(Http.GET, ':somethingId', someRouteSpecificMiddleware)
    async getSomething(request: Request, response: Response) {
        const result = await this.someService.doSomething(request.query);

        response.status(200).json(result);
    }
}

```

###  Service

```ts
// Some Service
import {inject, register} from 'mts-core';
import {SomerRepo, Something, SomeService} from './interfaces';
import {TYPES} from '../types';

@register(TYPES.SomeService)
export class SomeServiceImpl implements SomeService {
    constructor(@inject(TYPES.SomeRepo) private someRepo: SomeRepo) {}

    async doSomething(query: unknown): Promise<Something> {
        let result;

        // do some magic to provide a result

        return result;
    }
}

```

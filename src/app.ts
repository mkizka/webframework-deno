import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.80.0/http/server.ts";
import { pathToRegExp, RouteHandler, Router } from "./router.ts";

type RoutePath<PathString extends string> = 
  PathString extends `/<${infer P1}>/<${infer P2}>` ? { [key in P1|P2]: string } : { [key: string]: string }

export class App {
  private router: Router;
  constructor() {
    this.router = new Router();
  }
  public async serve(addr: string | HTTPOptions) {
    const server = serve(addr);
    console.log(
      `HTTP webserver running.  Access it at: http://localhost:8080/`,
    );
    for await (const request of server) {
      const [handler, params] = this.router.match(request.method, request.url);
      const response = handler(request, params);
      request.respond(response);
    }
  }
  public route<T extends string>(
    path: T | RegExp,
    method: string,
    handler: RouteHandler<RoutePath<T>>,
  ) {
    if (typeof path == "string") {
      this.router.add({ path: pathToRegExp(path), method, handler });
    } else {
      this.router.add({ path, method, handler });
    }
  }
}

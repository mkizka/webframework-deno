import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.80.0/http/server.ts";
import { PathParams, RouteHandler, Router } from "./router.ts";

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
      const [handler, params] = this.router.match(request.url, request.method);
      const response = handler(request, params);
      request.respond(response);
    }
  }
  public route<T extends string>(
    path: T | RegExp,
    method: string,
    handler: RouteHandler<PathParams<T>>,
  ) {
    this.router.add({ path, method, handler: handler as RouteHandler });
  }
}

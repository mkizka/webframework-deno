import { server } from "../deps.ts";
import { Request } from "../mod.ts";
import { PathParams, RouteHandler, Router } from "./router.ts";

export class App {
  public readonly router: Router;
  constructor() {
    this.router = new Router();
  }
  public async serve(addr: string | server.HTTPOptions): Promise<void> {
    const requests = server.serve(addr);
    console.log(
      `HTTP webserver running.  Access it at: http://localhost:8080/`,
    );
    for await (const request of requests) {
      const [handler, params] = this.router.match(request.url, request.method);
      const response = handler(new Request(request), params);
      request.respond(response);
    }
  }
  public route<T extends string>(
    path: T | RegExp,
    method: string,
    handler: RouteHandler<PathParams<T>>,
  ): void {
    this.router.add({ path, method, handler: handler as RouteHandler });
  }
}

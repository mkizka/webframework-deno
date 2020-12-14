import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.80.0/http/server.ts";
import { RouteHandler, Router } from "./router.ts";

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
      const response = handler(request);
      request.respond(response);
    }
  }
  public route(
    path: RegExp,
    method: string,
    handler: RouteHandler,
  ) {
    this.router.add({ path, method, handler });
  }
}

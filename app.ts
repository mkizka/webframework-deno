import {
  HTTPOptions,
  serve,
} from "https://deno.land/std@0.80.0/http/server.ts";
import { RouteCallback, Router } from "./router.ts";

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
      const [callback, params] = this.router.match(request.method, request.url);
      const response = callback(request);
      request.respond(response);
    }
  }
  public route(
    path: RegExp,
    method: string,
    callback: RouteCallback,
  ) {
    this.router.add({ path, method, callback });
  }
}

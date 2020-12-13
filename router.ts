import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type RouteCallback = (request: Request) => Response;

export type Route = {
  method: string;
  path: RegExp;
  callback: RouteCallback;
};

const http404: RouteCallback = (_) => new Response("", { status: 404 });

export class Router {
  private routes: Route[] = [];
  public add(route: Route): void {
    this.routes.push(route);
  }
  public match(
    method: string,
    path: string,
  ): [RouteCallback, { [key: string]: string }] {
    for (const route of this.routes) {
      const matched = path.match(route.path);
      if (matched && route.method == method) {
        return [route.callback, matched.groups || {}];
      }
    }
    return [http404, {}];
  }
}

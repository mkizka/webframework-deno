import { ServerRequest } from "https://deno.land/std@0.80.0/http/server.ts";

type RouteCallback = (request: ServerRequest) => void;
type Route = {
  method: string;
  path: RegExp;
  callback: RouteCallback;
};

const http404: RouteCallback = (request) => {
  request.respond({ status: 404, body: "HTTP 404" });
};

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

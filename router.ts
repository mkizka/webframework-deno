import escapeStringRegExp from "https://esm.sh/escape-string-regexp";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type RouteHandler = (request: Request) => Response;

export type Route = {
  method: string;
  path: RegExp;
  handler: RouteHandler;
};

const http404: RouteHandler = (_) => new Response("", { status: 404 });

export function pathToRegExp(path: string): RegExp {
  let escapedPath = escapeStringRegExp(path);
  const matchs = escapedPath.match(/<\w+>/g) || [];
  for (const matched of matchs) {
    escapedPath = escapedPath.replace(matched, `(?${matched}.+)`);
  }
  return new RegExp(`^${escapedPath}$`);
}

export class Router {
  private routes: Route[] = [];
  public add(route: Route): void {
    this.routes.push(route);
  }
  public match(
    method: string,
    path: string,
  ): [RouteHandler, { [key: string]: string }] {
    for (const route of this.routes) {
      const matched = path.match(route.path);
      if (matched && route.method == method) {
        return [route.handler, matched.groups || {}];
      }
    }
    return [http404, {}];
  }
}

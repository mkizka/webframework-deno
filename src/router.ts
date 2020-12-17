import escapeStringRegExp from "https://esm.sh/escape-string-regexp";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

type PathKey<PathItem extends string> = PathItem extends `\<${infer Key}\>`
  ? Key
  : never;

type PathKeys<PathString extends string> = PathString extends
  `${infer PathItem}/${infer Others}` ? PathKey<PathItem> | PathKeys<Others>
  : PathKey<PathString>;

export type PathParams<PathString extends string> = PathKeys<PathString> extends
  never ? { [key: string]: never }
  : { [key in PathKeys<PathString>]: string };

export type BasePathParams = { [key: string]: string };

export type RouteHandler<T extends BasePathParams = Record<string, string>> = (
  request: Request,
  params: T,
) => Response;

export type Route = {
  method: string;
  path: RegExp;
  handler: RouteHandler<BasePathParams>;
};

export const http404: RouteHandler = (_) => new Response("", { status: 404 });

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
  public match<T extends BasePathParams>(
    method: string,
    path: string,
  ): [RouteHandler<T>, Record<string, string>] {
    for (const route of this.routes) {
      const matched = path.match(route.path);
      if (matched && route.method == method) {
        return [route.handler, matched.groups || {}];
      }
    }
    return [http404, {}];
  }
}

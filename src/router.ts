import { escapeStringRegExp } from "../deps.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

type PathKey<PathItem extends string> = PathItem extends `\<${infer Key}\>`
  ? Key
  : never;

type PathKeys<PathString extends string> = PathString extends
  `${infer PathItem}/${infer Others}` ? PathKey<PathItem> | PathKeys<Others>
  : PathKey<PathString>;

export type PathParams<PathString extends string> = PathKeys<PathString> extends
  never ? BasePathParams
  : { [key in PathKeys<PathString>]: string };

export type BasePathParams = Record<string, string | undefined>;

export type RouteHandler<T extends BasePathParams = BasePathParams> = (
  request: Request,
  params: T,
) => Promise<Response>;

export type Route = {
  path: RegExp;
  method: string;
  handler: RouteHandler<BasePathParams>;
};

export const http404: RouteHandler = async (_) =>
  new Response("", { status: 404 });

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
  public add(route: { path: string | RegExp } & Omit<Route, "path">): void {
    const regExpPath = typeof route.path == "string"
      ? pathToRegExp(route.path)
      : route.path;
    this.routes.push({
      path: regExpPath,
      method: route.method,
      handler: route.handler,
    });
  }
  public match<T extends BasePathParams>(
    path: string,
    method: string,
  ): [RouteHandler<T>, BasePathParams] {
    for (const route of this.routes) {
      const matched = path.split("?")[0].match(route.path);
      if (matched && route.method == method) {
        return [route.handler, matched.groups || {}];
      }
    }
    return [http404, {}];
  }
}

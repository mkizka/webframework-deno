import { asserts } from "../deps.ts";
import { App } from "./app.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

Deno.test("App.route: URLハンドラの登録", async () => {
  const app = new App();
  app.route("/hoge", "GET", async () => new Response());
  const [handler, params] = app.router.match("/hoge", "GET");
  const response = await handler(new Request(), params);
  asserts.assertEquals(response.status, 200);
});

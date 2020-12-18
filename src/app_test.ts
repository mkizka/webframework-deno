import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { App } from "./app.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

Deno.test("App.route: URLハンドラの登録", () => {
  const app = new App();
  app.route("/hoge", "GET", () => new Response());
  const [handler, params] = app.router.match("/hoge", "GET");
  const response = handler(new Request(), params);
  assertEquals(response.status, 200);
});

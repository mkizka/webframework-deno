import { App } from "./app.ts";
import { JSONResponse, Response } from "./response.ts";

const app = new App();

app.route("/", "GET", (request, params) => {
  return new JSONResponse({ hoge: 1, fuga: "aあ" });
});

app.route("/<name>", "GET", (request, params) => {
  return new Response(params.name);
});

await app.serve({ hostname: "localhost", port: 8080 });

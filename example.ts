import { App, JSONResponse, Response } from "./mod.ts";

const app = new App();

app.route("/", "GET", (request, params) => {
  return new JSONResponse({ hoge: 1, fuga: "aあbc" });
});

app.route("/<hoge>/<fuga>", "GET", (request, params) => {
  return new JSONResponse(params);
});

app.serve({ hostname: "localhost", port: 8080 });

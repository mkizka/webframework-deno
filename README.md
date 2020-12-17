# webframework-deno
Deno で https://github.com/mkizka/webframework-sample を再実装する

## Usage
```ts
import { App, JSONResponse, Response } from "https://denopkg.com/mkizka/webframework-deno/mod.ts";

const app = new App();

app.route("/", "GET", (request, params) => {
  return new Response("Hello, World!");
});

app.route("/<hoge>/<fuga>", "GET", (request, params) => {
  return new JSONResponse(params);
});

app.serve({ hostname: "localhost", port: 8080 });
```

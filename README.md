# webframework-deno
Deno で https://github.com/mkizka/webframework-sample を再実装する

## Usage
```ts
import {
  App,
  JSONResponse,
  Response,
} from "https://denopkg.com/mkizka/webframework-deno/mod.ts";

const app = new App();

app.route("/", "GET", (request, params) => {
  return new JSONResponse({ hoge: 1, fuga: "aあbc" });
});

app.route("/<name>", "GET", (request, params) => {
  return new Response(params.name);
});

app.serve({ hostname: "localhost", port: 8080 });
```

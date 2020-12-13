import { App } from "./app.ts";

const app = new App();

app.route(/\/$/, "GET", (request) => {
  return { status: 200, body: "hoge" };
});

app.route(/\/fuga$/, "GET", (request) => {
  return { status: 200, body: "fuga" };
});

await app.serve({ hostname: "localhost", port: 8080 });

import { asserts } from "../deps.ts";
import { pathToRegExp, Router } from "./router.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

function matchPath(path: string, input: string): RegExpMatchArray | null {
  const regex = pathToRegExp(path);
  const matched = input.match(regex);
  return matched;
}

Deno.test("pathToRegExp: パス1段にマッチ", () => {
  const matched = matchPath("/<path1>", "/hoge");
  asserts.assertNotEquals(matched, undefined);
  asserts.assertNotEquals(matched?.groups, undefined);
  asserts.assertEquals(matched?.groups?.path1, "hoge");
});

Deno.test("pathToRegExp: パス2段にマッチ", () => {
  const matched = matchPath("/<path1>/<path2>", "/hoge/fuga");
  asserts.assertEquals(matched?.groups?.path1, "hoge");
  asserts.assertEquals(matched?.groups?.path2, "fuga");
});

Deno.test("pathToRegExp: マッチしない", () => {
  const matched = matchPath("/<path1>", "/");
  asserts.assertEquals(matched, null);
});

Deno.test("pathToRegExp: 正規表現の記号を含むパスのエスケープ", () => {
  const matched = matchPath("/<path1>*", "/hoge*");
  asserts.assertEquals(matched?.groups?.path1, "hoge");
});

Deno.test("Router.(add|match): 文字列でパスパラメータを指定してマッチ", () => {
  const router = new Router();
  router.add({
    path: "/hoge/<fuga>",
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/123", "GET");
  asserts.assertEquals(params.fuga, "123");
  const response = handler(new Request(), params);
  asserts.assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): 正規表現でパスパラメータを指定してマッチ", () => {
  const router = new Router();
  router.add({
    path: /\/hoge\/(?<fuga>.+)/,
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/123", "GET");
  asserts.assertEquals(params.fuga, "123");
  const response = handler(new Request(), params);
  asserts.assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): 静的なパスにマッチ", () => {
  const router = new Router();
  router.add({
    path: "/hoge/fuga",
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/fuga", "GET");
  asserts.assertEquals(params, {});
  const response = handler(new Request(), params);
  asserts.assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): クエリパラメータを含むパスにマッチ", () => {
  const router = new Router();
  router.add({
    path: "/hoge/fuga",
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/fuga?a=b", "GET");
  asserts.assertEquals(params, {});
  const response = handler(new Request(), params);
  asserts.assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): マッチしない場合は404が返ってくる", () => {
  const router = new Router();
  router.add({
    path: /\/hoge\/(?<fuga>.+)/,
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/fuga/123", "GET");
  asserts.assertEquals(params.fuga, undefined);
  const response = handler(new Request(), params);
  asserts.assertEquals(response.status, 404);
});

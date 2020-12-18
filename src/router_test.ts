import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.80.0/testing/asserts.ts";
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
  assertNotEquals(matched, undefined);
  assertNotEquals(matched?.groups, undefined);
  assertEquals(matched?.groups?.path1, "hoge");
});

Deno.test("pathToRegExp: パス2段にマッチ", () => {
  const matched = matchPath("/<path1>/<path2>", "/hoge/fuga");
  assertEquals(matched?.groups?.path1, "hoge");
  assertEquals(matched?.groups?.path2, "fuga");
});

Deno.test("pathToRegExp: マッチしない", () => {
  const matched = matchPath("/<path1>", "/");
  assertEquals(matched, null);
});

Deno.test("pathToRegExp: 正規表現の記号を含むパスのエスケープ", () => {
  const matched = matchPath("/<path1>*", "/hoge*");
  assertEquals(matched?.groups?.path1, "hoge");
});

Deno.test("Router.(add|match): 文字列でパスパラメータを指定してマッチ", () => {
  const router = new Router();
  router.add({
    path: "/hoge/<fuga>",
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/123", "GET");
  assertEquals(params.fuga, "123");
  const response = handler(new Request(), params);
  assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): 正規表現でパスパラメータを指定してマッチ", () => {
  const router = new Router();
  router.add({
    path: /\/hoge\/(?<fuga>.+)/,
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/123", "GET");
  assertEquals(params.fuga, "123");
  const response = handler(new Request(), params);
  assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): 静的なパスにマッチ", () => {
  const router = new Router();
  router.add({
    path: "/hoge/fuga",
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/hoge/fuga", "GET");
  assertEquals(params, {});
  const response = handler(new Request(), params);
  assertEquals(response.status, 200);
});

Deno.test("Router.(add|match): マッチしない場合は404が返ってくる", () => {
  const router = new Router();
  router.add({
    path: /\/hoge\/(?<fuga>.+)/,
    method: "GET",
    handler: () => new Response(),
  });
  const [handler, params] = router.match("/fuga/123", "GET");
  assertEquals(params.fuga, undefined);
  const response = handler(new Request(), params);
  assertEquals(response.status, 404);
});

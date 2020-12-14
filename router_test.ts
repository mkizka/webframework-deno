import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { pathToRegExp } from "./router.ts";

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

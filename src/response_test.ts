import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import { JSONResponse, Response } from "./response.ts";

Deno.test("Response: デフォルト値のチェック", () => {
  const response = new Response();
  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "text/plain;charset=utf-8",
  );
  assertEquals(response.body, "");
});

Deno.test("JSONResponse: JSONを文字列に変換してbodyへ", () => {
  const response = new JSONResponse({ hoge: 1, fuga: "foo", bar: true });
  assertEquals(response.body, '{"hoge":1,"fuga":"foo","bar":true}');
});

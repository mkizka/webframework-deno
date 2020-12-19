import { asserts } from "../deps.ts";
import { JSONResponse, Response } from "./response.ts";

Deno.test("Response: デフォルト値のチェック", () => {
  const response = new Response();
  asserts.assertEquals(response.status, 200);
  asserts.assertEquals(
    response.headers.get("Content-Type"),
    "text/plain;charset=utf-8",
  );
  asserts.assertEquals(response.body, "");
});

Deno.test("JSONResponse: JSONを文字列に変換してbodyへ", () => {
  const response = new JSONResponse({ hoge: 1, fuga: "foo", bar: true });
  asserts.assertEquals(response.body, '{"hoge":1,"fuga":"foo","bar":true}');
});

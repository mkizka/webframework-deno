import { Response as BaseResponse } from "https://deno.land/std@0.80.0/http/server.ts";

export class Response implements BaseResponse {
  constructor(
    public body: string,
    public status?: number,
    public headers?: Headers,
    public trailers?: BaseResponse["trailers"],
  ) {
  }
}

export class JSONResponse extends Response {
  constructor(
    json: { [key: string]: any },
    status?: number,
    headers?: Headers,
    trailers?: BaseResponse["trailers"],
  ) {
    super(JSON.stringify(json), status, headers, trailers);
  }
}

import { Response as BaseResponse } from "https://deno.land/std@0.80.0/http/server.ts";

type Body = Exclude<BaseResponse["body"], undefined>;

export type ResponseParameter = Omit<BaseResponse, "body">;

export class Response implements BaseResponse {
  public body: Body = "";
  public status = 200;
  public headers: Headers = new Headers();
  public trailers?: BaseResponse["trailers"];
  public charset = "utf-8";
  public contentType = `text/plain`;

  constructor(body: Body, parameter?: ResponseParameter) {
    this.body = body || this.body;
    this.status = parameter?.status || this.status;
    this.headers = parameter?.headers || this.headers;
    if (!this.headers.get("Content-Type")) {
      this.headers.append("Content-Type", this.getContentType());
    }
    this.trailers = parameter?.trailers || this.trailers;
  }

  public getContentType(): string {
    return `${this.contentType};charset=${this.charset}`;
  }
}

export class JSONResponse extends Response {
  constructor(json: { [key: string]: unknown }, parameter?: ResponseParameter) {
    super(JSON.stringify(json), parameter);
  }
}

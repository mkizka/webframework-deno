import { server } from "../deps.ts";

export class Request {
  constructor(
    public readonly original: server.ServerRequest = new server.ServerRequest(),
  ) {}
  public get url() {
    return this.original.url;
  }
  public get method() {
    return this.original.method;
  }
  public get query(): URLSearchParams {
    const [_, searchParams] = this.url.split("?");
    return new URLSearchParams(searchParams);
  }
  public async text() {
    const buffer = new Deno.Buffer();
    await Deno.copy(this.original.body, buffer);
    return new TextDecoder().decode(buffer.bytes());
  }
  public async json() {
    const text = await this.text();
    return JSON.parse(text);
  }
}

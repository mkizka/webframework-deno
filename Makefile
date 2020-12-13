example:
	deno run --allow-net example.ts
fmt:
	ls -1 ./*.ts | xargs -I{} deno fmt {}

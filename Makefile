example:
	deno run --allow-net example.ts
test:
	deno test --unstable --coverage
lint:
	deno fmt && deno lint --unstable

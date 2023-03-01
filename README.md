# Pog-Casino

This contains code used for the frontend. `static/` contains all code that is
literally served on the site.

There are no complicated build steps, everything is served as-is. We use Rust
for WASM, which of course is compiled.

There is no clear separation between front & backend here, the clearest
separation are the flatbuffers files, which define the communcation protocol.

## Serving

Simply serve the content in `static/` you can do this with any tool you like.
For development I like `pnpm --package=@web/dev-server dlx wds -w` per
https://modern-web.dev/guides/dev-server/getting-started/

import base64, gzip, json, pathlib, sys

def emit(prefix, data):
    encoded = base64.b64encode(data).decode()
    for start in range(0, len(encoded), 3000):
        print(prefix + " " + encoded[start:start+3000])

if sys.argv[1] == "source":
    files = {}
    for root in ["app", "tests", "docs", ".github"]:
        for path in pathlib.Path(root).rglob("*"):
            if path.is_file():
                files[str(path)] = path.read_text()
    for name in ["package.json", "package-lock.json", "playwright.config.ts", "tsconfig.json", "eslint.config.mjs", ".node-version", ".gitignore", "README.md"]:
        files[name] = pathlib.Path(name).read_text()
    emit("PORT_SOURCE_CHUNK", gzip.compress(json.dumps(files).encode()))
else:
    for path in pathlib.Path("test-results").rglob("*.png"):
        emit("PORT_IMAGE_" + path.name, path.read_bytes())
    for path in pathlib.Path("test-results").rglob("*.webm"):
        emit("PORT_VIDEO_intro.webm", path.read_bytes())

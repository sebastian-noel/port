import base64
import gzip
import json
from pathlib import Path
import sys

if sys.argv[1] == "source":
    paths = list(Path("app").rglob("*")) + list(Path("tests").rglob("*")) + list(Path("docs").rglob("*")) + list(Path(".github").rglob("*"))
    paths += [Path("package.json"), Path("package-lock.json"), Path("playwright.config.ts")]
    data = json.dumps({str(path): path.read_text() for path in paths if path.is_file()}).encode()
    encoded = base64.b64encode(gzip.compress(data)).decode()
    for offset in range(0, len(encoded), 3000):
        print("PORT_SOURCE_CHUNK " + encoded[offset:offset + 3000])
else:
    for path in Path("test-results").rglob("*.png"):
        encoded = base64.b64encode(path.read_bytes()).decode()
        for offset in range(0, len(encoded), 3000):
            print("PORT_IMAGE_" + path.stem + " " + encoded[offset:offset + 3000])

from pathlib import Path
import argparse
import hashlib
import json
import zipfile

repo = Path(__file__).resolve().parents[1]
skill = repo / ".agents/skills/rhine-eidolon-preserve"
parser = argparse.ArgumentParser()
parser.add_argument("--output", type=Path, default=repo / "dist")
args = parser.parse_args()
output = args.output.resolve()
output.mkdir(parents=True, exist_ok=True)
ignored = {".git", "node_modules", "work", "dist", "__pycache__", ".next", "out", ".cache", ".vite", "test-results", "playwright-report"}

def inputs(root):
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(root)
        if any(part in ignored for part in relative.parts):
            continue
        if root in output.parents and (output == path or output in path.parents):
            continue
        if path.parent == output and path.name in {"rhine-eidolon-preserve.skill", "project-archive-integration.zip", "SHA256SUMS"}:
            continue
        if path.name.startswith(".env") and path.name != ".env.example":
            continue
        yield path

def create(target, root, prefix):
    count = 0
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in inputs(root):
            archive.write(path, prefix + path.relative_to(root).as_posix())
            count += 1
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
    return {"file": target.name, "files": count, "bytes": target.stat().st_size, "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}

artifacts = [
    create(output / "rhine-eidolon-preserve.skill", skill, skill.name + "/"),
    create(output / "project-archive-integration.zip", repo, "project-archive/"),
]
(output / "SHA256SUMS").write_text("".join(item["sha256"] + "  " + item["file"] + "\n" for item in artifacts), encoding="utf-8")
print(json.dumps({"status": "packaged", "artifacts": artifacts}, ensure_ascii=False, indent=2))

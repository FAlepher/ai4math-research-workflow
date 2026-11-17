"""Synthetic example, using a simple independently checkable identity."""
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from workflow import Task


def main():
    task = Task("For integers, is adding zero neutral?")
    print("Coordinator: assign a synthetic question to research")
    task.submit("For every integer n, n + 0 = n.")
    task.review(True, "Accepted for illustration; general validity needs a proof.")
    task.explain("Adding zero leaves an integer unchanged.")
    task.record("V", "Separate an audit decision from explicit evidence.")
    task.confirm("Simulated confirmation: identity follows from the definition of addition.")
    with TemporaryDirectory() as folder:
        path = Path(folder) / "vwl.json"
        task.save(path)
        print(json.dumps(json.loads(path.read_text(encoding="utf-8")), indent=2))


if __name__ == "__main__":
    main()

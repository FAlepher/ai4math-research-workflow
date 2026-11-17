import json
import tempfile
import unittest
from pathlib import Path
from workflow import Status, Task


class WorkflowTests(unittest.TestCase):
    def test_audit_does_not_confirm(self):
        t = Task("question")
        t.submit("claim")
        t.review(True, "review")
        self.assertEqual(t.status, Status.AUDITED)
        self.assertEqual(t.records, [])
        with self.assertRaises(ValueError):
            t.confirm(" ")
        t.confirm("human checked source")
        self.assertEqual(t.records[0]["kind"], "W")

    def test_failed_review_cannot_be_confirmed(self):
        t = Task("question")
        t.submit("claim")
        t.review(False, "counterexample")
        t.record("L", "counterexample and scope")
        with self.assertRaises(ValueError):
            t.confirm("evidence")
        self.assertEqual(t.status, Status.FAILED)
        self.assertEqual(t.records[0]["kind"], "L")

    def test_save_round_trip_and_direct_w_forbidden(self):
        t = Task("question")
        with self.assertRaises(ValueError):
            t.record("W", "unverified")
        t.record("V", "perspective")
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "record.json"
            t.save(p)
            self.assertEqual(json.loads(p.read_text(encoding="utf-8"))["records"][0]["kind"], "V")


if __name__ == "__main__":
    unittest.main()

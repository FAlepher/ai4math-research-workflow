"""A synthetic local workflow; no model, browser or proof checker is involved."""
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path


class Status(str, Enum):
    CREATED = "created"
    RESEARCHED = "researched"
    AUDITED = "audited"
    CONFIRMED = "confirmed"
    FAILED = "failed"


@dataclass
class Task:
    question: str
    status: Status = Status.CREATED
    proposal: str = ""
    audit: str = ""
    explanation: str = ""
    records: list = field(default_factory=list)

    def submit(self, proposal: str):
        if self.status != Status.CREATED or not proposal.strip():
            raise ValueError("A new task needs a nonempty proposal")
        self.proposal = proposal
        self.status = Status.RESEARCHED

    def review(self, accepted: bool, note: str):
        if self.status != Status.RESEARCHED or not note.strip():
            raise ValueError("Review requires a proposal and a note")
        self.audit = note
        self.status = Status.AUDITED if accepted else Status.FAILED

    def explain(self, text: str):
        if self.status not in (Status.AUDITED, Status.FAILED) or not text.strip():
            raise ValueError("Explanation requires a reviewed task")
        self.explanation = text

    def confirm(self, evidence: str):
        if self.status != Status.AUDITED or not evidence.strip():
            raise ValueError("Explicit evidence is required after an accepted review")
        self.status = Status.CONFIRMED
        self.records.append({"kind": "W", "text": self.proposal, "evidence": evidence})

    def record(self, kind: str, text: str):
        if kind not in ("V", "L") or not text.strip():
            raise ValueError("Only nonempty V or L records can be added directly")
        self.records.append({"kind": kind, "text": text})

    def save(self, path):
        data = {"question": self.question, "status": self.status.value,
                "proposal": self.proposal, "audit": self.audit,
                "explanation": self.explanation, "records": self.records}
        Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

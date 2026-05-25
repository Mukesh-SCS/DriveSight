"""Import question JSON into Supabase-ready SQL."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

STATE_NAMES: dict[str, str] = {
    "AK": "Alaska",
    "AL": "Alabama",
    "CA": "California",
}


def escape_sql(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python scripts/import-questions.py <json-file> [source-id]")
        sys.exit(1)

    json_path = ROOT / sys.argv[1]
    source = sys.argv[2] if len(sys.argv) > 2 else "drivesight-import"

    questions = json.loads(json_path.read_text(encoding="utf-8"))
    if not questions:
        print("No questions found.")
        sys.exit(1)

    state_code = questions[0]["state_code"].upper()
    state_name = (
        sys.argv[3]
        if len(sys.argv) > 3
        else STATE_NAMES.get(state_code, state_code)
    )
    out_path = json_path.with_suffix(".sql")

    rows: list[str] = []
    for question in questions:
        choices_json = json.dumps(question["choices"]).replace("'", "''")
        prompt = escape_sql(question["prompt"])
        explanation = escape_sql(question["explanation"])
        category = escape_sql(question.get("category", ""))
        difficulty = question.get("difficulty", "medium")
        answer_index = int(question["answer_index"])

        rows.append(
            "  ("
            f"'{state_code}', '{prompt}', '{choices_json}'::jsonb, {answer_index}, "
            f"'{explanation}', '{category}', '{difficulty}', '{source}', true)"
        )

    sql = "\n".join(
        [
            f"-- {state_code} questions from {json_path.name}",
            f"delete from public.driving_test_questions where state_code = '{state_code}' and source = '{source}';",
            "insert into public.driving_test_questions (state_code, prompt, choices, answer_index, explanation, category, difficulty, source, is_active)",
            "values",
            ",\n".join(rows) + ";",
            f"insert into public.state_driving_tests (state_code, state_name, question_count)",
            f"values ('{state_code}', '{escape_sql(state_name)}', {len(questions)})",
            "on conflict (state_code) do update set",
            f"  question_count = excluded.question_count,",
            "  updated_at = now();",
        ]
    )

    out_path.write_text(sql, encoding="utf-8")
    print(f"Wrote {len(questions)} questions to {out_path}")


if __name__ == "__main__":
    main()

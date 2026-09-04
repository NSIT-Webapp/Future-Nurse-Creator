import json, os, sys

def validate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "src", "data")

    # 1. Parse all required files
    files = ["paths.json", "questions.json", "scoring.json", "profiles.json"]
    data = {}
    for fname in files:
        path = os.path.join(data_dir, fname)
        if not os.path.exists(path):
            print(f"❌ Missing: {fname}"); sys.exit(1)
        with open(path, "r", encoding="utf-8") as f:
            try:
                data[fname] = json.load(f)
                print(f"✓ {fname} — valid JSON")
            except Exception as e:
                print(f"❌ {fname}: {e}"); sys.exit(1)

    paths_data    = data["paths.json"]
    questions_data = data["questions.json"]
    scoring_data  = data["scoring.json"]
    profiles_data = data["profiles.json"]

    PATH_IDS = paths_data["pathOrder"]
    FAMILIES = ["HUMAN_CONNECTION", "CLINICAL_AWARENESS", "FUTURE_COLLABORATION"]
    TRAITS   = ["EMP", "OBS", "ACT", "COM", "COL", "INN"]
    QUESTIONS = ["q1", "q2", "q3", "q4", "q5"]
    OPTIONS  = ["A", "B", "C", "D", "E", "F"]

    # 2. Paths
    assert len(PATH_IDS) == 8, "Need exactly 8 paths"
    print("✓ 8 Nursing Paths defined")

    # 3. Questions: 5 × 6 options
    qs = questions_data["questions"]
    assert len(qs) == 5, f"Need 5 questions, got {len(qs)}"
    for q in qs:
        assert len(q["options"]) == 6, f"Question {q['id']} needs 6 options"
    print("✓ 5 questions × 6 options each")

    # 4. Path scoring matrix: 5 × 6 × 8
    ps = scoring_data["pathScoring"]
    for qid in QUESTIONS:
        assert qid in ps, f"pathScoring missing {qid}"
        for opt in OPTIONS:
            assert opt in ps[qid], f"pathScoring[{qid}] missing option {opt}"
            for pid in PATH_IDS:
                assert pid in ps[qid][opt], f"pathScoring[{qid}][{opt}] missing {pid}"
    print("✓ pathScoring matrix complete (5 × 6 × 8)")

    # 5. Trait scoring matrix: 5 × 6 × 6 traits
    ts = scoring_data["traitScoring"]
    for qid in QUESTIONS:
        assert qid in ts, f"traitScoring missing {qid}"
        for opt in OPTIONS:
            assert opt in ts[qid], f"traitScoring[{qid}] missing option {opt}"
            for t in TRAITS:
                assert t in ts[qid][opt], f"traitScoring[{qid}][{opt}] missing trait {t}"
    print("✓ traitScoring matrix complete (5 × 6 × 6 traits)")

    # 6. Tie-breaker orders
    assert "pathTieBreaker" in scoring_data
    assert "strengthTieBreaker" in scoring_data
    print("✓ Tie-breaker orders defined")

    # 7. Profiles: 24 entries (8 × 3), each with superpower/aiSkill/impact
    for pid in PATH_IDS:
        assert pid in profiles_data, f"profiles.json missing path {pid}"
        for fam in FAMILIES:
            assert fam in profiles_data[pid], f"profiles[{pid}] missing family {fam}"
            entry = profiles_data[pid][fam]
            for key in ["superpower", "aiSkill", "impact"]:
                assert key in entry, f"profiles[{pid}][{fam}] missing '{key}'"
                assert len(entry[key]) > 0, f"profiles[{pid}][{fam}][{key}] is empty"
    print("✓ 24/24 result profiles complete (8 paths × 3 families)")

    # 8. Character assets rule: MAT must have a maleAssetFallback
    mat = paths_data["paths"]["MAT"]
    assert mat.get("maleAssetFallback") is not None, "MAT must have maleAssetFallback"
    print("✓ MAT male character fallback rule defined")

    print("\n🎉 ALL DATA INTEGRITY CHECKS PASSED!")

if __name__ == "__main__":
    validate()

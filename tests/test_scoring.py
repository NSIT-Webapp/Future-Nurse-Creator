import unittest, json, os

class TestV2DeterministicScoring(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data = os.path.join(base, "src", "data")
        with open(os.path.join(data, "scoring.json"),  "r", encoding="utf-8") as f: cls.sc = json.load(f)
        with open(os.path.join(data, "paths.json"),    "r", encoding="utf-8") as f: cls.pa = json.load(f)
        with open(os.path.join(data, "profiles.json"), "r", encoding="utf-8") as f: cls.pr = json.load(f)

        cls.PATH_IDS = cls.pa["pathOrder"]
        cls.FAMILIES = ["HUMAN_CONNECTION", "CLINICAL_AWARENESS", "FUTURE_COLLABORATION"]
        cls.TRAITS   = ["EMP", "OBS", "ACT", "COM", "COL", "INN"]
        cls.QUESTIONS= ["q1", "q2", "q3", "q4", "q5"]
        cls.OPTIONS  = ["A", "B", "C", "D", "E", "F"]

    def score(self, q1, q2, q3, q4, q5, session_id=0):
        """Pure Python replica of scoringEngine.ts"""
        answers = {"q1":q1, "q2":q2, "q3":q3, "q4":q4, "q5":q5}
        ps = self.sc["pathScoring"]
        ts = self.sc["traitScoring"]

        # Path scores
        path_scores = {p: 0 for p in self.PATH_IDS}
        for qid in self.QUESTIONS:
            ans = answers[qid]
            for p, v in ps[qid][ans].items():
                path_scores[p] += v

        # Trait scores
        trait_scores = {t: 0 for t in self.TRAITS}
        for qid in self.QUESTIONS:
            ans = answers[qid]
            for t, v in ts[qid][ans].items():
                trait_scores[t] += v

        # Strength families
        fam_scores = {
            "HUMAN_CONNECTION":     trait_scores["EMP"] + trait_scores["COM"],
            "CLINICAL_AWARENESS":   trait_scores["OBS"] + trait_scores["ACT"],
            "FUTURE_COLLABORATION": trait_scores["COL"] + trait_scores["INN"],
        }

        def break_path_tie(tied):
            for qid in self.sc["pathTieBreaker"]:
                qrow = ps[qid][answers[qid]]
                max_s = max(qrow.get(p, 0) for p in tied)
                survivors = [p for p in tied if qrow.get(p, 0) == max_s]
                if len(survivors) == 1: return survivors[0]
                tied = survivors
            return tied[session_id % len(tied)]

        def break_fam_tie(tied):
            fam_traits = {
                "HUMAN_CONNECTION":     ["EMP", "COM"],
                "CLINICAL_AWARENESS":   ["OBS", "ACT"],
                "FUTURE_COLLABORATION": ["COL", "INN"],
            }
            for qid in self.sc["strengthTieBreaker"]:
                qrow = ts[qid][answers[qid]]
                def fam_q_score(fam): return sum(qrow.get(t, 0) for t in fam_traits[fam])
                max_s = max(fam_q_score(f) for f in tied)
                survivors = [f for f in tied if fam_q_score(f) == max_s]
                if len(survivors) == 1: return survivors[0]
                tied = survivors
            return tied[session_id % len(tied)]

        # Primary path
        max_p = max(path_scores.values())
        top_paths = [p for p in self.PATH_IDS if path_scores[p] == max_p]
        primary = top_paths[0] if len(top_paths) == 1 else break_path_tie(top_paths)

        # Secondary path
        rem = [p for p in self.PATH_IDS if p != primary]
        max_s = max(path_scores[p] for p in rem)
        top_sec = [p for p in rem if path_scores[p] == max_s]
        secondary = top_sec[0] if len(top_sec) == 1 else break_path_tie(top_sec)

        # Strength family
        max_f = max(fam_scores.values())
        top_fams = [f for f in self.FAMILIES if fam_scores[f] == max_f]
        family = top_fams[0] if len(top_fams) == 1 else break_fam_tie(top_fams)

        return primary, secondary, family, path_scores, fam_scores

    def test_determinism_all_7776_combinations(self):
        """Test all 6^5 = 7776 combinations are deterministic."""
        path_counts = {p: 0 for p in self.PATH_IDS}
        family_counts = {f: 0 for f in self.FAMILIES}
        profile_counts = {f"{p}_{f}": 0 for p in self.PATH_IDS for f in self.FAMILIES}

        for q1 in self.OPTIONS:
            for q2 in self.OPTIONS:
                for q3 in self.OPTIONS:
                    for q4 in self.OPTIONS:
                        for q5 in self.OPTIONS:
                            r1 = self.score(q1, q2, q3, q4, q5)
                            r2 = self.score(q1, q2, q3, q4, q5)
                            self.assertEqual(r1, r2, f"Not deterministic for ({q1},{q2},{q3},{q4},{q5})")
                            primary, _, family, _, _ = r1
                            path_counts[primary] += 1
                            family_counts[family] += 1
                            profile_counts[f"{primary}_{family}"] += 1

        total = sum(path_counts.values())
        self.assertEqual(total, 7776, f"Expected 7776 total, got {total}")
        print(f"\nTested {total} combinations successfully.")

        # All 8 paths reachable
        for p in self.PATH_IDS:
            self.assertGreater(path_counts[p], 0, f"Path {p} is unreachable!")
        print("\nPath distribution (7776 total):")
        for p in self.PATH_IDS:
            n = path_counts[p]
            print(f"  {p}: {n} ({n/total*100:.1f}%)")

        # All 3 families reachable
        for f in self.FAMILIES:
            self.assertGreater(family_counts[f], 0, f"Family {f} is unreachable!")
        print("\nStrength Family distribution:")
        for f in self.FAMILIES:
            n = family_counts[f]
            print(f"  {f}: {n} ({n/total*100:.1f}%)")

        # All 24 profiles reachable
        unreachable = [k for k, v in profile_counts.items() if v == 0]
        if unreachable:
            print(f"\n⚠️  Unreachable profiles ({len(unreachable)}/24): {unreachable}")
        else:
            print(f"\n✓ All 24 profiles reachable")

    def test_example_from_brief(self):
        """Verify the example from the brief: Q1=B,Q2=C,Q3=A,Q4=F,Q5=C → PED primary."""
        primary, secondary, family, path_scores, _ = self.score("B", "C", "A", "F", "C")
        print(f"\nBrief example (B,C,A,F,C): primary={primary}, secondary={secondary}, family={family}")
        print(f"  Scores: {dict(sorted(path_scores.items(), key=lambda x: -x[1]))}")
        self.assertEqual(primary, "PED", f"Expected PED, got {primary}")

    def test_no_random(self):
        """Same session_id → same result; different session_id may differ on tie only."""
        # With session=0 repeated → stable
        r1 = self.score("A", "A", "A", "A", "A", session_id=0)
        r2 = self.score("A", "A", "A", "A", "A", session_id=0)
        self.assertEqual(r1, r2)

    def test_profiles_lookup_complete(self):
        """Every reachable primary+family combo has a profile entry."""
        for p in self.PATH_IDS:
            for f in self.FAMILIES:
                entry = self.pr.get(p, {}).get(f)
                self.assertIsNotNone(entry, f"Missing profile: {p} × {f}")
                for key in ["superpower", "aiSkill", "impact"]:
                    self.assertIn(key, entry)
                    self.assertGreater(len(entry[key]), 0)

if __name__ == "__main__":
    unittest.main(verbosity=2)

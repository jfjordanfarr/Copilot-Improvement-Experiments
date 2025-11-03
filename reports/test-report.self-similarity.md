# Test Report

- **Generated:** 2025-11-03T19:28:39.227Z
- **Git commit:** f263a97cc32a0f491243bb0c3fb9cb0f8ecb28f3
- **Git branch:** main
- **Benchmark mode:** self-similarity

## Benchmarks

### AST Accuracy

- **Mode:** self-similarity
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |


### Rebuild Stability

- **Mode:** self-similarity
- **Workspace:** simple-workspace
- **Iterations:** 3
- **Durations:** 816 ms, 795 ms, 808 ms
- **Average duration:** 806.33 ms
- **Max duration:** 816.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-03T19:27:49.442Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-03T19:27:51.873Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

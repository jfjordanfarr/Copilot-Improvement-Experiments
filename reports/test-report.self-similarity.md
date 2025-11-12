# Test Report

- **Generated:** 2025-11-12T18:00:34.550Z
- **Git commit:** 1da1b96e84bba2966469378ae13751817e7f7435
- **Git branch:** main
- **Benchmark mode:** self-similarity

## Benchmarks

### AST Accuracy

- **Mode:** self-similarity
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 4 | 0 | 0 | 100.0% | 100.0% | 100.0% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 4 | 0 | 0 | 100.0% | 100.0% | 100.0% |


### Rebuild Stability

- **Mode:** self-similarity
- **Workspace:** simple-workspace
- **Iterations:** 3
- **Durations:** 998 ms, 958 ms, 956 ms
- **Average duration:** 970.67 ms
- **Max duration:** 998.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-12T17:58:44.655Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-12T17:58:47.579Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

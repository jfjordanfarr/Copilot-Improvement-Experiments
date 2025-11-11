# Test Report

- **Generated:** 2025-11-11T05:22:43.249Z
- **Git commit:** 86a74a76bab1428835c8f38052bb3da9173c66fa
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
- **Durations:** 8004 ms, 7227 ms, 3652 ms
- **Average duration:** 6294.33 ms
- **Max duration:** 8004.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.19.0
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-11T05:22:35.603Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-11T05:22:35.534Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

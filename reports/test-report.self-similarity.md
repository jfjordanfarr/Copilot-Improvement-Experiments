# Test Report

- **Generated:** 2025-11-10T03:10:34.639Z
- **Git commit:** 6ab73ac99e7b5889976bbda5fd422a291fe6378c
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
- **Durations:** 11807 ms, 6905 ms, 3984 ms
- **Average duration:** 7565.33 ms
- **Max duration:** 11807.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.19.0
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-10T03:10:29.155Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-10T03:10:28.907Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

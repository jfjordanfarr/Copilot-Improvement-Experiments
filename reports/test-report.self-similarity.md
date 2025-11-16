# Test Report

- **Generated:** 2025-11-16T00:12:03.694Z
- **Git commit:** 6086294abf26741dcea048f2b0793242192a1897
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
- **Durations:** 1988 ms, 1801 ms, 1797 ms
- **Average duration:** 1862.00 ms
- **Max duration:** 1988.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.20.0
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-16T00:12:00.584Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-16T00:12:00.562Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

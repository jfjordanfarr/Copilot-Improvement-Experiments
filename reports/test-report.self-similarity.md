# Test Report

- **Generated:** 2025-11-14T00:28:13.000Z
- **Git commit:** b2b8f7590d928fd356a0df008de17d3e6bfc51e3
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
- **Durations:** 934 ms, 916 ms, 927 ms
- **Average duration:** 925.67 ms
- **Max duration:** 934.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-14T00:25:58.990Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-14T00:26:01.780Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

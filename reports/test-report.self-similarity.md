# Test Report

- **Generated:** 2025-11-16T23:28:31.685Z
- **Git commit:** a3069ebe20532529ce33889413e9e0f4bffdefa4
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
- **Durations:** 2215 ms, 2060 ms, 1933 ms
- **Average duration:** 2069.33 ms
- **Max duration:** 2215.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **ollamaModel:** qwen3-coder:30b
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-16T23:24:44.655Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-16T23:24:50.890Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

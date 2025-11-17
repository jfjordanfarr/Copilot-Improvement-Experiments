# Test Report

- **Generated:** 2025-11-17T21:17:18.248Z
- **Git commit:** 7c1729ea5dc8f9c6bd6791e264b9dd3efa6a4fb6
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
- **Durations:** 6162 ms, 7512 ms, 7257 ms
- **Average duration:** 6977.00 ms
- **Max duration:** 7512.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.20.0
- **ollamaModel:** qwen3-coder:30b
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy [mode: self-similarity] — recorded 2025-11-17T21:17:10.311Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.self-similarity.json)
- rebuild-stability [mode: self-similarity] — recorded 2025-11-17T21:17:10.226Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.self-similarity.json)

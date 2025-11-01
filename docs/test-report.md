# Test Report

- **Generated:** 2025-11-01T04:49:51.776Z
- **Git commit:** 6473d51c4c577892c7d5a281128881e342d36e52
- **Git branch:** main
- **Benchmark mode:** ast

## Benchmarks

### AST Accuracy

- **Mode:** ast
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 8 | 4 | 4 | 66.7% | 66.7% | 66.7% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| C translation unit with header inclusion | c | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Python module imports and validation | python | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Rust crate with helper modules | rust | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |


### Rebuild Stability

- **Mode:** ast
- **Workspace:** simple-workspace
- **Iterations:** 3
- **Durations:** 1232 ms, 1180 ms, 1222 ms
- **Average duration:** 1211.33 ms
- **Max duration:** 1232.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.19.0
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy — recorded 2025-11-01T04:49:50.545Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.json)
- rebuild-stability — recorded 2025-11-01T04:49:50.536Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.json)

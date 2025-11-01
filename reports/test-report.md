# Test Report

- **Generated:** 2025-11-01T21:29:58.110Z
- **Git commit:** fdc22a98759b304e564788632fa861959c057410
- **Git branch:** main

## Benchmarks

### AST Accuracy

- **Mode:** ast
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 115 | 12 | 12 | 90.6% | 90.6% | 90.6% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| TypeScript layered reporting service | typescript | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |
| Ky HTTP client snapshot | typescript | 56 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| C translation unit with header inclusion | c | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| C pipeline spanning multiple headers | c | 8 | 1 | 1 | 88.9% | 88.9% | 88.9% |
| Python module imports and validation | python | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Python reporting pipeline with validators | python | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |
| Rust crate with helper modules | rust | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Rust analytics crate with IO and metrics | rust | 5 | 1 | 1 | 83.3% | 83.3% | 83.3% |
| Java reporting application | java | 5 | 1 | 1 | 83.3% | 83.3% | 83.3% |
| Java analytics service with layered modules | java | 11 | 1 | 1 | 91.7% | 91.7% | 91.7% |
| Ruby module graph for summary reporting | ruby | 4 | 1 | 1 | 80.0% | 80.0% | 80.0% |
| Ruby CLI with layered services | ruby | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |


### Rebuild Stability

- **Mode:** self-similarity
- **Workspace:** simple-workspace
- **Iterations:** 3
- **Durations:** 1296 ms, 1181 ms, 1198 ms
- **Average duration:** 1225.00 ms
- **Max duration:** 1296.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0, v22.19.0
- **platform:** win32
- **providerMode:** local-only

## Benchmark Artifacts

- ast-accuracy — recorded 2025-11-01T21:29:50.807Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.json)
- rebuild-stability — recorded 2025-11-01T18:13:51.291Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.json)

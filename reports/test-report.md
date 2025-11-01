# Test Report

- **Generated:** 2025-11-01T17:48:35.026Z
- **Git commit:** a8537930f601cbc2ba161005a35dca2a05496107
- **Git branch:** main

## Benchmarks

### AST Accuracy

- **Mode:** ast
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 59 | 12 | 12 | 83.1% | 83.1% | 83.1% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| TypeScript layered reporting service | typescript | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |
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
- **Durations:** 661 ms, 642 ms, 645 ms
- **Average duration:** 649.33 ms
- **Max duration:** 661.00 ms
- **Drift detected:** No

## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy — recorded 2025-11-01T17:14:31.896Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.json)
- rebuild-stability — recorded 2025-11-01T17:14:43.309Z (AI-Agent-Workspace\tmp\benchmarks\rebuild-stability.json)

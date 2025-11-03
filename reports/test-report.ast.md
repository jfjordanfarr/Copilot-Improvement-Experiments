# Test Report

- **Generated:** 2025-11-03T16:37:06.385Z
- **Git commit:** f263a97cc32a0f491243bb0c3fb9cb0f8ecb28f3
- **Git branch:** main
- **Benchmark mode:** ast

## Benchmarks

### AST Accuracy

- **Mode:** ast
- **Thresholds:** precision 60.0%, recall 60.0%
- **Totals:**

| TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - |
| 205 | 12 | 12 | 94.5% | 94.5% | 94.5% |

- **Fixtures:**

| Fixture | Language | TP | FP | FN | Precision | Recall | F1 |
| - | - | - | - | - | - | - | - |
| TypeScript module graph smoke sample | typescript | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| TypeScript layered reporting service | typescript | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |
| Ky HTTP client repository | typescript | 56 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| C translation unit with header inclusion | c | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| C pipeline spanning multiple headers | c | 8 | 1 | 1 | 88.9% | 88.9% | 88.9% |
| libuv repository | c | 22 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| Python module imports and validation | python | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Python reporting pipeline with validators | python | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |
| Requests HTTP client repository | python | 55 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| Rust logging facade (rust-lang/log) | rust | 13 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| Rust crate with helper modules | rust | 2 | 1 | 1 | 66.7% | 66.7% | 66.7% |
| Rust analytics crate with IO and metrics | rust | 5 | 1 | 1 | 83.3% | 83.3% | 83.3% |
| Java reporting application | java | 5 | 1 | 1 | 83.3% | 83.3% | 83.3% |
| Java analytics service with layered modules | java | 11 | 1 | 1 | 91.7% | 91.7% | 91.7% |
| Ruby module graph for summary reporting | ruby | 4 | 1 | 1 | 80.0% | 80.0% | 80.0% |
| Ruby CLI with layered services | ruby | 6 | 1 | 1 | 85.7% | 85.7% | 85.7% |


## Environment Summary

- **arch:** x64
- **nodeVersion:** v22.14.0
- **platform:** win32

## Benchmark Artifacts

- ast-accuracy [mode: ast] — recorded 2025-11-03T16:34:53.219Z (AI-Agent-Workspace\tmp\benchmarks\ast-accuracy.ast.json)

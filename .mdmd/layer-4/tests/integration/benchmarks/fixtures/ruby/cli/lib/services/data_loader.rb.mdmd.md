# tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb

## Metadata
- Layer: 4
- Archetype: asset
- Code Path: tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb
- Live Doc ID: LD-asset-tests-integration-benchmarks-fixtures-ruby-cli-lib-services-data-loader-rb
- Generated At: 2025-11-19T15:01:36.270Z

## Authored
### Purpose
_Pending authored purpose_

### Notes
_Pending notes_

## Generated
<!-- LIVE-DOC:PROVENANCE {"generators":[{"tool":"live-docs-generator","version":"0.1.0","generatedAt":"2025-11-19T15:01:36.270Z","inputHash":"46ad72ebdfea4d16"}]} -->
<!-- LIVE-DOC:BEGIN Public Symbols -->
### Public Symbols
#### `BenchmarkCLI` {#symbol-benchmarkcli}
- Type: module
- Source: [source](../../../../../../../../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb#L5)

#### `Services` {#symbol-services}
- Type: module
- Source: [source](../../../../../../../../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb#L6)

#### `DataLoader` {#symbol-dataloader}
- Type: module
- Source: [source](../../../../../../../../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb#L7)

#### `load` {#symbol-load}
- Type: method
- Source: [source](../../../../../../../../../../tests/integration/benchmarks/fixtures/ruby/cli/lib/services/data_loader.rb#L21)

##### `load` — Summary
Loads a dataset by name.

##### `load` — Parameters
- `name`: Identifier such as "baseline".

##### `load` — Returns
[Array<Integer>] Numeric samples.

##### `load` — Examples
```ruby
  DataLoader.load("baseline")
```
<!-- LIVE-DOC:END Public Symbols -->

<!-- LIVE-DOC:BEGIN Dependencies -->
### Dependencies
- [`logger`](../support/logger.rb.mdmd.md)
<!-- LIVE-DOC:END Dependencies -->

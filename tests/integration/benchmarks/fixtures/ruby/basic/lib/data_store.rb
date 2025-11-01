# frozen_string_literal: true

module BenchmarkApp
  module DataStore
    DATA = {
      "baseline" => [12, 18, 20],
      "spiky" => [3, 45, 1]
    }.freeze

    def self.fetch(key)
      DATA.fetch(key) { [0] }
    end
  end
end

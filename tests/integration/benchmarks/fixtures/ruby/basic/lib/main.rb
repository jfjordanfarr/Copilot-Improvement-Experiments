# frozen_string_literal: true

require_relative "data_store"
require_relative "reporter"

module BenchmarkApp
  def self.run(key)
    data = DataStore.fetch(key)
    Reporter.summary(data)
  end
end

# frozen_string_literal: true

require_relative "formatter"
require_relative "data_store"

module BenchmarkApp
  module Reporter
    module_function

    def summary(data)
      Formatter.to_text(data)
    end
  end
end

# frozen_string_literal: true

module BenchmarkApp
  module Template
    module_function

    def render(data)
      total = data.sum
      "total=#{total} count=#{data.length}"
    end
  end
end

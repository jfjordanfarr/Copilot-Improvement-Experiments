# frozen_string_literal: true

require_relative "templates"

module BenchmarkApp
  module Formatter
    module_function

    def to_text(data)
      Template.render(data)
    end
  end
end

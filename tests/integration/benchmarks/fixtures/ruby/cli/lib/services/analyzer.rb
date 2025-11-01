# frozen_string_literal: true

require_relative "cache"
require_relative "../support/logger"

module BenchmarkCLI
  module Services
    module Analyzer
      module_function

      def analyze(data)
        cached = Cache.fetch(data)
        return cached if cached

        total = data.sum
        count = data.size
        average = count.zero? ? 0.0 : total.to_f / count
        result = { total: total, average: average, alert: average > 50 }
        Cache.store(data, result)
        Support::Logger.info("analysis complete")
        result
      end

      def describe(result)
        status = result[:alert] ? "ALERT" : "OK"
        Support::Logger.info("#{status} total=#{result[:total]}")
      end
    end
  end
end

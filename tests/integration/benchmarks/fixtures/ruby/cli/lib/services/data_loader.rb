# frozen_string_literal: true

require_relative "../support/logger"

module BenchmarkCLI
  module Services
    module DataLoader
      module_function

      DATASETS = {
        "baseline" => [22, 35, 18, 27],
        "volatile" => [4, 90, 6]
      }.freeze

      def load(name)
        Support::Logger.info("loading dataset #{name}")
        DATASETS.fetch(name) { [0] }
      end
    end
  end
end

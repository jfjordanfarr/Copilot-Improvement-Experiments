# frozen_string_literal: true

module BenchmarkCLI
  module Services
    module Cache
      module_function

  STORE = {}

      def fetch(key)
        STORE[key.object_id]
      end

      def store(key, value)
        STORE[key.object_id] = value
      end
    end
  end
end

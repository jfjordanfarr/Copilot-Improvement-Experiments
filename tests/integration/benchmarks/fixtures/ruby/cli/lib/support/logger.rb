# frozen_string_literal: true

module BenchmarkCLI
  module Support
    module Logger
      module_function

      def info(message)
        print("INFO: ", message, "\n")
      end

      def warn(message)
        print("WARN: ", message, "\n")
      end
    end
  end
end

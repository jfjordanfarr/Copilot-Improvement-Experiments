#include "pipeline.h"
#include "metrics.h"
#include "logger.h"

static double normalize(double value) {
	return clamp(value, 0.0, 100.0);
}

double run_pipeline(const double *samples, size_t count) {
	double average = compute_average(samples, count);
	double bounded = normalize(average);

	if (bounded > 50.0) {
		log_message("threshold exceeded");
	} else {
		log_message("within range");
	}

	return bounded;
}

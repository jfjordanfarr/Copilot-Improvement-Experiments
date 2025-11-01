#include "metrics.h"

double compute_average(const double *values, size_t count) {
	if (count == 0) {
		return 0.0;
	}

	double total = 0.0;
	for (size_t index = 0; index < count; index += 1) {
		total += values[index];
	}

	return total / (double)count;
}

double clamp(double value, double lower, double upper) {
	if (value < lower) {
		return lower;
	}
	if (value > upper) {
		return upper;
	}
	return value;
}

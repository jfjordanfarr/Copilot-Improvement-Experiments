#ifndef METRICS_H
#define METRICS_H

#include <stddef.h>

double compute_average(const double *values, size_t count);
double clamp(double value, double lower, double upper);

#endif

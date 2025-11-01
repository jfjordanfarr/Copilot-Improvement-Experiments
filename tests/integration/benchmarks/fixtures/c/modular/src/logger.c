#include "logger.h"

#include <stdio.h>

void log_message(const char *message) {
	if (message == NULL) {
		return;
	}
	printf("%s\n", message);
}

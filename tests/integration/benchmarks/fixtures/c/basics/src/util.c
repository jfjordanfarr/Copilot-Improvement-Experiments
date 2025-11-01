#include "util.h"

struct widget build_widget(long seed) {
    struct widget result;
    result.value = seed * 2;
    return result;
}

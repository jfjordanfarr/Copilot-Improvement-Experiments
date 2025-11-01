#include "util.h"

int main(void) {
    struct widget sample = build_widget(42);
    return (int)sample.value;
}

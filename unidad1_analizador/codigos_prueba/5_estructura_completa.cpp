void procesoPrincipal(x) {
    int total = 0;
    int control = 5;
    while (control > 0) {
        if (x == 10) {
            total = total + 100;
        } else {
            total = total + 1;
        }
        control = control - 1;
    }
}
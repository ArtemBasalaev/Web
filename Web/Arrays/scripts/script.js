(function () {
    var array = [12, 1, 2, 13, 14, 10, 8, 4, 3, 15, 6, 9, 7, 5, 11];

    array.sort(function (e1, e2) {
        return e2 - e1;
    });

    console.log(array.join(", "));

    var firstFiveNumbersSubArray = array.slice(0, 5);
    console.log(firstFiveNumbersSubArray.join(", "));

    var lastFiveNumbersSubArray = array.slice(-5);
    console.log(lastFiveNumbersSubArray.join(", "));

    // 1 вариант
    console.log(array.filter(function (e) {
        return e % 2 === 0;
    }).reduce(function (sum, e) {
        return sum + e;
    }, 0));

    // 2 вариант
    console.log(array.reduce(function (sum, e) {
        if (e % 2 !== 0) {
            return sum;
        }

        return sum + e;
    }, 0));
})();

(function () {
    var array = [];

    for (var i = 1; i <= 100; i++) {
        array.push(i);
    }

    var evenNumbersSquares = array.filter(function (e) {
        return e % 2 === 0;
    }).map(function (e) {
        return e * e;
    });

    console.log(evenNumbersSquares.join(", "));
})();
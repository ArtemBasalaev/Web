(function () {
    var array = [12, 1, 2, 13, 14, 10, 8, 4, 3, 15, 6, 9, 7, 5, 11];

    array.sort(function (e1, e2) {
        return e1 - e2;
    });

    console.log(array.join(", "));
    console.log(array.slice(0, 5).join(", "));
    console.log(array.slice(array.length - 5, array.length).join(", "));

    // 1 вариант
    console.log((array.filter(function (e) {
        return e % 2 === 0;
    })).reduce(function (sum, e) {
        return sum += e;
    }, 0));

    // 2 вариант
    console.log(array.reduce(function (sum, e) {
        if (e % 2 !== 0) {
            return sum;
        }

        return sum += e;
    }, 0));
})();

(function () {
    var array1 = [];

    for (var i = 1; i <= 100; i++) {
        array1.push(i);
    }

    var array2 = array1.filter(function (e) {
        return e % 2 === 0;
    }).map(function (e) {
        return e * e;
    });

    console.log(array2.join(", "));
})();
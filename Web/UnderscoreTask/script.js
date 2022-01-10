(function () {
    var persons = [
        {
            name: "Ivan",
            age: 22
        },
        {
            name: "Aleksey",
            age: 25
        },
        {
            name: "Ivan",
            age: 30
        },
        {
            name: "Anton",
            age: 52
        },
        {
            name: "Sergey",
            age: 22
        },
        {
            name: "Ivan",
            age: 41
        },
        {
            name: "Kirill",
            age: 52
        },
        {
            name: "Nikolay",
            age: 58
        },
        {
            name: "Anton",
            age: 65
        },
        {
            name: "Petr",
            age: 75
        }
    ];

// 1
    var totalPersonsAge = _.reduce(persons, function (memo, person) {
        return memo + person.age;
    }, 0);

    var averageAge = totalPersonsAge / persons.length;
    console.log("Средний возраст людей: " + averageAge);

// 2
    var personsInAgesRangeAscendingByAge = _.chain(persons)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .sortBy("age")
        .value();

    console.log("Список людей с возрастом от 20 до 30 включительно, отсортированных по возрастанию возраста:");
    console.log(personsInAgesRangeAscendingByAge);

// 3
    var personsInAgesRangeUniqueNamesDescendingByAge = _.chain(persons)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .uniq("name")
        .sortBy("age")
        .pluck("name")
        .reverse()
        .value();

    console.log("Список уникальных имен людей с возрастом от 20 до 30 включительно, отсортированных по убыванию возраста:")
    console.log(personsInAgesRangeUniqueNamesDescendingByAge);

// 4
    var personsCountByName = _.countBy(persons, "name");

    console.log("Объект, в котором ключи имена людей, а значения – количество людей с этим именем:");
    console.log(personsCountByName);
})();

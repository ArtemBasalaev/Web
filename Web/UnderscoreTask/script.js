$(function () {
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

    var averageAge = totalPersonsAge / _.size(persons);
    console.log("Средний возраст людей: " + averageAge);

    // 2
    // сокращенный синтаксис
    var personsInAgesRangeAscendingByAge = _.chain(persons)
        .filter(function (person) { return person.age >= 20 && person.age <= 30; })
        .sortBy("age")
        .value();

    console.log("Список людей с возрастом от 20 до 30 включительно, отсортированных по возрастанию возраста:");
    console.log(personsInAgesRangeAscendingByAge);

    /*
    var personsInAgesRangeAscendingByAge = _.chain(persons)
        .filter(function (person) { return person.age >= 20 && person.age <= 30; })
        .sortBy(function (person) { return person.age; })
        .value();
     */

    // 3
    // сокращенный синтаксис
    var personsInAgesRangeUniqNamesDescendingByAge = _.chain(persons)
        .filter(function (person) { return person.age >= 20 && person.age <= 30; })
        .uniq("name")
        .sortBy("age")
        .pluck("name")
        .reverse()
        .value();

    console.log("Список уникальных имен людей с возрастом от 20 до 30 включительно, отсортированных по убыванию возраста:")
    console.log(personsInAgesRangeUniqNamesDescendingByAge);

    /*
    var personsInAgesRangeUniqNamesDescendingByAge = _.chain(persons)
        .filter(function (person) { return person.age >= 20 && person.age <= 30; })
        .uniq(function (person) { return person.name; })
        .sortBy(function (person) { return person.age; })
        .pluck("name")
        .reverse()
        .value();
     */

    // 4
    var personsCountByName = _.chain(persons)
        .countBy("name")
        .value()

    console.log("Объект, в котором ключи имена людей, а значения – количество людей с этим именем:");
    console.log(personsCountByName);
});
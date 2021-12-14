document.addEventListener("DOMContentLoaded", function () {
    var inputDegrees = document.getElementById("degrees");
    var convertButton = document.getElementById("converter-button");

    var spanFahrenheitDegrees = document.getElementById("fahrenheit-degrees");
    var spanKelvinDegrees = document.getElementById("kelvin-degrees");

    convertButton.addEventListener("click", function () {
        var celsiusDegrees = Number(inputDegrees.value);
        var errorMessage = document.getElementById("error-message");

        if (inputDegrees.value.length === 0 || isNaN(celsiusDegrees)) {
            errorMessage.textContent = "* допустимо вводить только числа, разделителем дробной части должна быть \".\", поле не должно быть пустым";
            return;
        }

        errorMessage.textContent = "";

        var fahrenheitDegrees = convertCelsiusToFahrenheit(celsiusDegrees);
        var kelvinDegrees = convertCelsiusToKelvin(celsiusDegrees);

        spanFahrenheitDegrees.textContent = fahrenheitDegrees.toFixed(2);
        spanKelvinDegrees.textContent = kelvinDegrees.toFixed(2);
    });

    function convertCelsiusToFahrenheit(degrees) {
        return degrees * 1.8 + 32;
    }

    function convertCelsiusToKelvin(degrees) {
        return degrees + 273.15;
    }
})
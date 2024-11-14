// script.js
document.addEventListener("DOMContentLoaded", async () => {
    const provinceSelect = document.getElementById("province");
    const plateInput = document.getElementById("plateNumber");

    // Fetch data from data.json
    const response = await fetch("data.json");
    const data = await response.json();

    // Populate province select options
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.Province;
        option.textContent = item.Province;
        provinceSelect.appendChild(option);
    });

    // Event listener for selecting province
    provinceSelect.addEventListener("change", () => {
        const selectedProvince = provinceSelect.value;
        const provinceData = data.find(item => item.Province === selectedProvince);
        
        if (provinceData) {
            if (Array.isArray(provinceData.Number)) {
                plateInput.value = provinceData.Number.join("; ");
            } else {
                plateInput.value = provinceData.Number;
            }
        } else {
            plateInput.value = "";
        }
    });

    // Event listener for typing plate number
    plateInput.addEventListener("input", () => {
        const inputPlate = plateInput.value;
        const provinceData = data.find(item => 
            Array.isArray(item.Number)
                ? item.Number.includes(inputPlate)
                : item.Number === inputPlate
        );

        if (provinceData) {
            provinceSelect.value = provinceData.Province;
        } else {
            provinceSelect.value = "";
        }
    });
});

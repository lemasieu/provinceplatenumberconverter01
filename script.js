document.addEventListener("DOMContentLoaded", async () => {
  const inputContainer = document.getElementById("input-container");

  const outputProvince = document.getElementById("output-province");
  const outputOld = document.getElementById("output-oldprovinces");
  const outputPlates = document.getElementById("output-plates");

  const response = await fetch("data.json");
  const data = await response.json();

  const allNames = new Set();
  data.forEach(item => {
    allNames.add(item.Province);
    const olds = Array.isArray(item.OldProvinces) ? item.OldProvinces : (item.OldProvinces ? [item.OldProvinces] : []);
    olds.forEach(old => allNames.add(old));
  });

  function renderLookup(mode) {
    inputContainer.innerHTML = "";
    outputProvince.textContent = "";
    outputOld.textContent = "";
    outputPlates.textContent = "";

    if (mode === "province") {
      const select = document.createElement("select");
      select.id = "provinceInput";
      select.innerHTML = `<option value="">-- Chọn tỉnh --</option>`;
      allNames.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
      inputContainer.appendChild(select);

      select.addEventListener("change", () => {
        const input = select.value.trim();
        const matched = data.filter(
          d =>
            d.Province === input ||
            (Array.isArray(d.OldProvinces) && d.OldProvinces.includes(input)) ||
            (!Array.isArray(d.OldProvinces) && d.OldProvinces === input)
        );

        if (matched.length > 0) {
          const provinceName = matched[0].Province;
          const oldMatched = matched.find(d =>
            (Array.isArray(d.OldProvinces) && d.OldProvinces.includes(input)) ||
            (!Array.isArray(d.OldProvinces) && d.OldProvinces === input)
          );
          const oldName = oldMatched && input !== provinceName ? input : "";

          outputProvince.textContent = provinceName;
          if (oldName) {
          outputOld.textContent = oldName;
            } else {
          // Chỉ hiển thị nếu có tỉnh cũ và input khác tỉnh mới
           const olds = matched[0].OldProvinces;
           if (Array.isArray(olds) && olds.length && olds[0] !== matched[0].Province) {
           outputOld.textContent = olds.join(", ");
           } else {
           outputOld.textContent = "";
           }
           };
          outputPlates.textContent = oldName
            ? (Array.isArray(oldMatched.Number) ? oldMatched.Number.join("; ") : oldMatched.Number)
            : matched.flatMap(d => Array.isArray(d.Number) ? d.Number : [d.Number]).join("; ");
        }
      });
    } else if (mode === "plate") {
      const input = document.createElement("input");
      input.placeholder = "Nhập biển số (VD: 85)";
      inputContainer.appendChild(input);

      input.addEventListener("input", () => {
        const code = input.value.trim();
        const found = data.find(item =>
          Array.isArray(item.Number)
            ? item.Number.includes(code)
            : item.Number === code
        );

        if (found) {
          outputProvince.textContent = found.Province;

          let oldName = "";
          const olds = Array.isArray(found.OldProvinces) ? found.OldProvinces : [found.OldProvinces || ""];
          for (const old of olds) {
            const oldEntry = data.find(d =>
              d.Province === found.Province &&
              ((Array.isArray(d.OldProvinces) && d.OldProvinces.includes(old)) || d.OldProvinces === old) &&
              ((Array.isArray(d.Number) && d.Number.includes(code)) || d.Number === code)
            );
            if (oldEntry) {
              oldName = old;
              break;
            }
          }

          outputOld.textContent = oldName;
          outputPlates.textContent = code;
        } else {
          outputProvince.textContent = "";
          outputOld.textContent = " ";
          outputPlates.textContent = "";
        }
      });
    }
  }

  // Khởi động mặc định: theo tỉnh
  renderLookup("province");

  // Gắn sự kiện cho radio buttons
  document.querySelectorAll('input[name="lookupType"]').forEach(radio => {
    radio.addEventListener("change", () => {
      renderLookup(radio.value);
    });
  });
});

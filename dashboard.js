(function () {
  var STORAGE_KEY = "dashboard-grades";
  var TOTAL_EC = 60;
  var PASS_MARK = 5.5;
  var MIN_GRADE = 1;
  var MAX_GRADE = 10;

  var inputs = Array.prototype.slice.call(document.querySelectorAll(".grade-input"));
  var progressFill = document.getElementById("progress-fill");
  var progressBar = document.getElementById("progress-bar");
  var progressLabel = document.getElementById("progress-label");
  var progressAverage = document.getElementById("progress-average");
  var totalAverageCell = document.getElementById("total-average-cell");

  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* localStorage unavailable, skip persisting */
    }
  }

  function update() {
    var saved = {};
    var obtainedEC = 0;
    var gradeSum = 0;
    var gradedCount = 0;

    inputs.forEach(function (input) {
      var ec = parseFloat(input.dataset.ec) || 0;
      var value = input.value.trim();
      input.classList.remove("is-passing", "is-failing");

      if (value === "") {
        return;
      }

      var grade = parseFloat(value);
      if (isNaN(grade)) {
        return;
      }

      if (grade > MAX_GRADE) {
        grade = MAX_GRADE;
        input.value = grade;
      } else if (grade < MIN_GRADE) {
        grade = MIN_GRADE;
        input.value = grade;
      }

      saved[input.id] = input.value;
      gradeSum += grade;
      gradedCount += 1;

      if (grade >= PASS_MARK) {
        obtainedEC += ec;
        input.classList.add("is-passing");
      } else {
        input.classList.add("is-failing");
      }
    });

    var percent = Math.min(100, (obtainedEC / TOTAL_EC) * 100);
    progressFill.style.width = percent + "%";
    progressBar.setAttribute("aria-valuenow", obtainedEC);
    progressLabel.textContent = obtainedEC + " / " + TOTAL_EC + " EC obtained";

    if (gradedCount > 0) {
      var average = gradeSum / gradedCount;
      progressAverage.textContent = "Average grade: " + average.toFixed(1);
      totalAverageCell.textContent = average.toFixed(1);
    } else {
      progressAverage.textContent = "Average grade: -";
      totalAverageCell.textContent = "-";
    }

    save(saved);
  }

  var saved = loadSaved();
  inputs.forEach(function (input) {
    if (saved[input.id] !== undefined) {
      input.value = saved[input.id];
    }
    input.addEventListener("input", update);
  });

  update();
})();

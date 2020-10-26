/*
Global variables declaration
*/

let records = [];
let edit = false;
let date;
let tally;

function loadApp() {
  loadFromLocalStorage();
  date = getCurrentDate();
  renderDate();
  updateTally();
}

function saveToLocalStorage() {
  localStorage.setItem("records", JSON.stringify(records));
  localStorage.setItem("date", JSON.stringify(date));
  localStorage.setItem("tally", JSON.stringify(tally));
}

function loadFromLocalStorage() {
  if (localStorage.getItem("records")) {
    records = JSON.parse(localStorage.getItem("records"));
    renderRecords();
  }
  if (localStorage.getItem("date")) {
    date = JSON.parse(localStorage.getItem("date"));
  }
  if (localStorage.getItem("tally")) {
    tally = JSON.parse(localStorage.getItem("tally"));
  }
}

function createRow() {
  let r = document.createElement("TR");
  r.classList.add("record__row");
  return r;
}

function createTimeNode() {
  let t = document.createElement("TD");
  t.classList.add("record__data");
  return t;
}

function createIntensityNode() {
  let intensityNode = document.createElement("TD");
  intensityNode.classList.add("record__data");
  return intensityNode;
}

function createKey() {
  let time = new Date();
  let key = String(time.getTime());
  return key;
}

function createButtonNode(objectKey) {
  let buttonNode = document.createElement("TD");
  buttonNode.classList.add("record__data");
  let deleteButton = createDeleteButton();
  let key = document.createAttribute("key");
  key.value = objectKey;
  deleteButton.setAttributeNode(key);
  buttonNode.appendChild(deleteButton);
  return buttonNode;
}

function renderRecords() {
  if (records.length > 0) {
    records.map((record) => {
      let row = createRow();
      let timeNode = createTimeNode();
      let intensityNode = createIntensityNode();
      let buttonNode = createButtonNode(record.key);
      let timeData = document.createTextNode(record.time);
      let intensityText = document.createTextNode(record.intensity);

      timeNode.appendChild(timeData);
      intensityNode.appendChild(intensityText);
      row.appendChild(timeNode);
      row.appendChild(intensityNode);
      row.appendChild(buttonNode);
      document.getElementById("record").appendChild(row);
    });
  }
}

function renderDate() {
  let d = document.querySelector(".record-header__date");
  d.innerHTML = date;
}

function getCurrentTime() {
  /*
  THis function gets the hours and minutes of the day and convert them in to 12-hour system for display. The time suffix AM or PM is also displayed.
 */

  let d = new Date();

  let rawHours = d.getHours();
  let displayHours = rawHours < 12 ? rawHours : rawHours - 12;

  let rawMinutes = d.getMinutes();
  let displayMinutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;

  let suffix = rawHours < 12 ? "AM" : "PM";

  return `${displayHours}:${displayMinutes} ${suffix}`;
}

function getCurrentDate() {
  let d = new Date();
  let day = d.getDate();
  let month = d.getMonth();
  switch (day) {
    case 1:
    case 21:
    case 31:
      day = `${day}st`;
      break;
    case 2:
    case 22:
      day = `${day}nd`;
      break;
    case 3:
    case 23:
      day = `${day}rd`;
      break;
    default:
      day = `${day}th`;
      break;
  }

  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
  }
  return `${day} ${month}`;
}

function createDeleteButton() {
  /*
 This function creates an 'i' element with the relevant class names for the FontAwesome "trash" icon.
 */

  let buttonIcon = document.createElement("i");
  buttonIcon.classList.add("far");
  buttonIcon.classList.add("fa-trash-alt");
  buttonIcon.classList.add("record__button");
  buttonIcon.classList.add("record__button--trash");
  buttonIcon.addEventListener("click", deleteEntry);
  return buttonIcon;
}

function addEntry(intense) {
  /*
  This function takes a string argument and adds a row of data to the table. 
  It does this by first creating the tr and td elements while adding the 
  relevant class names for styling. 
*/

  let currentTime = getCurrentTime();
  let objectKey = createKey(); //timecode

  records.push({ key: objectKey, time: currentTime, intensity: intense });

  let timeText = document.createTextNode(currentTime);
  let intensityText = document.createTextNode(intense);

  let row = createRow();
  let timeNode = createTimeNode();
  let intensityNode = createIntensityNode();
  let buttonNode = createButtonNode(objectKey); // pass timecode into createButtonNode

  timeNode.appendChild(timeText);
  intensityNode.appendChild(intensityText);
  row.appendChild(timeNode);
  row.appendChild(intensityNode);
  row.appendChild(buttonNode);
  document.getElementById("record").appendChild(row);
  saveToLocalStorage();
}

function updateTally() {
  tally = records.length;
  text = document.querySelector(".record-header__tally");
  switch (tally) {
    case 0:
      text.innerHTML = "Baby sleeping";
      break;
    case 1:
      text.innerHTML = `${tally} movement`;
      break;
    default:
      text.innerHTML = `${tally} movements`;
  }
}

function recordGentle() {
  addEntry("gentle");
  updateTally();
}

function recordGiant() {
  addEntry("GIANT");
  updateTally();
}

function editEntries() {
  /*
  This function toggles the visibility of the delete button for editing 
  purposes. It uses the "edit" boolean variable to determine whether to 
  hide or not.  While in editing mode, the movement buttons are hidden.
  */

  if (edit === false) {
    edit = true;
  } else {
    edit = false;
  }

  let trash = document.getElementsByClassName("record__button--trash");

  for (let i = 0; i < trash.length; i++) {
    trash[i].style.visibility = edit === true ? "visible" : "hidden";
  }

  if (trash.length > 1) {
    let clear = document.querySelector(".clear__Button");
    clear.style.visibility = edit === true ? "visible" : "hidden";
  }

  let movementButtons = document.getElementsByClassName("movement__button");
  for (let i = 0; i < movementButtons.length; i++) {
    movementButtons[i].style.visibility = edit === false ? "visible" : "hidden";
  }
}

function deleteEntry() {
  /*
 this function is assuming that it is appended on the FontAwesome trash icon. 
 The hierarchy is table > tr > td > i (FontAwesome icon).
 */

  if (confirm("Delete this data?")) {
    let td = this.parentNode;
    let tr = td.parentNode;
    let table = tr.parentNode;
    table.removeChild(tr);
    let t = this.getAttribute("key");
    console.log(typeof t);

    // Update records array.
    records = records.filter((record) => {
      return record.key !== this.getAttribute("key");
    });

    saveToLocalStorage();
    updateTally();
  }

  if (tally === 0) {
    let movementButtons = document.getElementsByClassName("movement__button");
    for (let i = 0; i < movementButtons.length; i++) {
      movementButtons[i].style.visibility = "visible";
    }
    let clear = document.querySelector(".clear__Button");
    clear.style.visibility = "hidden";
  }
}

function clearRecords() {
  if (confirm("Clear all records?")) {
    localStorage.clear();
    window.location.reload();
  }
}

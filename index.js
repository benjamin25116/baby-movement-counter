/*
This app keeps track of the number of taps on the "movement" buttons. 
It displays the time of the tap and the current date, together with
the total number of "movements".
*/

/*
Table of Contents:

1. Global variable declaratons

2.  onClick functions
    2.1   recordGentle()
    2.2   recordGiant()
    2.3   addEntry()
    2.4   editEntries()
    2.5   deleteEntry()
    2.6   clearEntries()

3.  Date functions
    3.1   getCurrentTime()
    3.2   getCurrentDate()

4.  Render functions
    4.1   renderRecords()
    4.2   renderDate()
    4.3   renderNumberOfMovements()

5.  Utility functions
    5.1   main()
    5.2   saveToLocalStorage()
    5.3   loadFromLocalStorage()
    5.4   addRowNode()
    5.5   addTimeNode()
    5.6   addIntensityNode()
    5.7   addKey()
    5.8   addButtonNode()
    5.9   addDeleteButton()
*/

// 1. Global variables declaration

/* 
"records" is of type array to keep track of all movement button presses.
"isEditing" is of type boolean value to keep track of whether or not the 
user is in edit mode.
"currentDate" is of type string that keeps track of today's date.
"numberOfMovements" is of type number that keeps track of the number of 
movement button press. 
*/

let records = [];
let isEditing = false;
let currentDate;
let numberOfMovements;

// 2. onClick functions

function recordGentle() {
  console.log("Gentle pressed");
  addEntry("gentle");
  renderNumberOfMovements();
}

function recordGiant() {
  console.log("Giant pressed");
  addEntry("GIANT");
  renderNumberOfMovements();
}

function addEntry(intense) {
  /*
  This function takes a string argument and adds a row of data to the table. 
  It does this by first creating the tr and td elements while adding the 
  relevant class names for styling. 
  */

  let currentTime = getCurrentTime();
  let objectKey = addKey(); //timecode

  records.push({ key: objectKey, time: currentTime, intensity: intense });

  let timeText = document.createTextNode(currentTime);
  let intensityText = document.createTextNode(intense);

  let row = addRowNode();
  let timeNode = addTimeNode();
  let intensityNode = addIntensityNode();
  let buttonNode = addButtonNode(objectKey); // pass timecode into createButtonNode

  timeNode.appendChild(timeText);
  intensityNode.appendChild(intensityText);
  row.appendChild(timeNode);
  row.appendChild(intensityNode);
  row.appendChild(buttonNode);
  document.getElementById("record").appendChild(row);
  saveToLocalStorage();
}

function editEntries() {
  /*
  This function toggles the visibility of the delete button for editing 
  purposes. It uses the "edit" boolean variable to determine whether to 
  hide or not.  While in editing mode, the movement buttons are hidden.
  */
  console.log("Edit pressed");

  if (isEditing === false) {
    isEditing = true;
  } else {
    isEditing = false;
  }

  if (records.length === 0) {
    alert("Nothing to edit!");
    return;
  } else {
    /*
  Conditional rendering for trash, clear and movement buttons while editing.
  */
    let trashButtons = document.querySelectorAll(".record__button--trash");
    for (const button of trashButtons) {
      button.style.visibility = isEditing === true ? "visible" : "hidden";
    }

    if (trashButtons.length > 1) {
      let clear = document.querySelector(".clear__Button");
      clear.style.visibility = isEditing === true ? "visible" : "hidden";
    }

    let movementButtons = document.querySelectorAll(".movement__button");
    for (const button of movementButtons) {
      button.style.visibility = isEditing === false ? "visible" : "hidden";
    }
  }
}

function deleteEntry() {
  /*
 this function is assuming that it is appended on the FontAwesome trash icon. 
 The hierarchy is table > tr > td > i (FontAwesome icon). It deletes an entry 
 and removes it from the table element.
 */
  console.log("Delete pressed");

  if (confirm("Delete this data?")) {
    let td = this.parentNode;
    let tr = td.parentNode;
    let table = tr.parentNode;
    table.removeChild(tr);
    let t = this.getAttribute("key");

    /* Update records array. Returns every record that doesn't match the 
    key of the deleted record.
    */
    records = records.filter((record) => {
      return record.key !== this.getAttribute("key");
    });

    renderNumberOfMovements();
    saveToLocalStorage();
  }

  /*
  Conditional rendering of movement and clear buttons depending on how 
  many items left on record.
  */

  if (records.length === 0) {
    let movementButtons = document.getElementsByClassName("movement__button");
    for (const button of movementButtons) {
      button.style.visibility = "visible";
    }
    isEditing = false;
  } else if (records.length < 2) {
    document.querySelector(".clear__Button").style.visibility = "hidden";
  }
}

function clearEntries() {
  if (confirm("Clear all records?")) {
    // Purge contents from records array
    records = [];

    // Remove rows from table
    let table = document.getElementById("record");
    while (table.childElementCount > 1) {
      table.removeChild(table.childNodes[2]);
    }

    // Show movement buttons
    let movementButtons = document.querySelectorAll(".movement__button");
    for (const button of movementButtons) {
      button.style.visibility = "visible";
    }

    // Hide clear button
    let clear = document.querySelector(".clear__Button");
    clear.style.visibility = "hidden";

    // Toggles isEditing to false
    isEditing = false;

    // Update numberOfMovement counter
    renderNumberOfMovements();

    // Update local storage cache
    localStorage.clear();
  }
}

// 3. Date functions

function getCurrentTime() {
  /*
  This function gets the hours and minutes of the day and convert them in to 12-hour system for display. The time suffix AM or PM is also displayed.
  @return {string} The current time.
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
  /*
  This function returns the current date formated in the form: "12th Oct"
  @return {string} The current date.
 */
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

// 4. Render functions

function renderRecords() {
  if (records.length > 0) {
    records.map((record) => {
      let row = addRowNode();
      let timeNode = addTimeNode();
      let intensityNode = addIntensityNode();
      let buttonNode = addButtonNode(record.key);
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
  currentDate = getCurrentDate();
  let d = document.querySelector(".record-header__date");
  d.innerHTML = currentDate;
}

function renderNumberOfMovements() {
  numberOfMovements = records.length;
  console.log(typeof numberOfMovements);
  text = document.querySelector(".record-header__tally");
  switch (numberOfMovements) {
    case 0:
      text.innerHTML = "Baby sleeping";
      break;
    case 1:
      text.innerHTML = `${numberOfMovements} movement`;
      break;
    default:
      text.innerHTML = `${numberOfMovements} movements`;
  }
}

// 5. Utility functions

function main() {
  loadFromLocalStorage();
  renderDate();
  renderNumberOfMovements();
}

function saveToLocalStorage() {
  localStorage.setItem("records", JSON.stringify(records));
  localStorage.setItem("date", JSON.stringify(currentDate));
  localStorage.setItem("tally", JSON.stringify(numberOfMovements));
}

function loadFromLocalStorage() {
  if (localStorage.getItem("records")) {
    records = JSON.parse(localStorage.getItem("records"));
    renderRecords();
  }
  if (localStorage.getItem("date")) {
    currentDate = JSON.parse(localStorage.getItem("date"));
  }
  if (localStorage.getItem("tally")) {
    numberOfMovements = JSON.parse(localStorage.getItem("tally"));
  }
}

function addRowNode() {
  let r = document.createElement("TR");
  r.classList.add("record__row");
  return r;
}

function addTimeNode() {
  let t = document.createElement("TD");
  t.classList.add("record__data");
  return t;
}

function addIntensityNode() {
  let intensityNode = document.createElement("TD");
  intensityNode.classList.add("record__data");
  return intensityNode;
}

function addKey() {
  let time = new Date();
  let key = String(time.getTime());
  return key;
}

function addButtonNode(objectKey) {
  let buttonNode = document.createElement("TD");
  buttonNode.classList.add("record__data");
  let deleteButton = addDeleteButton();
  let key = document.createAttribute("key");
  key.value = objectKey;
  deleteButton.setAttributeNode(key);
  buttonNode.appendChild(deleteButton);
  return buttonNode;
}

function addDeleteButton() {
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

/**********************************************
This app keeps track of the number of taps on the "movement" buttons. 
It displays the time of the tap and the current date, together with
the total number of "movements".

**********************************************/

/**********************************************
Table of Contents:

1. Global variable declaratons & main()

2.  onClick functions
    2.1   recordMovement()
    2.2   addEntry()
    2.3   editEntries()
    2.4   deleteEntry()
    2.5   clearEntries()

3.  Date functions
    3.1   getCurrentTime()
    3.2   getCurrentDate()

4.  Display functions
    4.1   renderRecords()
    4.2   renderDate()
    4.3   renderNumberOfMovements()
    4.4   toggleButtons()

5.  Utility functions   
    5.1   saveToLocalStorage()
    5.2   loadFromLocalStorage()
    5.3   addRowNode()
    5.4   addTimeNode()
    5.5   addIntensityNode()
    5.6   addKey()
    5.7   addButtonNode()
    5.8   addDeleteButton()
    5.9   updateNumberOfMovement()

**********************************************/

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

function main() {
  loadFromLocalStorage();
  renderDate();
  renderRecords();
  updateNumberOfMovements();
  renderNumberOfMovements();

  /* addEventListeners for all buttons except the delete button. 
  That is handled in addDeleteButton().
  */
  let movementButtons = document.querySelectorAll(".movement__button");
  for (const button of movementButtons) {
    button.addEventListener("click", recordMovement);
    button.addEventListener("click", saveToLocalStorage);
  }

  let clearButton = document.querySelector(".clear__button");
  clearButton.addEventListener("click", clearEntries);
  clearButton.addEventListener("click", saveToLocalStorage);

  let editButton = document.querySelector(".record__button--edit");
  editButton.addEventListener("click", editEntries);
}

// 2. onClick functions

function recordMovement() {
  addEntry(this.innerHTML);
  updateNumberOfMovements();
  // console.log(`${this.innerHTML} pressed`);
}

function addEntry(arg) {
  /*
  Takes a string argument and adds a row of data to the table. 
  It does this by first creating the tr and td elements while adding the 
  relevant class names for styling. 
  */

  let objectKey = addKey(); //timecode
  let currentTime = getCurrentTime();

  // Update records
  records.push({ key: objectKey, time: currentTime, intensity: arg });

  let timeNode = addTimeNode();
  let intensityNode = addIntensityNode();
  let buttonNode = addButtonNode(objectKey);
  timeNode.appendChild(document.createTextNode(currentTime));
  intensityNode.appendChild(document.createTextNode(arg));

  let row = addRowNode();
  row.appendChild(timeNode);
  row.appendChild(intensityNode);
  row.appendChild(buttonNode);
  document.getElementById("record").appendChild(row);
}

function editEntries() {
  /*
  This function toggles the visibility of the delete button for editing 
  purposes via the "isEditing" boolean. When isEditing === true, the movement
  buttons are hidden, while the Clear all and the trash buttons are visible.
  */
  console.log("Edit pressed");

  isEditing = isEditing === false ? true : false;

  if (records.length === 0) {
    alert("Nothing to edit!");
    return;
  } else {
    toggleButtons();
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

    /* Update records array. Returns every record that doesn't match the 
    key of the deleted record.
    */
    records = records.filter((record) => {
      return record.key !== this.getAttribute("key");
    });
  }
  toggleButtons();
}

function clearEntries() {
  if (confirm("Clear all records?")) {
    // Update records
    records = [];
    isEditing = false;
    toggleButtons();
    updateNumberOfMovements();
    renderRecords();

    console.log("Clear all pressed");
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
  let displayHours = rawHours < 13 ? rawHours : rawHours - 12;

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

// 4. Display functions

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
  } else {
    // Remove rows from table
    let table = document.getElementById("record");
    while (table.childElementCount > 1) {
      table.removeChild(table.childNodes[2]);
    }
  }
}

function renderDate() {
  currentDate = getCurrentDate();
  let d = document.querySelector(".record-header__date");
  d.innerHTML = currentDate;
}

function renderNumberOfMovements() {
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

function toggleButtons() {
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

  /*
  Conditional rendering of movement and clear buttons depending on how 
  many items left on record.
  */
  if (records.length === 0) {
    for (const button of movementButtons) {
      button.style.visibility = "visible";
    }
    isEditing = false;
  } else if (records.length < 2) {
    document.querySelector(".clear__Button").style.visibility = "hidden";
  }
}

// 5. Utility functions

function saveToLocalStorage() {
  localStorage.setItem("records", JSON.stringify(records));
  localStorage.setItem("date", JSON.stringify(currentDate));
  localStorage.setItem("numberOfMovements", JSON.stringify(numberOfMovements));
}

function loadFromLocalStorage() {
  if (localStorage.getItem("records")) {
    records = JSON.parse(localStorage.getItem("records"));
  }
  if (localStorage.getItem("date")) {
    currentDate = JSON.parse(localStorage.getItem("date"));
  }
  if (localStorage.getItem("numberOfMovements")) {
    numberOfMovements = JSON.parse(localStorage.getItem("numberOfMovements"));
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
  /*
This function assumes that only one person will be using the app at
any given time and that the storage is done locally since the key
is actually the time that has elapse since 1970 in miliseconds. 
@return {string} A unique-ish key for the delete button.
*/

  let time = new Date();
  let key = String(time.getTime());
  return key;
}

function addButtonNode(keyValue) {
  /*
  This takes in a key value and appends it to the delete button.
  @param {string} A unique key
  @return {HTML element}. A table cell.
  */
  let buttonNode = document.createElement("TD");
  buttonNode.classList.add("record__data");
  let deleteButton = addDeleteButton();
  let keyAttribute = document.createAttribute("key");
  keyAttribute.value = keyValue;
  deleteButton.setAttributeNode(keyAttribute);
  buttonNode.appendChild(deleteButton);
  return buttonNode;
}

function addDeleteButton() {
  /*
  This function creates an 'i' element with the relevant class 
  names for the FontAwesome "trash" icon.
  @return {HTML element} An button with trash icon.
  */

  let buttonIcon = document.createElement("i");
  buttonIcon.classList.add("far");
  buttonIcon.classList.add("fa-trash-alt");
  buttonIcon.classList.add("record__button");
  buttonIcon.classList.add("record__button--trash");
  buttonIcon.innerHTML = "del"; //temporary
  buttonIcon.addEventListener("click", deleteEntry);
  buttonIcon.addEventListener("click", updateNumberOfMovements);
  buttonIcon.addEventListener("click", saveToLocalStorage);
  return buttonIcon;
}

function updateNumberOfMovements() {
  numberOfMovements = records.length;
  renderNumberOfMovements();
}

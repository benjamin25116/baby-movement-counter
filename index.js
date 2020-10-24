function getCurrentTime() {
  /*
  THis function gets the hours and minutes of the day and convert them in to 12-hour system for display. The time suffix AM or PM is also displayed.
 */

  let date = new Date();

  let rawHours = date.getHours();
  let displayHours = rawHours < 12 ? rawHours : rawHours - 12;

  let rawMinutes = date.getMinutes();
  let displayMinutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;

  let suffix = rawHours < 12 ? "AM" : "PM";

  // console.log(`${displayHours}:${displayMinutes} ${suffix}`);
  return `${displayHours}:${displayMinutes} ${suffix}`;
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

function addEntry(intensity) {
  /*
  This function takes a string argument and adds a row of data to the table. It does this by first creating the tr and td elements while adding the relevant class names for styling. 
*/

  let row = document.createElement("TR");
  row.classList.add("record__row");

  let timeNode = document.createElement("TD");
  timeNode.classList.add("record__data");
  let timeData = document.createTextNode(getCurrentTime());
  timeNode.appendChild(timeData);

  let intensityNode = document.createElement("TD");
  intensityNode.classList.add("record__data");
  let intensityText = document.createTextNode(intensity);
  intensityNode.appendChild(intensityText);

  let buttonNode = document.createElement("TD");
  buttonNode.classList.add("record__data");
  let deleteButton = createDeleteButton();
  buttonNode.appendChild(deleteButton);

  row.append(timeNode);
  row.append(intensityNode);
  row.append(buttonNode);

  document.getElementById("record").appendChild(row);
}

function recordGentle() {
  addEntry("gentle");
}

function recordGiant() {
  addEntry("GIANT");
}

let edit = false;

function editEntries() {
  /*
  This function toggles the visibility of the delete button for editing purposes. It uses the "edit" boolean variable to determine whether to hide or not.  While in editing mode, the movement buttons are hidden.
  */

  let trash = document.getElementsByClassName("record__button--trash");

  for (let i = 0; i < trash.length; i++) {
    trash[i].style.visibility = edit === false ? "visible" : "hidden";
  }

  let movementButtons = document.getElementsByClassName("movement__button");
  for (let i = 0; i < movementButtons.length; i++) {
    toggleVisibility(movementButtons[i]);
  }

  if (edit === false) {
    edit = true;
  } else {
    edit = false;
  }
}

function deleteEntry() {
  /*
 this function is assuming that it is appended on the FontAwesome trash icon. The hierarchy is table > tr > td > i (FontAwesome icon)
 */
  let td = this.parentNode;
  let tr = td.parentNode;
  let table = tr.parentNode;
  table.removeChild(tr);
}

function toggleVisibility(element) {
  if (edit === true) {
    element.style.visibility = "visible";
  } else {
    element.style.visibility = "hidden";
  }
}

/*
Global variables declaration
*/

let records = [];
let edit = false;


function saveToLocalStorage() {
	localStorage.setItem("baby-counter", JSON.stringify(records));
}

function loadFromLocalStorage() {
	if (localStorage.getItem("baby-counter")) {
		records = JSON.parse(localStorage.getItem("baby-counter"));
		renderRecords();

	 }
}

function resetRecords() {
	records = [];
	saveToLocalStorage();
	loadFromLocalStorage();
	window.location.reload();
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
	console.log(key);
	deleteButton.setAttributeNode(key);
	buttonNode.appendChild(deleteButton);
	return buttonNode;
}

function renderRecords() {
	if (records.length > 0){
		records.map(record=> {
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
})} 
}

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

function addEntry(intense) {
  /*
  This function takes a string argument and adds a row of data to the table. 
  It does this by first creating the tr and td elements while adding the 
  relevant class names for styling. 
*/

	let currentTime = getCurrentTime();
	let objectKey = createKey(); //timecode

	records.push({key: objectKey, time: currentTime, intensity: intense});
	
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

function recordGentle() {
  addEntry("gentle");
}

function recordGiant() {
  addEntry("GIANT");
}

function editEntries() {
  /*
  This function toggles the visibility of the delete button for editing 
  purposes. It uses the "edit" boolean variable to determine whether to 
  hide or not.  While in editing mode, the movement buttons are hidden.
  */

  let trash = document.getElementsByClassName("record__button--trash");

  for (let i = 0; i < trash.length; i++) {
    trash[i].style.visibility = edit === false ? "visible" : "hidden";
  }

  let movementButtons = document.getElementsByClassName("movement__button");
  for (let i = 0; i < movementButtons.length; i++) {
	movementButtons[i].style.visibility = edit === true? "visible": "hidden"; 
  }

  if (edit === false) {
    edit = true;
  } else {
    edit = false;
  }
}

function deleteEntry() {
  /*
 this function is assuming that it is appended on the FontAwesome trash icon. 
 The hierarchy is table > tr > td > i (FontAwesome icon).
 */

	if (confirm("Delete this data?")){
		let td = this.parentNode;
		let tr = td.parentNode;
		let table = tr.parentNode;
		table.removeChild(tr);
		let t = this.getAttribute("key");
		console.log(typeof t);
		
		// Update records array.
		records = records.filter(record => {
			return record.key !== this.getAttribute("key");	
		})

		saveToLocalStorage();
	}
  
}

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

function addEntry(intensity) {
  let row = document.createElement("TR");
  row.classList.add("record__row");

  let time = document.createElement("TD");
  time.classList.add("record__data");
  let timeData = document.createTextNode(getCurrentTime());
  time.appendChild(timeData);

  let intensityNode = document.createElement("TD");
  intensityNode.classList.add("record__data");
  let intensityText = document.createTextNode(intensity);
  intensityNode.appendChild(intensityText);

  // Create FontAwesome button
  let button = document.createElement("td");
  button.classList.add("record__data");
  let buttonIcon = document.createElement("i");
  buttonIcon.classList.add("far");
  buttonIcon.classList.add("fa-trash-alt");
  buttonIcon.classList.add("record__button");
  buttonIcon.classList.add("record__button--trash");
  button.appendChild(buttonIcon);

  row.append(time);
  row.append(intensityNode);
  row.append(button);

  document.getElementById("record").appendChild(row);
}

function recordGentle() {
  addEntry("gentle");
}

function recordGiant() {
  addEntry("GIANT");
}

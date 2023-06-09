// Create a new image element for the object
function createObject() {
  var object = new Image();
  object.src =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/08496144-caf2-4bd4-a145-83d3ae160692/dals0rk-81e03a8e-9af5-4a0f-92cf-b1570aa5f515.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA4NDk2MTQ0LWNhZjItNGJkNC1hMTQ1LTgzZDNhZTE2MDY5MlwvZGFsczByay04MWUwM2E4ZS05YWY1LTRhMGYtOTJjZi1iMTU3MGFhNWY1MTUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.krikfgLd5YZMxdb_kP7MjWlbhqx-rl53jVJGmfojW1U"; // Replace with your image URL
  object.style.position = "absolute";
  object.style.width = "100px";
  object.style.height = "100px";
  object.style.pointerEvents = "none"; // Make the object unclickable
  document.body.appendChild(object);
  return object;
}

// Initialize the object's position and velocity
function initializeObject(object) {
  object.style.left =
    Math.random() * (window.innerWidth - parseInt(object.style.width)) + "px";
  object.style.top =
    Math.random() * (window.innerHeight - parseInt(object.style.height)) + "px";
  object.velocityX = Math.random() * 5 - 1; // Random velocity between -1 and 1
  object.velocityY = Math.random() * 5 - 1; // Random velocity between -1 and 1
}

// Update the object's position and check for collisions
function updateObject(object) {
  var left = parseInt(object.style.left);
  var top = parseInt(object.style.top);
  var width = parseInt(object.style.width);
  var height = parseInt(object.style.height);

  // Update position
  left += object.velocityX;
  top += object.velocityY;

  // Check for collisions with other objects
  var objects = document.getElementsByClassName("object");
  for (var i = 0; i < objects.length; i++) {
    if (objects[i] !== object) {
      var otherLeft = parseInt(objects[i].style.left);
      var otherTop = parseInt(objects[i].style.top);
      var otherWidth = parseInt(objects[i].style.width);
      var otherHeight = parseInt(objects[i].style.height);

      if (
        left < otherLeft + otherWidth &&
        left + width > otherLeft &&
        top < otherTop + otherHeight &&
        top + height > otherTop
      ) {
        // Bounce off the other object
        object.velocityX *= -1;
        object.velocityY *= -1;
      }
    }
  }

  // Check for collisions with screen edges
  if (left < 0 || left + width > window.innerWidth) {
    object.velocityX *= -1;
  }
  if (top < 0 || top + height > window.innerHeight) {
    object.velocityY *= -1;
  }

  // Update object's position
  object.style.left = left + "px";
  object.style.top = top + "px";
}

function createObjects(numObjects) {
  for (var i = 0; i < numObjects; i++) {
    var object = createObject();
    object.className = "object";
    initializeObject(object);
  }
}

// Update all objects' positions
function updateObjects() {
  var objects = document.getElementsByClassName("object");
  for (var i = 0; i < objects.length; i++) {
    updateObject(objects[i]);
  }
}

// Call updateObjects function every 30 milliseconds
setInterval(function () {
  updateObjects();
}, 30);

// Allow user to throw objects with the mouse
document.addEventListener("mousedown", function (event) {
  var objects = document.getElementsByClassName("object");
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Check if the mouse is within any of the objects
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var objectX =
      parseInt(object.style.left) + parseInt(object.style.width) / 2;
    var objectY =
      parseInt(object.style.top) + parseInt(object.style.height) / 2;
    // Calculate the distance between the mouse and the object's center
    var distance = Math.sqrt((mouseX - objectX) ** 2 + (mouseY - objectY) ** 2);

    // If the distance is less than the object's radius, throw it
    if (distance < parseInt(object.style.width) / 2) {
      // Calculate the velocity based on the distance from the mouse
      var velocityX = (mouseX - objectX) / 2;
      var velocityY = (mouseY - objectY) / 2;

      // Update the object's velocity
      object.velocityX = velocityX;
      object.velocityY = velocityY;
    }
  }
});


// Create 1000 objects initially
createObjects(100);

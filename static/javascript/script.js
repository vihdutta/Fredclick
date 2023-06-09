var timer = 10;
var points = 0;
var existingDots = 0;
var gameAlive = true;

function init() {
  document.captureEvents(Event.MOUSEMOVE);
  document.onmousemove = mousemove;
}

function mousemove(event) {
  if (gameAlive) {
    var mouse_x = 0;
    var mouse_y = 0;
    if (document.attachEvent != null) {
      mouse_x = window.event.clientX;
      mouse_y = window.event.clientY;
    } else if (!document.attachEvent && document.addEventListener) {
      mouse_x = event.clientX;
      mouse_y = event.clientY;
    }

    var fl = document.getElementById('flashlight');
    fl.style.transform = 'translate(calc(' + mouse_x + 'px - 50vw), ' + 'calc(' + mouse_y + 'px - 50vh))';
    document.getElementById('points').textContent = points;
    document.getElementById('existingDots').textContent = existingDots;
  }
}

function createDot() {
  if (gameAlive) {
    var dot = document.createElement('div');
    dot.className = 'dot';

    var x = Math.floor(Math.random() * (window.innerWidth - 400)) + 100;
    var y = Math.floor(Math.random() * (window.innerHeight - 400)) + 100;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';

    var fl = document.getElementById('flashlight');
    dot.style.zIndex = parseInt(fl.style.zIndex) - 1;

    dot.addEventListener('click', function() {
      dot.parentNode.removeChild(dot);
      points += 1;
      existingDots -= 1;
    });

    document.body.appendChild(dot);
    existingDots += 1;
  }
}


function timerDown() {
  if (gameAlive) {
    timer -= 1;
    if (timer < 0) {
      gameOver();
      gameAlive = false;
    } else {
      document.getElementById("timer").textContent = timer;
    }
  }
}

function gameOver() {
  document.getElementById("gameOver").style.display = "block";
  document.getElementById('finalScore').textContent = points - existingDots;
  console.log(document.getElementById('playerName').textContent);
  $.ajax({
    type: "GET",
    url: "/api/" + document.getElementById('playerName').textContent + "/" + (points - existingDots),
    success: function() {
      console.log("Data sent successfully.");
    },
    error: function() {
      console.log("Data failed to send.");
    }
  });
}

document.getElementById('loadButton').addEventListener('click', function() {
  var name = document.getElementById('name').value;
  // Delete previous crap
  var homeContainer = document.getElementById("home-container");
  homeContainer.parentNode.removeChild(homeContainer);

  // Create the elements to load
  var bypassIndex = document.createElement('div');
  bypassIndex.className = 'bypassIndex';
  bypassIndex.innerHTML = `
    <h1 id="playerName">` + name + `</h1>
    <h1>Points: <span id="points"></span></h1>
    <h1>Existing Fredbears: <span id="existingDots"></span></h1>
    <h1>Time: <span id="timer">N/A</span></h1>
  `;

  var container = document.createElement('div');
  container.id = 'container';
  container.className = 'mouse-cursor-gradient-tracking';
  container.innerHTML = '&nbsp;';

  var flashlight = document.createElement('div');
  flashlight.id = 'flashlight';

  // Append the elements to the document
  document.body.appendChild(bypassIndex);
  document.body.appendChild(container);
  document.body.appendChild(flashlight);

  // Initialize essential things for game
  init()
  setInterval(createDot, 500);
  setInterval(timerDown, 1000);
});

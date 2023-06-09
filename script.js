var timer = 1;
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

function endGame(x) {
  for (let i = 0; i < x; i++) {
    var end = document.createElement("h1");
    end.className = "end";
    var x = Math.floor(Math.random() * (window.innerWidth));
    var y = Math.floor(Math.random() * (window.innerHeight));
    end.style.left = x + 'px';
    end.style.top = y + 'px';
    end.innerHTML = "The game has ended."
    end.style.zIndex = 100;
    document.body.appendChild(end);
  }
}

function gameOver() {
  document.getElementById("gameOver").style.display = "block";
  document.getElementById('finalScore').textContent = points - existingDots;
}


document.getElementById('loadButton').addEventListener('click', function() {
  // Delete previous crap
  var homeContainer = document.getElementById("home-container");
  homeContainer.parentNode.removeChild(homeContainer);

  // Create the elements to load
  var bypassIndex = document.createElement('div');
  bypassIndex.className = 'bypassIndex';
  bypassIndex.innerHTML = `
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

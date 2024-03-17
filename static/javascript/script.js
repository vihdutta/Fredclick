var timer = 60;
var points = 0;
var existingDots = 0;
var gameAlive = true;

function initMouseListener() {
  document.addEventListener('mousemove', mousemove);
}

function mousemove(event) {
  if (gameAlive) {
    const mouse_x = event.clientX || window.event.clientX;
    const mouse_y = event.clientY || window.event.clientY;

    document.getElementById('points').textContent = points;
    document.getElementById('existingDots').textContent = existingDots;
  }
}

// Creates the clickable fredbears
function createFredbear() {
  if (gameAlive) {
    const dot = document.createElement('div');
    dot.className = 'dot';

    const x = getRandomCoordinate(window.innerWidth, 400, 100);
    const y = getRandomCoordinate(window.innerHeight, 400, 100);
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';

    dot.addEventListener('click', () => {
      dot.remove();
      points += 1;
      existingDots -= 1;
    });

    document.body.appendChild(dot);
    existingDots += 1;
  }
}

function getRandomCoordinate(max, offset, min) {
  return Math.floor(Math.random() * (max - offset)) + min;
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
  document.getElementById('finalScore').textContent = points; /* - existingDots; */
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
  // Get the player's name
  var name = document.getElementById('name').value;

  // Remove the existing home container
  var homeContainer = document.getElementById("home-container");
  homeContainer.parentNode.removeChild(homeContainer);

  // Create the elements to load
  var bypassIndex = createBypassIndexElement(name);
  var container = createContainerElement();

  // Append the elements to the document
  document.body.appendChild(bypassIndex);
  document.body.appendChild(container);

  // Initialize essential things for the game
  initMouseListener();
  setInterval(createFredbear, (1000-Math.pow(points, 6)));
  setInterval(timerDown, 1000);
});

function createBypassIndexElement(name) {
  var bypassIndex = document.createElement('div');
  bypassIndex.className = 'bypassIndex';
  bypassIndex.innerHTML = `
    <h2 id="playerName">${name}</h2>
    <h2>Points: <span id="points"></span></h2>
    <h2>Existing Fredbears: <span id="existingDots"></span></h2>
    <h2>Time: <span id="timer">N/A</span></h2>
  `;
  return bypassIndex;
}

function createContainerElement() {
  var container = document.createElement('div');
  container.id = 'container';
  container.className = 'mouse-cursor-gradient-tracking';
  container.innerHTML = '&nbsp;';
  return container;
}

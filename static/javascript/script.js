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

    const fl = document.getElementById('flashlight');
    fl.style.transform = `translate(calc(${mouse_x}px - 50vw), calc(${mouse_y}px - 50vh))`;

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

    const fl = document.getElementById('flashlight');
    dot.style.zIndex = parseInt(fl.style.zIndex) - 1;

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
  // Get the player's name
  var name = document.getElementById('name').value;

  // Remove the existing home container
  var homeContainer = document.getElementById("home-container");
  homeContainer.parentNode.removeChild(homeContainer);

  // Create the elements to load
  var bypassIndex = createBypassIndexElement(name);
  var container = createContainerElement();
  var flashlight = createFlashlightElement();

  // Append the elements to the document
  document.body.appendChild(bypassIndex);
  document.body.appendChild(container);
  document.body.appendChild(flashlight);

  // Initialize essential things for the game
  initMouseListener();
  initGameLoop();
  setInterval(createFredbear, 500);
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

// Creates div for the flashlight
function createFlashlightElement() {
  var flashlight = document.createElement('div');
  flashlight.id = 'flashlight';
  return flashlight;
}

function initGameLoop() {
  const imageContainer = document.createElement('div');
  imageContainer.id = 'image-container';
  imageContainer.style.position = 'absolute';

  const image = document.createElement('img');
  image.src = 'static/images/bear.png';
  image.alt = 'Image';

  let gameAlive = true;
  let bearTravel = 0;

  function resetBear() {
    const screenWidth = window.innerWidth;
    const imageWidth = image.clientWidth;
    const randomPositionX = Math.floor(Math.random() * (screenWidth - imageWidth));
    imageContainer.style.left = randomPositionX + 'px';
    imageContainer.style.top = window.innerHeight + 'px';
  }

  let unclickedBear = true;

  const loop = setInterval(function () {
    if (unclickedBear && gameAlive) {
      const currentY = parseFloat(imageContainer.style.top) || window.innerHeight;
      const newY = currentY - 0.35; // Increase Y position by 0.35 pixels every millisecond
      bearTravel += 0.35;
      imageContainer.style.top = newY + 'px';
      if (bearTravel >= 450) {
        gameOver();
        gameAlive = false;
        clearInterval(loop);
      }
    } else {
      setTimeout(function () {
        bearTravel = 0;
        resetBear();
        unclickedBear = true;
      }, Math.random() * 5000);
    }
  }, 1);

  imageContainer.addEventListener('click', function () {
    unclickedBear = false;
  });

  imageContainer.appendChild(image);
  document.body.appendChild(imageContainer);
}

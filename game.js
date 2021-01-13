//there should be a function that allows you to place an obstacle
// at a certain xy, and make it a certain width and height, in x-units

//dodgeball?

/**
 * Pokemon HTML5 canvas game
 * @version 1.0.0
 * @author Panagiotis Vourtsis <vourtsis_pan@hotmail.com>
 */
window.onload = function() {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var w = document.getElementById('canvas').offsetWidth;
  var h = document.getElementById('canvas').offsetHeight;
  var terrainImageLoaded = false,
    pokeballImageLoaded = false,
    playerImageLoaded = false;
  var objectSizes = 25;
  var speed = 100;
  var modifier = 100;
  var score = 0;
  var obstacleList = []
  var widthToPixels = w / objectSizes
  var heighttoPixels = h / objectSizes

  //terrain image
  var terrainImage = new Image();
  terrainImage.src = 'sandTerrain575x.png';

  terrainImage.onload = function() {
    terrainImageLoaded = true;
    assetsLoaded();
    addObstacle('canteen.png', 5, 5, 5, 4, "cantina");
    addObstacle('boat.png', 11, 6, 2, 3, "boat");
    addObstacle('pond.png', 21, 21, 4, 4, "pond");

    //addObstacle('https://drive.google.com/uc?id=1YO5Mg6IzlskREYSRcr2Ut00JZI49ivnR', 10, 5, 5, 5, "house")
    addObstacle('flamethrowerPack.png', -999999,-999999, 15, 1, "flamethrowerObstacle")

  };

  function addObstacle (source, x, y, width, height, name) {
    window[name] = new Image();
    window[name].src = source;
    window[name].onload = function () {
      obstacleList.push({
        obstacleName: name,
        minX: x,
        maxX: (x + width),
        minY: y,
        maxY: (y + height),
        loaded: true})
      assetsLoaded()
      }

  }

  function drawObstacle (obstacle, x, y, width, height) {
    var xInPixels = x * widthToPixels;
    var yInPixels = y * heighttoPixels;
    var widthInPixels = width * widthToPixels
    var heightInPixels = height * heighttoPixels
    ctx.drawImage(obstacle, xInPixels, yInPixels, widthInPixels, heightInPixels);

  }

  //main sound
  var mainTheme = new Audio('https://drive.google.com/uc?id=1ljrlJ1UBrH4YnIpxH02jqR_oJeLZhkDv');
  mainTheme.loop = true;
  mainTheme.volume = 0.5;
  mainTheme.play();

  //pokeball-selection
  var pokePick = new Audio('https://drive.google.com/uc?id=1ULOY_JeGQWJ0SOcxQfBtNQ77e20sWa31');
  pokePick.volume = 0.8;

  //player image
  var playerImage = new Image();
  playerImage.onload = function() {
    pokeballImageLoaded = true;
    assetsLoaded();
  };
  playerImage.src = 'yPlayer.png'
  //playerImage.src = 'https://drive.google.com/uc?id=1ZsYCAWG7uR2_nZTVsIOOUog4tXFIUsgB';

  //pokeball image
  var pokeballImage = new Image();
  pokeballImage.onload = function() {
    playerImageLoaded = true;
    assetsLoaded();
  };
  pokeballImage.src = 'melon.png';

  /**
   * It will hold all the pockeball data like x and y axis position
   * sprite position and item distance is for determine which item is selected from the sprite - @todo future use for knowing on score which one player picked
   * Also hold the generate position function that generates random positions if there is no collision.
   * @Object
   * @name pokeball
   */
  var pokeball = {
    x: 0,
    y: 0,
    spritePosition: 0,
    spriteItemDistance: 33,
  };
  pokeball.generatePosition = function() {
    do {
      pokeball.x = Math.floor(Math.random() * 20) + 1;
      pokeball.y = Math.floor(Math.random() * 16) + 4;
    } while (check_collision(pokeball.x, pokeball.y));

    pokeball.spritePosition = Math.floor(Math.random() * 4) + 0; // get position from 0-4
  };

async  function flamethrower () {
    if (player.currentDirection == 'stand' || player.currentDirection == "down-1" || player.currentDirection == "down-2") {
      var sx = 23;
      var sy = 0;
      var swidth = 23;
      var sheight = 874;
      var xLoc = player.x * widthToPixels;
      var yLoc = (player.y + 1) * heighttoPixels;
      var width = 1 * widthToPixels;
      var height = (check_collision_range(player.x, player.y, "down") * heighttoPixels) - (player.y * heighttoPixels);
    }
    else if (player.currentDirection == "up-1" || player.currentDirection == "up-2") {
      var sx = 0;
      var sy = 0;
      var swidth = 23;
      var sheight = 874;
      var xLoc = player.x * widthToPixels;
      var height = Math.abs((check_collision_range(player.x, player.y, "up") * heighttoPixels) - (player.y * heighttoPixels));
      var yLoc = (player.y * heighttoPixels) - height;
      var width = 1 * widthToPixels;
    }
    else if (player.currentDirection == "left-1" || player.currentDirection == "left-2") {
      var sx = 46;
      var sy = 0;
      var swidth = 874;
      var sheight = 23;
      var width = Math.abs((check_collision_range(player.x, player.y, "left") * widthToPixels) - (player.x * widthToPixels));
      var xLoc = ((player.x ) * widthToPixels) - width;
      var yLoc = (player.y * heighttoPixels);
      var height = 1 * heighttoPixels;

    }
    else if (player.currentDirection == "right-1" || player.currentDirection == "right-2") {
      var sx = 46;
      var sy = 23;
      var swidth = 874;
      var sheight = 23;
      var xLoc = (player.x + 1) * widthToPixels;
      var yLoc = (player.y * heighttoPixels);
      var width = (check_collision_range(player.x, player.y, "right") * widthToPixels) - (player.x * widthToPixels);
      var height = 1 * heighttoPixels;

    }
      

    
      ctx.drawImage(flamethrowerObstacle, sx, sy, swidth, sheight, xLoc, yLoc, width, height)
      check_flamethrower_collision(pokeball.x * widthToPixels, pokeball.y * heighttoPixels, xLoc, xLoc + width, yLoc, yLoc + height)
      await new Promise(r => setTimeout(r, 500));
      update()
    
    //drawObstacle(flamethrowerObstacle, (player.x + 1), (player.y), Math.min((w / objectSizes), (h / objectSizes)), 1)
    
  }

  function check_flamethrower_collision (x, y, minX, maxX, minY, maxY) {
    if ( x >= minX && x < maxX && y >= minY && y < maxY) {
      console.log("grab those balls")
    }

  }

  /**
   * Holds all the player's info like x and y axis position, his current direction (facing).
   * I have also incuded an object to hold the sprite position of each movement so i can call them
   * I also included the move function in order to move the player - all the functionality for the movement is in there
   * @Object
   * @name player
   */
  var player = {
    x: Math.round(w / 2 / objectSizes),
    y: Math.round(h / 2 / objectSizes),
    currentDirection: 'stand',
    direction: {
      stand: {
        x: 0,
        y: 0,
      },
      'down-1': {
        x: 23,
        y: 0,
      },
      'down-2': {
        x: 46,
        y: 0,
      },
      'up-1': {
        x: 161,
        y: 0,
      },
      'up-2': {
        x: 184,
        y: 0,
      },
      'left-1': {
        x: 92,
        y: 0,
      },
      'left-2': {
        x: 115,
        y: 0,
      },
      'right-1': {
        x: 207,
        y: 0,
      },
      'right-2': {
        x: 230,
        y: 0,
      },
    },
  };

  var player2 = {
    x: Math.round(w / 2 / objectSizes),
    y: Math.round(h / 2 / objectSizes),
    currentDirection: 'stand',
    direction: {
      stand: {
        x: 0,
        y: 0,
      },
      'down-1': {
        x: 23,
        y: 0,
      },
      'down-2': {
        x: 46,
        y: 0,
      },
      'up-1': {
        x: 161,
        y: 0,
      },
      'up-2': {
        x: 184,
        y: 0,
      },
      'left-1': {
        x: 92,
        y: 0,
      },
      'left-2': {
        x: 115,
        y: 0,
      },
      'right-1': {
        x: 207,
        y: 0,
      },
      'right-2': {
        x: 230,
        y: 0,
      },
    },
  };

  player.move = function(direction) {
    /**
     * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
     */
    var hold_player = {
      x: player.x,
      y: player.y,
    };

    /**
     * Decide here the direction of the user and do the neccessary changes on the directions
     */
    switch (direction) {
      case 'left':
        player.x -= speed / modifier;
        if (player.currentDirection == 'stand') {
          player.currentDirection = 'left-1';
        } else if (player.currentDirection == 'left-1') {
          player.currentDirection = 'left-2';
        } else if (player.currentDirection == 'left-2') {
          player.currentDirection = 'left-1';
        } else {
          player.currentDirection = 'left-1';
        }
        break;
      case 'right':
        player.x += speed / modifier;
        if (player.currentDirection == 'stand') {
          player.currentDirection = 'right-1';
        } else if (player.currentDirection == 'right-1') {
          player.currentDirection = 'right-2';
        } else if (player.currentDirection == 'right-2') {
          player.currentDirection = 'right-1';
        } else {
          player.currentDirection = 'right-1';
        }
        break;
      case 'up':
        player.y -= speed / modifier;

        if (player.currentDirection == 'stand') {
          player.currentDirection = 'up-1';
        } else if (player.currentDirection == 'up-1') {
          player.currentDirection = 'up-2';
        } else if (player.currentDirection == 'up-2') {
          player.currentDirection = 'up-1';
        } else {
          player.currentDirection = 'up-1';
        }

        break;
      case 'down':
        player.y += speed / modifier;

        if (player.currentDirection == 'stand') {
          player.currentDirection = 'down-1';
        } else if (player.currentDirection == 'down-1') {
          player.currentDirection = 'down-2';
        } else if (player.currentDirection == 'down-2') {
          player.currentDirection = 'down-1';
        } else {
          player.currentDirection = 'down-1';
        }

        break;
    }

    /**
     * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
     */
    if (check_collision(player.x, player.y, obstacleList)) {
      player.x = hold_player.x;
      player.y = hold_player.y;
    }

    check_pokeball_collision()

    update();
  };

  player2.move = function(direction) {
    /**
     * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
     */
    var hold_player = {
      x: player2.x,
      y: player2.y,
    };

    /**
     * Decide here the direction of the user and do the neccessary changes on the directions
     */
    switch (direction) {
      case 'left':
        player2.x -= speed / modifier;
        if (player2.currentDirection == 'stand') {
          player2.currentDirection = 'left-1';
        } else if (player2.currentDirection == 'left-1') {
          player2.currentDirection = 'left-2';
        } else if (player2.currentDirection == 'left-2') {
          player2.currentDirection = 'left-1';
        } else {
          player2.currentDirection = 'left-1';
        }
        break;
      case 'right':
        player2.x += speed / modifier;
        if (player2.currentDirection == 'stand') {
          player2.currentDirection = 'right-1';
        } else if (player2.currentDirection == 'right-1') {
          player2.currentDirection = 'right-2';
        } else if (player2.currentDirection == 'right-2') {
          player2.currentDirection = 'right-1';
        } else {
          player2.currentDirection = 'right-1';
        }
        break;
      case 'up':
        player2.y -= speed / modifier;

        if (player2.currentDirection == 'stand') {
          player2.currentDirection = 'up-1';
        } else if (player2.currentDirection == 'up-1') {
          player2.currentDirection = 'up-2';
        } else if (player2.currentDirection == 'up-2') {
          player2.currentDirection = 'up-1';
        } else {
          player2.currentDirection = 'up-1';
        }

        break;
      case 'down':
        player2.y += speed / modifier;

        if (player2.currentDirection == 'stand') {
          player2.currentDirection = 'down-1';
        } else if (player2.currentDirection == 'down-1') {
          player2.currentDirection = 'down-2';
        } else if (player2.currentDirection == 'down-2') {
          player2.currentDirection = 'down-1';
        } else {
          player2.currentDirection = 'down-1';
        }

        break;
    }

    /**
     * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
     */
    if (check_collision(player2.x, player2.y, obstacleList)) {
      player2.x = hold_player2.x;
      player2.y = hold_player2.y;
    }

    check_pokeball_collision()

    update();
  };

  /**
   * Handle all the updates of the canvas and creates the objects
   * @function
   * @name update
   */
  function update() {
    ctx.drawImage(terrainImage, 0, 0);


    for (var obstacle in obstacleList) {
      var obstacle = obstacleList[obstacle];
      drawObstacle(window[obstacle.obstacleName], obstacle.minX, obstacle.minY, (obstacle.maxX - obstacle.minX), (obstacle.maxY - obstacle.minY))
    }


    //Genboard
    board();

    //pokeball
    ctx.drawImage(
      pokeballImage,
      0,
      0,
      (w/objectSizes),
      (h/objectSizes),
      pokeball.x * widthToPixels,
      pokeball.y * heighttoPixels,
      (w/objectSizes),
      (h/objectSizes)
    );

    //player
    console.log('y:', player.y);
    console.log('x:', player.x);

    ctx.drawImage(
      playerImage,
      player.direction[player.currentDirection].x,
      player.direction[player.currentDirection].y,
      23,
      23,
      player.x * (w / objectSizes),
      player.y * (h / objectSizes),
      23,
      23
    );
  }

  function check_pokeball_collision() {
    /**
     * If player finds the coordinates of pokeball the generate new one, play the sound and update the score
     */
    if (player.x == pokeball.x && player.y == pokeball.y) {
      // found a pokeball !! create a new one
      console.log('found a pokeball of ' + pokeball.spritePosition + '! Bravo! ');
      pokePick.pause();
      pokePick.currentTime = 0;
      pokePick.play();
      score += 1;
      pokeball.generatePosition();
    }
  }

  /**
   * Our function that decides if there is a collision on the objects or not
   * @function
   * @name check_collision
   * @param {Integer} x - The x axis
   * @param {Integer} y - The y axis
   * @param {Object[]} obstacles - A list of the things you might run into
   */
  function check_collision(x, y) {
    var foundCollision = false;

    if ( x < 0 || x == objectSizes || y < 0 || y == objectSizes) {
      console.log("lost on wall")
      foundCollision = true
    }

    for (var obstacle of obstacleList) {
      if ( x >= obstacle.minX && x < obstacle.maxX && y >= obstacle.minY && y < obstacle.maxY) {
        console.log("lost on" + obstacle.obstacleName)
        foundCollision = true
      }
    }



    return foundCollision;
  }

  function check_collision_range (x, y, direction) {
    var i;
    if (direction == "up") {
      for (i = y; i >= 0; i--) {
        if (check_collision(x, i)) {
          console.log(i)
          return i
        }
      }
      return 0

    }
    if (direction == "down") {
      for (i = y; i <= objectSizes; i++) {
        if (check_collision(x, i)) {
          return i -1
        }
      }
      return objectSizes


    }
    if (direction == "left") {
      for (i = x; i >= 0; i--) {
        if (check_collision(i, y)) {
          return i + 1
        }
      }
      return 0


    }
    if (direction == "right") {
      for (i = x; i <= objectSizes; i++) {
        if (check_collision(i, y)) {
          return i - 1
        }
      }
      return objectSizes


    }
    

  }

  /**
   * Here we are creating our board on the bottom right with our score
   * @todo maybe some mute button for the future?
   * @function
   * @name board
   */
  function board() {

    ctx.font = '14px Fira Code';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText('IAW: ' + score, 21*widthToPixels + 18, h - 50);
  }

  /**
   * Decide here if all the assets are ready to start updating
   * @function
   * @name assetsLoaded
   */
  function assetsLoaded() {
    if (
      terrainImageLoaded == true &&
      pokeballImageLoaded == true &&
      playerImageLoaded == true &&
      obstacleList.every(obstacleLoaded)
      
    ) {
      
      pokeball.generatePosition();
      update();
    }
  }

  function obstacleLoaded (element, index, array) {
    return element.loaded
  }

  /**
   * Assign of the arrow keys to call the player move
   */
  document.onkeydown = function(e) {
    e = e || window.event;

    if (e.keyCode == '37') player.move('left');
    else if (e.keyCode == '38') player.move('up');
    else if (e.keyCode == '39') player.move('right');
    else if (e.keyCode == '40') player.move('down');
    else if (e.keyCode == '32') flamethrower();
    else if (e.keyCode == '65') player2.move('left')

    ;

  };
};

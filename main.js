const refreshDelay = 12;
const epsilon = 2; // margin of error for paddle-ball collision
const wallSound = new Audio("pong.wav");
const paddleSound = new Audio("pong2.wav");
const fieldHeight = 384;
const fieldWidth = 768;

let paddleSpeed = 7;
let paddleWidth = 80;
let ballSpeed = 4;
let speedBoost = 1;
let scoreCap = 5;
let start = false;
let paused = false;
let map = {87:false, 83:false, 38:false, 40:false}; // stores which keys are being pressed, to fix ghosting

// stores current speed of ball to allow for pausing
let vX = ballSpeed;
let vY = ballSpeed;

$(document).ready(function() {
    
  $(document).keydown(function(e) {
    // toggle start when spacebar is pressed
    if (e.keyCode === 32) {
      $('.setting').toggleClass('disabled');
      if (!start) {
        start = true;
        $('#rightscore').text("0");
        $('#leftscore').text("0");
        $('#ball').css('left', (fieldWidth / 2).toString() + "px");
        $('#ball').css('top', (fieldHeight / 2).toString() + "px");
        $('#message').text("Press [space] to pause!");
        move();
      } else {
        paused = !paused;
        if (!paused) {
          $('#message').text("Press [space] to pause!");
          move();
        } else {
          $('#message').text("Press [space] to resume!");
        }
      }
    }
   
    if (e.keyCode in map) {
      map[e.keyCode] = true;
    }
  });

  $(document).keyup(function(e) {
      if (e.keyCode in map) {
        map[e.keyCode] = false;
      }
  });

  $('#color').change(function() {
    $('body').css('color', $('#color').val());
    $('.paddle').css('background', $('#color').val());
    $('#ball').css('background', $('#color').val());
    $('#color').blur();
  });

  $('#speed').change(function() {
    const newSpeed = parseInt($('#speed').val());
    vX = vX * newSpeed / ballSpeed;
    vY = vY * newSpeed / ballSpeed;
    ballSpeed = newSpeed;
    $('#speed').blur();
  });

  $('#scoreCap').change(function() {
    scoreCap = parseInt($('#scoreCap').val());
    $('#scoreCap').blur();
  });
  
  $('#paddleWidth').change(function() {
    paddleWidth = parseInt($('#paddleWidth').val());
    const leftY = parseInt($('#leftpaddle').css('top'));
    const rightY = parseInt($('#rightpaddle').css('top'));
    $('#leftpaddle').css('top', Math.min(leftY, fieldHeight - paddleWidth).toString() + "px");
    $('#rightpaddle').css('top', Math.min(rightY, fieldHeight - paddleWidth).toString() + "px");
    $('.paddle').css('height', paddleWidth.toString() + "px");
    $('#paddleWidth').blur();
  });

  $('#speedBoost').change(function() {
    if ($('#speedBoost').prop('checked')) {
      speedBoost = 1.08;
    } else {
      speedBoost = 1;
    }
    $('#speedBoost').blur();
  })
});

function move() {
  movePaddles();
  moveBall();
  if (start && !paused) { setTimeout(function(){move()}, refreshDelay); }
}

function movePaddles() {
  let height1 = parseInt($('#leftpaddle').css('top'));
  let height2 = parseInt($('#rightpaddle').css('top'));

  if (map[87] && height1 >= 0) {
    height1 -= paddleSpeed;
    $('#leftpaddle').css('top',height1.toString() +"px");
  }
  if (map[83] && height1 + paddleWidth <= fieldHeight) {
    height1 += paddleSpeed;
    if (height1 + paddleWidth > fieldHeight) {
      height1 = fieldHeight - paddleWidth;
    }
    $('#leftpaddle').css('top',height1.toString() +"px");
  }
  if (map[38] && height2 >= 0) {
    height2 -= paddleSpeed;
    $('#rightpaddle').css('top',height2.toString() +"px");
  }
  if (map[40] && height2 + paddleWidth <= fieldHeight) {
    height2 += paddleSpeed;
    if (height2 + paddleWidth > fieldHeight) {
      height2 = fieldHeight - paddleWidth;
    }
    $('#rightpaddle').css('top',height2.toString() +"px");
  }
}

function moveBall() {
  const newX = parseInt($('#ball').css('left')) + vX;
  const newY = parseInt($('#ball').css('top')) + vY;
  $('#ball').css('left',newX.toString() + "px");
  $('#ball').css('top',newY.toString() + "px");
  
  let newVX = vX;
  let newVY = vY;

  // collision with top wall
  if (newY <= 4) {
    newVY = Math.abs(vY);
    wallSound.play();
  }

  if (newY >= fieldHeight - 4) {
    newVY = -Math.abs(vY);
    wallSound.play();
  }

  // angle from vertical at which ball reflects off paddle
  function getTheta(vY, ballY, paddleY) {
    let theta = 45;
    if (vY > 0) {
      theta = (ballY - paddleY) / paddleWidth * 90;
    } else {
      theta = (paddleWidth - (ballY - paddleY)) / paddleWidth * 90;
    }
    theta = theta / 2 + 30; // maps distance along paddle to angle between 30 and 75
    return theta;
  }

  // collision with P1 paddle
  const leftX = parseInt($('#leftpaddle').css('left'));
  const leftY = parseInt($('#leftpaddle').css('top'));
  if (newX + vX <= leftX + epsilon && newX >= leftX - epsilon && vX < 0) {
    if (newY >= leftY - epsilon && newY <= leftY + paddleWidth + epsilon) {
      
      const theta = getTheta(vY, newY, leftY);

      newVY = Math.sign(vY) * Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.cos(theta*Math.PI/180);
      newVX = Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.sin(theta * Math.PI/180);

      newVX *= speedBoost;
      newVY *= speedBoost;
      
      paddleSound.play();
    }
  }

  // collision with P2 paddle
  const rightX = fieldWidth - parseInt($('#rightpaddle').css('right')) - 10;
  const rightY = parseInt($('#rightpaddle').css('top'));
  if (newX + vX >= rightX - epsilon && newX <= rightX + epsilon && vX > 0) {
    if (newY >= rightY - epsilon && newY <= rightY + paddleWidth + epsilon) {

      const theta = getTheta(vY, newY, rightY);

      newVY = Math.sign(vY) * Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.cos(theta*Math.PI/180);
      newVX = -Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.sin(theta * Math.PI/180);

      newVX *= speedBoost;
      newVY *= speedBoost;
      
      paddleSound.play();
    }
  }

  if (newX < 0) {
    $('#ball').css('left', (fieldWidth / 2).toString() + "px");
    $('#ball').css('top', (fieldHeight / 2).toString() + "px");
    newVX = -ballSpeed;
    newVY = ballSpeed;
    $('#rightscore').html(parseInt($('#rightscore').html()) + 1); 
  }

  if (newX >= fieldWidth - 10) {
    $('#ball').css('left', (fieldWidth / 2).toString() + "px");
    $('#ball').css('top', (fieldHeight / 2).toString() + "px");
    newVX = ballSpeed;
    newVY = ballSpeed;
    $('#leftscore').html(parseInt($('#leftscore').html()) + 1);
  }

  if (parseInt($('#rightscore').html()) >= scoreCap || parseInt($('#leftscore').html()) >= scoreCap) {
    if (parseInt($('#rightscore').html()) < parseInt($('#leftscore').html())) {
      $('#message').text("Player 1 Wins! Press [space] to restart.");
      start = false;
      $('.setting').toggleClass('disabled');
    } else if (parseInt($('#rightscore').html()) > parseInt($('#leftscore').html())) {
      $('#message').text("Player 2 Wins! Press [space] to restart.");
      start = false;
      $('.setting').toggleClass('disabled');
    }
  }
  
  vX = newVX;
  vY = newVY;
}

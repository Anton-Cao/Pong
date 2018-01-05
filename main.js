const refreshRate = 12;
let paddleSpeed = 7;
let ballSpeed = 4;
let start = false;
let map = {87:false,83:false,38:false,40:false}; // stores which keys are being pressed, to fix ghosting

$(document).ready(function(){
    
  $(document).keydown(function (e) {
    if(!start){
      start = true;
      moveBall(ballSpeed, ballSpeed);
      movePaddles();
    }

    if(e.keyCode in map){
      map[e.keyCode] = true;
    }
  });

  $(document).keyup(function (e) {
      if(e.keyCode in map){
        map[e.keyCode] =false;
      }
  });

});

function movePaddles(){
  let height1 = parseInt($('#leftbumper').css('top'));
  let height2 = parseInt($('#rightbumper').css('top'));

  if(map[87] && height1 >= 200){
    height1 -= paddleSpeed;
    $('#leftbumper').css('top',height1.toString() +"px");
  }
  if(map[83] && height1 <= 510){
    height1 += paddleSpeed;
    $('#leftbumper').css('top',height1.toString() +"px");
  }
  if(map[38] && height2 >= 200){
    height2 -= paddleSpeed;
    $('#rightbumper').css('top',height2.toString() +"px");
  }
  if(map[40] && height2 <= 510){
    height2 += paddleSpeed;
    $('#rightbumper').css('top',height2.toString() +"px");
  }

  setTimeout(function(){movePaddles()}, refreshRate);
}

function moveBall(vX, vY) {
  const newX = parseInt($('#ball').css('left')) + vX;
  const newY = parseInt($('#ball').css('top')) + vY;
  $('#ball').css('left',newX.toString() + "px");
  $('#ball').css('top',newY.toString() + "px");
  
  let newVX = vX;
  let newVY = vY;

  // collision with top wall
  if (newY <= 195) {
    newVY = Math.abs(vY);
    const snd = new Audio("pong.wav");
    snd.play();
  }

  if (newY >= 590) {
    newVY = -Math.abs(vY);
    const snd = new Audio("pong.wav");
    snd.play();
  }

  // collision with P1 paddle
  if(newX - parseInt($('#leftbumper').css('left')) <= -vX && newX - parseInt($('#leftbumper').css('left')) >= 0 && vX < 0){
    if(newY - parseInt($('#leftbumper').css('top')) >= 0 && newY - parseInt($('#leftbumper').css('top')) <= 80){
      
      let theta = 45;
      if(vY > 0){
        theta = (newY - parseInt($('#leftbumper').css('top')))/80 * 90;
        newVY = 1;
      }else if(vY <= 0){
        theta = (80 - (newY - parseInt($('#leftbumper').css('top'))))/80 * 90;
        newVY = -1;
      }
      theta = 3*theta/5 + 18;

      newVY = Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.cos(theta*Math.PI/180);
      newVX = Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.sin(theta*Math.PI/180);

      const snd = new Audio("pong2.wav");
      snd.play();
    }
  }

  // collision with P2 paddle
  if(newX - parseInt($('#rightbumper').css('left')) >= -vX && newX - parseInt($('#rightbumper').css('left')) <= 0 && vX > 0){
    if(newY - parseInt($('#rightbumper').css('top')) >= 0 && newY - parseInt($('#rightbumper').css('top')) <= 80){

      let theta = 45;
      if(vY > 0){
        theta = (newY - parseInt($('#rightbumper').css('top')))/80 * 90;
        newVY = 1;
      }else if(vY <= 0){
        theta = (80 - (newY - parseInt($('#rightbumper').css('top'))))/80 * 90;
        newVY = -1;
      }
      theta = 3*theta/5 + 18;

      newVY *= Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.cos(theta*Math.PI/180);
      newVX = -Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.sin(theta*Math.PI/180);

      const snd = new Audio("pong2.wav");
      snd.play();
    }
  }

  if(newX < 400){
    $('#ball').css('left',"800px");
    $('#ball').css('top',"368px");
    newVX = -1*ballSpeed;
    newVY = ballSpeed;
    $('#rightscore').html(parseInt($('#rightscore').html() )+1);
  }

  if(newX > 1190){
    $('#ball').css('left',"800px");
    $('#ball').css('top',"368px");
    newVX = ballSpeed;
    newVY = ballSpeed;
    $('#leftscore').html(parseInt($('#leftscore').html() )+1);
  }
  
  setTimeout(function(){moveBall(newVX,newVY)}, refreshRate);
}

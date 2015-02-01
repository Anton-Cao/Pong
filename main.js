var start = false;

$(document).ready(function(){
  var map = {87:false,83:false,38:false,40:false};

  $(document).keydown(function (e) {
    if(!start){
      start = true;
      moveBall(parseInt(ballX),parseInt(ballY),4,4);
    }


    var height1 = $('#leftbumper').css('top');
    height1 = height1.substring(0,height1.length - 2);
    height1 = parseInt(height1);

    var height2 = $('#rightbumper').css('top');
    height2 = height2.substring(0,height2.length - 2);
    height2 = parseInt(height2);

    if(e.keyCode in map){
      map[e.keyCode] = true;
      if(map[87] && height1 >= 200){
        height1-=7;
        $('#leftbumper').css('top',height1.toString() +"px");
      }
      if(map[83] && height1 <= 510){
        height1+=7;
        $('#leftbumper').css('top',height1.toString() +"px");
      }
      if(map[38] && height2 >= 200){
        height2-=7;
        $('#rightbumper').css('top',height2.toString() +"px");
      }
      if(map[40] && height2 <= 510){
        height2+=7;
        $('#rightbumper').css('top',height2.toString() +"px");
      }
    }
  });

  $(document).keyup(function (e) {
      if(e.keyCode in map){
        map[e.keyCode] =false;
      }
  });


  var ballX = $('#ball').css('left');
  var ballY = $('#ball').css('top');
  ballX = ballX.substring(0,ballX.length - 2);
  ballY = ballY.substring(0,ballY.length - 2);
  //moveBall(parseInt(ballX),parseInt(ballY),4,4);


});

function moveBall(x,y,vX,vY){
  var newX = x+vX;
  var newY = y+vY;
  $('#ball').css('left',newX.toString() + "px");
  $('#ball').css('top',newY.toString() + "px");
  var newVX = vX;
  var newVY = vY;
  if(newY >= 590 || newY <= 195){
    newVY = -vY;
    var snd = new Audio("pong.wav");
    snd.play();
  }
  if(newX - parseInt($('#leftbumper').css('left')) <= 6 && newX - parseInt($('#leftbumper').css('left')) >= 0 && vX < 0){
    if(newY - parseInt($('#leftbumper').css('top')) >= 0 && newY - parseInt($('#leftbumper').css('top')) <= 80){
      //newVX = -vX;

      //New:
      var theta = 45;
      if(vY > 0){
        theta = (newY - parseInt($('#leftbumper').css('top')))/80 * 90;
        newVY = 1;
      }else if(vY <= 0){
        theta = (80 - (newY - parseInt($('#leftbumper').css('top'))))/80 * 90;
        newVY = -1;
      }
      theta = 3*theta/5 + 18;

      newVY *= Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.cos(theta*Math.PI/180);
      newVX = Math.sqrt(Math.pow(vX,2) + Math.pow(vY,2)) * Math.sin(theta*Math.PI/180);
      console.log(newVX);

      //End new

      var snd = new Audio("pong2.wav");
      snd.play();
    }
  }

  if(newX - parseInt($('#rightbumper').css('left')) >= -6 && newX - parseInt($('#rightbumper').css('left')) <= 0 && vX > 0){
    if(newY - parseInt($('#rightbumper').css('top')) >= 0 && newY - parseInt($('#rightbumper').css('top')) <= 80){
      //newVX = -vX;

      //New:
      var theta = 45;
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


      //End new


      var snd = new Audio("pong2.wav");
      snd.play();
    }
  }

  if(newX <= 400){
    newX = 800;
    newY = 368;
    newVX = -4;
    newVY = 4;
    $('#rightscore').html(parseInt($('#rightscore').html() )+1);
  }

  if(newX >= 1190){
    newX = 800;
    newY = 368;
    newVX = 4;
    newVY = 4;
    $('#leftscore').html(parseInt($('#leftscore').html() )+1);
  }

  //$('#one').html(parseInt($('.bumper').css('height')));
  //$('#two').html(parseInt($('#leftbumper').css('top')));
  setTimeout(function(){moveBall(newX,newY,newVX,newVY)}, 12);
}

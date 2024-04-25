const can = canvas;
const ctx = can.getContext("2d");


// Values and default Values
const W=can.width; // Canvas width
const H=can.height; // Canvas height

// disable right-click context-menu
can.oncontextmenu = function (e) { e.preventDefault(); };
// on the mouse move in the canvas
can.addEventListener("mousemove", function () { Mouse.MouseMove(event, false) }, false);
// on the mouse click down in the canvas
can.addEventListener("mousedown", function () { Mouse.MouseClick(event) }, false);
// on the mouse click up in the canvas
can.addEventListener("mouseup", function () { Mouse.MouseClick(event) }, false);

// on the touch move in the canvas
/* Touches */can.addEventListener("touchmove", function () { Mouse.TouchMove(event, true); event.preventDefault();}, false);
// on touch start in the canvas
/* Touches */can.addEventListener("touchstart", function () { Mouse.TouchMove(event,true); Mouse.TouchClick(); event.preventDefault(); }, false);
// on touch end in the canvas
/* Touches */can.addEventListener("touchend", function () { if (Mouse.Left != 0 && Mouse.Left != 1) Mouse.Left = 0; event.preventDefault(); }, false);
can.tabIndex = 1; // necessary to enable the click in the canvas

// Game variables
var screen_code = [-1, -1, -1, -1]; // the 4 numbers in the main screen, -1 = will result in not draw anything
var screen_code_index = 0; // the current index of the next number to be put in screen_code after the player click in the numpad buttons
var previous_code = []; // are array of all the previous screen_code input of 4 code, use to draw in the second screen
var secret_code = [0, 0, 0, 0]; // The hidden secret code that the player tries to discover.
var tried_left = 0; // the amount of tries left
var timer = 0; // the game timer by seconds.
var player_started = false; // If a player makes his first move in a new game, it becomes 'true'

// Game Object
const G = {
  isReady:false // show if game is ready to start or not
  , state:"idle" // state, determine the state of the game
  , code_index:0 // selected mode index
  , sound:true // sound on/off .. true/false
  ,newGame(){
    G.state = 'idle'; // reset game state 'idle'
    G.game_end=false; // set game end state to 'false'

    // reset game variables
    screen_code = [-1, -1, -1, -1];
    screen_code_index = 0;
    previous_code = [];
    tried_left = TRIED_LEFT;
    timer = TIMER;
    player_started = false;

    // create new secret code
    for (var i = 0; i < 4; i++) {
      secret_code[i] = irandom(9);
    }
  }
  ,check_if_all_loaded(){
    // Before start the game we going check if all the images have been loaded
    for(var i=0, len=Img_arr.length ;i<len; i++){
      if(!(Img_arr[i].complete && Img_arr[i].naturalHeight !== 0)) return;
    }
    // If you reach this line that mean all images have been loaded
    G.isReady=true; // Set the game are ready to start
    G.newGame(); // start new game
  }
  ,loop(){ // Game loop
    ctx.clearRect(0, 0, W, H);
    if(HowToPlay){ G.DrawHowToPlay(); return;} // if HowToPlay is 'true' show how to play page and skip the other codes below

    ctx.drawImage(img.safe ,0, 0); // draw the safe image

    // draw and update numbers buttons
    ctx.fillStyle = "white"; ctx.font = "70px font1"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (var b of NUMPAD) {
      if(draw_numpad(b) && Mouse.Down('Left')) btn_numpad_clicked(b.value)
    }

    draw_screen_code(); // draw screen code
    draw_second_screen() // draw second screen

    // if game still not ended
    if(!G.game_end){
      // if the players start his first move and timer is bigger than 0
      if(player_started && timer > 0){
        timer -= 30/1000; // This will decrease the timer by the frame speed of the game
        // if timer reaches 0
        if(timer <= 0){
          G.SetGameEnd(false); // End the game and set (player has lost the game).
          timer=0;
        }
      }
      ctx.drawImage(img.screen_locked, TSB_X, TSB_Y, TSB_W, TSB_H); // draw screen_locked image
    }
    else {
      // if player win
      if(G.state=='win') ctx.drawImage(img.screen_opened, TSB_X, TSB_Y, TSB_W, TSB_H);  // draw screen_opened image
      // else if player lose
      else if(G.state=='lose') ctx.drawImage(img.screen_alert, TSB_X, TSB_Y, TSB_W, TSB_H);  // draw screen_alert image
    }

    /* top buttons */
    // Draw reset button.. Active after you click in it.
    if(draw_btn(RT_X, RT_Y, RT_W, RT_H, img.btn_reset) && Mouse.Down('Left')) G.newGame(); // reset button


    // Draw Full Screen button.. Active after you click in it.
    if(draw_btn(FS_X, FS_Y, FS_W, FS_H, img.btn_fullscreen) && Mouse.Down('Left')) sys.swithFullscreen(); // full screen button
    // Draw sound on/off button.. Active after you click in it.
    if(draw_btn(SN_X, SN_Y, SN_W, SN_H, G.sound ? img.btn_sound_on : img.btn_sound_off) && Mouse.Down('Left')) {
      G.sound = !G.sound;// switch between true to false or false to true
    }
    // Draw Full btn how to play button.. Active after you click in it.
    if(draw_btn(HTP_X, HTP_Y, HTP_W, HTP_H, img.btn_how_to_play) && Mouse.Down('Left')) HowToPlay = true;
  }
  ,DrawHowToPlay(){
    // draw everything in how to play the game
    ctx.fillStyle = "white"; ctx.font = "30px font1"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    draw_multi_text(W/2, 50, 40, [
      'Number lock puzzle: try crack the code to open the lock?',
      '',
      TRIED_LEFT+' clues on 4-digit codes are presented in the number lock puzzle.',
      'The correct 4-digit code to open the lock must be determined',
      'in '+TIMER+' seconds using the clues.',
      '',
      'An example of how to use the clues',
    ])
    ctx.fillStyle = COLOR_FIND; ctx.fillText('1', W/2-75, 340);
    ctx.fillStyle = COLOR_EXIST; ctx.fillText('4', W/2-25, 340);
    ctx.fillStyle = COLOR_DEFAULT; ctx.fillText('0', W/2+25, 340);
    ctx.fillStyle = COLOR_DEFAULT; ctx.fillText('9', W/2+75, 340);
    draw_multi_text(W/2, 380, 40, [
      'Number 1 here is in the secret code and in the current place.',
      'Number 4 here is in the secret code but not in the current place.',
      'Numbers 0 and 9 not included in the secret code.',
      '',
      'You win the game if you correctly guess the code.',
      'You lose the game if you run out of tries left or the timer ends.',
    ])

    // if mouse is clicked, close 'how to play' page
    if(Mouse.Down('Left')) HowToPlay = false;
  }
  ,SetGameEnd(win){
    // End the game
    G.game_end=true; // set game end
    if(win) G.state="win"; // if win
    else G.state="lose"; // else, lose
  }
  ,PlaySound(s){
    if(G.sound){
      playSound(s);
    }
  }
};

// draw numpad button
function draw_numpad(np){
  const x = NUMPAD_X+np.x*NUMPAD_PADDING_W; // get the correct draw x position
  const y = NUMPAD_Y+np.y*NUMPAD_PADDING_H; // get the correct draw y position
  var hover = Mouse.Square(x, y, NUMPAD_W, NUMPAD_H); // equal to 'true', if mouse hover this image
  // draw button
  // If the mouse is hovering over this button and the left mouse button is pressed
  if(hover && Mouse.Press('Left')){
    ctx.drawImage(img.safe_btn_down, x, y, NUMPAD_W, NUMPAD_H); // draw clicked button
    ctx.fillText(np.value, x+Math.floor(NUMPAD_W*0.5), y+Math.floor(NUMPAD_H*0.55)); // draw the button value (0-9)
  }
  // else
  else {
    ctx.drawImage(img.safe_btn, x, y, NUMPAD_W, NUMPAD_H);  // draw button
    ctx.fillText(np.value, x+Math.floor(NUMPAD_W*0.5), y+Math.floor(NUMPAD_H*0.5)); // draw the button value (0-9)
  }

  return hover; // return the result of the mouse hovering over this button or not.
}

// This function calls on the numpad button clicked. This function puts a new value in screen_code at the index that is stored in screen_code_index.
function btn_numpad_clicked(n) {
  if(G.game_end) return; // If the game ends, return and do nothing.
  if(screen_code_index == 0) screen_code = [-1, -1, -1, -1];// if screen_code_index equal to 0, clear the previous screen_code values
  screen_code[screen_code_index] = n; // put a new value in screen_code at the index that is stored in screen_code_index
  screen_code_index++; // move to the next index for the next time this function is called.
  // if screen_code_index passed the end index of screen_code
  if(screen_code_index >= 4){
    screen_code_index = 0; // reset it to index 0
    check_the_screen_code_result(); // Check the result of the full inputted code on the main screen.
  }
  player_started = true; // The player has made his first move, so the timer can start running now.
  G.PlaySound(sound.beep); // play sound beep
}

// check the screen code result
function check_the_screen_code_result() {
  var player_win = true; // first we gonna assume that the player win
  // check if screen_code values math every secret_code values and in the current place
  for (var i = 0; i < 4; i++) {
    if(screen_code[i] != secret_code[i]) player_win = false;// if values not mathed, set player have not win yet
  }

  // if the player win
  if(player_win){
    G.SetGameEnd(true); //End the game and set (player has win the game).
    G.PlaySound(sound.correct); // play sound correct
    alert("Flag: Logic_Puli}")
  }
  else {
    var clone_array = [...screen_code]; // clone the current screen_code array
    previous_code.push(clone_array); // put the clone array in previous_code
    if(previous_code.length > 8) previous_code.shift(); // if previous_code length are more than 8, delete the first result
    tried_left--; // decrease the amount of tries left
    // if amount of tries left reach 0
    if(tried_left <= 0){
      G.SetGameEnd(false); //End the game and set (player has lost the game).
    }
    G.PlaySound(sound.error); // play sound error
  }
}

// draw screen code
function draw_screen_code() {
  // Set the font settings.
  ctx.fillStyle = "white"; ctx.font = "90px font1"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  // draw the main screen code
  for (var i = 0; i < 4; i++) {
    if(screen_code[i] == -1) continue; // if value equal to -1, skip
    // select the correct color for this value
    if(screen_code[i] == secret_code[i]) ctx.fillStyle = COLOR_FIND; // if the value in the secret code in the current place.
    else if(secret_code.indexOf(screen_code[i]) != -1) ctx.fillStyle = COLOR_EXIST; // else if the value in the secret code but not in the current place.
    else ctx.fillStyle = COLOR_DEFAULT; // else, use this default color
    // draw the number value
    ctx.fillText(screen_code[i], 150+i*80, 230);
  }
}

// draw second screen
function draw_second_screen() {
  var x = 140, y = 315;
  ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.font = "40px font1"; ctx.fillStyle = "white";
  // draw the amount of tries left and the timer text
  draw_multi_text(x+200, y, 43, [
    'TRIED',
    'LEFT',
    tried_left,
    '',
    'TIME',
    'LEFT',
    Math.ceil(timer),
  ])

  // draw all the previous codes
  ctx.font = "34px font1";
  var i, j, len = previous_code.length;
  for(i = 0; i < len; i++) {
    var p = previous_code[i];
    // draw one line of previous code at the index of {i}
    for(j = 0; j < 4; j++) {
      // set the correct color of p[j] value
      if(p[j] == secret_code[j]) ctx.fillStyle = COLOR_FIND; // if the value in the secret code in the current place.
      else if(secret_code.indexOf(p[j]) != -1) ctx.fillStyle = COLOR_EXIST; // else if the value in the secret code but not in the current place.
      else ctx.fillStyle = COLOR_DEFAULT; // else, use this default color
      // draw the number value
      ctx.fillText(p[j], x+30*j, y+40*i);
    }
  }
}

// draw multi text function
function draw_multi_text(x, y, h, ta){
  for (var t of ta) {
    ctx.fillText(t, x, y);
    y+=h;
  }
}

// draw button function
function draw_btn(x, y, w, h, image){
  var r = Mouse.Square(x,y,w,h); // equal to 'true', if mouse hover this image
  ctx.drawImage(image, x, y); // draw image
  return r; // return the result of r
}

var Sound_arr=[];
var sound ={
  beep:loadSound("beep.wav", 5),
  error:loadSound("error.wav", 2),
  correct:loadSound("correct.wav"),
};

// array to contains all used images in the game
var Img_arr=[];
// load all images
var img = {
  safe:newImage('safe.png'),
  safe_btn:newImage('safe_btn.png'),
  safe_btn_down:newImage('safe_btn_down.png'),

  btn_how_to_play:newImage('btn_how_to_play.png'),
  btn_fullscreen:newImage('btn_fullscreen.png'),
  btn_sound_on:newImage('btn_sound_on.png'),
  btn_sound_off:newImage('btn_sound_off.png'),
  btn_reset:newImage('btn_reset.png'),

  screen_locked:newImage('screen_locked.png'),
  screen_opened:newImage('screen_opened.png'),
  screen_alert:newImage('screen_alert.png'),
};


// animate main loop
var fps=30, fpsInterval=1000/fps, then = Date.now(), elapsed;
function animate() {
  requestAnimationFrame(animate); // request another frame
  var now = Date.now(); elapsed = now - then; // calc elapsed time since last loop
  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval); // Get ready for next frame by setting then=now, but also, adjust for fpsInterval not being multiple of 16.67
    if(G.isReady){ // if game ready call the game loop
      G.loop();
    }
    else{ // else check if all images is loaded
      G.check_if_all_loaded();
    }
    /* Mouse */Mouse.Update();
  }
}
animate(); // Start animate main loop

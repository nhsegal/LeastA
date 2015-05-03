var nodeNumSlider;

var pChoice0;
var pChoice1;
var pChoice2;
var pChoice3;
var pChoice4;
var pChoice5;

var nodes = [];
var potential = 1;
var nodeNum = 9;
var initialAction = 1;
var initialU = 1;
var initialK = 0;
var scaleFactor;
var most=100;
var K_;
var U_;
var reset;



function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent("myContainer");
  textSize(16);
  textFont("Consolas");
  textStyle(NORMAL);

  nodeNumSlider = createSlider(3,17,9);
  nodeNumSlider.parent("sliderPos");
  nodeNumSlider.size(240);  
  
  reset = createButton('Reset', 1);
  reset.parent("myContainer2");

  reset.mousePressed(function()  {
    nodes.length = 0;
    nodeNum = nodeNumSlider.value();
    for (var i = 0; i<nodeNum; i++) {
      nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
    }
    initialU = calculateU();
    initialK = calculateK();
    initialAction = calculateK() - calculateU();  
     most = 10000;// max(initialAction, initialU, abs(initialK));  
  });

  stroke(100);
  noStroke();
  for (var i = 0; i<nodeNumSlider.value(); i++) {
    nodes.push(new Node(map(i, 0, nodeNumSlider.value()-1, 30, width-80), height/2));
  }
  initialU = calculateU();
  initialK = calculateK();
  initialAction = calculateK() - calculateU();  
  most = 10000;//max(initialAction, initialU, abs(initialK));  
}

function draw() {
  background(255);
  strokeWeight(2);
  grid(true);
  myFunction();

  if (potential == 3) {
    strokeWeight(2);
    stroke(0, 250, 0);
    line(0, width/2+height/2, width/2+height/2, 0);
  }

  if (potential == 4) {
    fill(0, 255, 0);
    ellipse(width/2, height/2, 12, 12);
  }

  if (potential == 5) {
    strokeWeight(2);
    stroke(120);  
    for (var i = 0; i<height; i=i+10) {
      line(width/2, i, width/2, i+5);
    }
  }

  if (keyIsPressed===true) {
    optimizer();
  }

  nodeNumSlider.mouseReleased(numCheck);
  
  for (var i = 0; i<nodes.length; i++) {
    nodes[i].clickedOn();
    nodes[i].display();
    if (i>0) {
      stroke(0);
      strokeWeight(2);
      line(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y);
    }
  }
  energyBars(); 
}

function grid(y) {
  if (y == true) {
    strokeWeight(0.5);
    stroke(150);
    for (var i = 1; i<9*2; i++) {
      line(width, .5*i*height/9, 0, .5*i*height/9);
    }
    for (var i = 1; i<9*4; i++) {
      line(.5*i*height/9, 0, .5*i*height/9, height);
    }
  }
}

function Node(ix, iy) {
  this.x = ix;
  this.y = iy;
  this.selected = false;

  this.display = function() {
    noStroke();
    if (this.selected == false) {
      fill(0);
    }
    else {
      fill(255, 0, 0);
    }
    ellipse(this.x, this.y, 8, 8);
  }

  this.clickedOn = function() {
    if (this.selected == true) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
}

function calculateK() {
  var K = 0;
  for (var i=0; i<nodes.length; i++) {  
    if (i>0) {
      K = K + sq(dist(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y));
    }
  }
  K = K*(nodeNum-1);
  return K;
}

function calculateU() {
  U = 0;
  for (var i=0; i<nodes.length; i++) {  
    U = U + getPE(nodes[i]);
  }
  return U;
}

function getPE(q) {
  switch (potential) {
  case '1': //linear grad upward
    return -(2500*q.y)/nodeNum + 1500000/nodeNum;  //-(200/(nodeNum)*(q.y) -380000/(nodeNum)  
    
  case '2': 
    return -(2900*q.x)/nodeNum + 1500000/nodeNum;      //(20000/(nodeNum*nodeNum)*(q.x) - 1900000/(nodeNum*nodeNum) );  
      
  case '3': 
    if (q.x + q.y > width/2 + height/2 ) {
      return -(2000000/nodeNum);
      }
      else {
        return 0;
      }
    break;

  case '4': 
    return -(76000000/nodeNum)*(1/(dist(q.x, q.y, width/2, height/2)));

  case '5':
    return (2.5/sqrt(nodeNum))*(sq(q.x-width/2));

  default:
    return 0;
  }
 }

function numCheck(){
if (nodeNum != nodeNumSlider.value()){
  nodes.length = 0;
  nodeNum = nodeNumSlider.value();
  for (var i = 0; i<nodeNum; i++) {
    nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
  }
  initialU = calculateU();
  initialK = calculateK();
  initialAction = calculateK() - calculateU();  
  most = 10000; // max(initialAction, initialU, abs(initialK)); 
  }
}

function mouseClicked() {
  if (mouseButton == LEFT) {
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i];
      if (dist(mouseX, mouseY, p.x, p.y) < 5) {
        nodes[i].selected =  !nodes[i].selected;
        for (var j = 0; j < nodes.length; j++) {
          if (j != i) {
            nodes[j].selected = false;
          }
        }
      }
    }
  }

  if (mouseButton == RIGHT) {
    nodes.length = 0;
    nodeNum = nodeNumSlider.value();
   for (var i = 0; i<nodeNum; i++) {
    nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
  }
  initialU = calculateU();
  initialK = calculateK();
  initialAction = calculateK() - calculateU();  
  most = 10000; //max(initialAction, initialU, abs(initialK)); 
  }
}

function optimizer() {
  var jump = 1;
  if (potential ==3){
    jump = 20;
  }
  for (var j = 0; j<400; j++) {
    for (var i = 1;  i<nodeNumSlider.value()-1; i++) {
      var oldAction = calculateK() - calculateU();
      var tempX = nodes[i].x;
      var tempY = nodes[i].y;
      nodes[i].x = nodes[i].x + randomGaussian()*jump;
      nodes[i].y = nodes[i].y + randomGaussian()*jump;
      if ( calculateK() - calculateU() > oldAction) {
        nodes[i].x  = tempX;
        nodes[i].y = tempY;
      }
    }
  }  
}

function energyBars(){
  stroke(200, 0, 0);
  fill(200, 0, 0);
  var K_ = calculateK();
  var U_ = calculateU();

  rect(width-60, 2*height/3, 10, -(K_/most));
    
  stroke(0, 200, 0);
  fill(0, 200, 0);
  rect(width-40, 2*height/3, 10, -(U_/most));
  fill(0);
   
  stroke(0, 0, 200);
  fill(0, 0, 200);

  rect(width-20, 2*height/3, 10, (-(K_-U_)/most));
  fill(0);
  stroke(0,0,0);
  strokeWeight(0.2);
  textAlign(LEFT);
  text("K", width-60+2, height/6-10);
  text("U", width-40+2, height/6-10);
  text("S", width-20+2, height/6-10);
  text("Kinetic   = ", width/2, 17);

  text("Potential = ", width/2, 34);
  text("Action    =  ", width/2, 51);

  textAlign(RIGHT);
  text(String(Math.round( calculateK()/100 )), width/2 + 155, 17);
  text(String(Math.round( calculateU()/100 )), width/2 + 155, 34);
  text(String(Math.round( calculateK()/100 - calculateU()/100 )), width/2 + 155, 51);




}

function myFunction() {
  var e = document.getElementById("menu1");
  potential = e.options[e.selectedIndex].value;
}
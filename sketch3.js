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
var arrow;
var arrow_x = 100;
var arrow_y = 250;

var path;

var paths = [];


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
    paths.length = 0;
    nodes.length = 0;
    nodeNum = nodeNumSlider.value();
    for (var i = 0; i<nodeNum; i++) {
      nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
    }
   //paths = new Path;
    path.push(nodes);
   // initialU = calculateU();
    //initialK = calculateK();
    //initialAction = calculateK() - calculateU();  
  });

  stroke(100);
  noStroke();
  for (var i = 0; i<nodeNumSlider.value(); i++) {
    nodes.push(new Node(map(i, 0, nodeNumSlider.value()-1, 30, width-80), height/2));
  }
  path = new Path;
  path.push(nodes);
  path.hello();

  //paths[0].getAction(); 

  //initialU = calculateU();
  //initialK = calculateK();
  //initialAction = calculateK() - calculateU();  
  
  arrow = new actionArrow(arrow_x, arrow_y, 10, 20);
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
 
  //arrow.angle = ( paths.getAction() )/4000;
  arrow.display();
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

function Path(_nodes) {
  this.hello = function(){
    console.log("here");
  }

  this.display = function() {     
    for (var i = 0; i<_nodes.length; i++) {
      _nodes[i].clickedOn();
      _nodes[i].display();
      if (i>0) {
        stroke(0);
        strokeWeight(2);
        line(_nodes[i].x, _nodes[i].y, _nodes[i-1].x, _nodes[i-1].y);
      }
    } 
  }

  this.calculateK = function() {
    var K = 0;
    for (var i=0; i<_nodes.length; i++) {  
      if (i>0) {
        K = K + sq(dist(_nodes[i].x, _nodes[i].y, _nodes[i-1].x, _nodes[i-1].y));
      }
    }
    K = K*(nodeNum-1);
    return K;
  }

  this.calculateU = function() {
    var U = 0;
    for (var i=0; i<_nodes.length; i++) {  
      U = U + getPE(_nodes[i]);
    }
    return U;
  }

  this.getAction = function() {
    var pathAction = 0;
    pathAction = this.calculateK() - this.calculateU();
    return pathAction;
  }
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

function splitter() {
  var jump = 10;
  for (var j = 0; j<4; j++) {
    for (var i = 1;  i<nodeNumSlider.value()-1; i++) {
      paths.push(new Path());
    } 
  }
}


function actionArrow(x_, y_, angle_, len_){
  this.x = x_;
  this.y = y_;
  this.angle = angle_;
  this.len = len_;
  
  this.display = function() {
  strokeWeight(2);
  stroke(0);
  //smooth();
    
  push();
    translate(this.x, this.y);
    rotate(this.angle);
    line(0, 0, this.len, 0);
    
    push();
      translate(this.len, 0);
      rotate(atan(PI/6));
      line(0,0, -this.len/10, 0);
    pop();
    
    push();
      translate(this.len, 0);
      rotate(atan(-PI/6));
      line(0,0, -this.len/10, 0);
    pop();
    
  pop(); 
  }
}

function myFunction() {
  var e = document.getElementById("menu1");
  potential = e.options[e.selectedIndex].value;
}
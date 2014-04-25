  var app = require('http').createServer(httpserver);
var b = require('bonescript');

b.pinMode("P9_14", b.OUTPUT);
b.pinMode("P8_13", b.OUTPUT);
b.pinMode("P9_42", b.OUTPUT);

// var state = b.LOW;

// function toggle() {
//     if(state == b.LOW) state = b.HIGH;
//     else state = b.LOW;
//     b.digitalWrite("GPIO_71", state);
// }

app.listen(8080);

function httpserver (req, res) {
  var url = req['url'];
  console.log(url);

  var digitRE = /\/([0-9]\.[0-9])/;

  var timer = null;

  if (url == 'favicon.ico') { }
  
  else if (url == '/pot') {
    timer = setInterval(function() {
      b.analogRead("P9_40", function(reading) {
        var value = reading['value'];
        console.log("Setting P9_14 to the reading from P9_40, " + value);
        b.analogWrite("P9_14", value);
      });
    }, 500);
  }
  
  else if (url.match(digitRE)) {
    clearInterval(timer);
    var value = parseFloat(digitRE.exec(url)[1]);
    console.log("Setting P9_14 to " + value);
    b.analogWrite("P9_14", value);
    b.analogWrite("P8_13", 1-value);    
  }

 else if (url == '/siren') {
    step = 1;
    direction = 1;
    timer = setInterval(function() {
        if (step) {
          b.analogWrite("P9_14", '0.1');
          b.analogWrite("P8_13", '0.9'); 
          b.analogWrite("P9_42", '0.9');       
          step = 0;
        } 
        else {
          b.analogWrite("P9_14", '0.9');
          b.analogWrite("P8_13", '0.1');
          b.analogWrite("P9_42", '0.1');        
          step = 1; 
        }
    }, 300);
  }

 else if (url == '/seq') {
    step = 1;
    timer = setInterval(function() {
        if (step == 1) {
          b.analogWrite("P9_14", '0.0');
          b.analogWrite("P8_13", '0.0'); 
          b.analogWrite("P9_42", '0.9');       
          step ++;
        } 
        else if (step == 2) {
          b.analogWrite("P9_14", '0.0');
          b.analogWrite("P8_13", '0.9');
          b.analogWrite("P9_42", '0.0');        
          step ++; 
        }
        else if (step == 3) {
          b.analogWrite("P9_14", '0.9');
          b.analogWrite("P8_13", '0.0');
          b.analogWrite("P9_42", '0.0');        
          step = 1; 
        }
    }, 120);
  }

 else if (url == '/rand') {
    dt = 120;
    timer = setInterval(function() {
      rand1 = Math.random()*100;
      rand2 = Math.random()*100;
      rand3 = Math.random()*100; 
      dt = Math.random()*5000; 
      console.log(rand1.toPrecision(3));
      if (rand1<50) { b.analogWrite("P9_14", '0.0'); } 
      else { b.analogWrite("P9_14", '0.9'); }

      if (rand2<50) { b.analogWrite("P8_13", '0.0'); } 
      else { b.analogWrite("P8_13", '0.9'); }

      if (rand3<50) { b.analogWrite("P9_42", '0.0'); } 
      else { b.analogWrite("P9_42", '0.9'); }        

    }, dt.toPrecision(4));
  }

  res.writeHead(200);
  res.end("node went!");
}
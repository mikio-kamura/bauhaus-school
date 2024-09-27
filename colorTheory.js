let sketch = function(p) {
    let mode = 'simultaneous';
    
    p.setup = function() {
        p.createCanvas(400, 200);
        p.noStroke();
    }

    p.draw = function() {
        if (mode === 'simultaneous') {
            drawSimultaneousContrast();
        } else if (mode === 'complementary') {
            drawComplementaryContrast();
        }
    }

    function drawSimultaneousContrast() {
        p.background(200);
        p.fill(128);
        p.rect(0, 0, 200, 200);
        p.fill(128);
        p.rect(200, 0, 200, 200);
        p.fill(100);
        p.rect(50, 50, 100, 100);
        p.fill(156);
        p.rect(250, 50, 100, 100);
    }

    function drawComplementaryContrast() {
        p.background(255);
        p.fill(255, 0, 0);
        p.rect(0, 0, 200, 200);
        p.fill(0, 255, 0);
        p.rect(200, 0, 200, 200);
        p.fill(255);
        p.rect(75, 75, 50, 50);
        p.rect(275, 75, 50, 50);
    }

    p.changeMode = function(newMode) {
        mode = newMode;
    }
};

let myp5 = new p5(sketch, 'color-theory-sketch');
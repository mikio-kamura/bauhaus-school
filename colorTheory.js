let sketch = function(p) {
    let selectedColor;
    let colorPicker;
    const neutralGray = 128;

    p.setup = function() {
        let canvas = p.createCanvas(600, 300);
        canvas.parent('sketch-container');
        selectedColor = p.color(200, 100, 50);
        
        colorPicker = p.createColorPicker(selectedColor);
        colorPicker.parent('sketch-container');
        colorPicker.style('margin-top', '10px');
        colorPicker.input(updateColor);
    };

    p.draw = function() {
        p.background(240);
        
        // 左側の大きな正方形（選択した色）
        p.fill(complementaryColor(selectedColor));
        p.noStroke();
        p.rect(0, 0, 300, 300);
        
        // 左側の小さな正方形（ニュートラルグレイ）
        p.fill(neutralGray);
        p.rect(100, 100, 100, 100);
        
        // 右側の大きな正方形（補色）
        p.fill(selectedColor);
        p.rect(300, 0, 300, 300);
        
        // 右側の小さな正方形（ニュートラルグレイ）
        p.fill(neutralGray);
        p.rect(400, 100, 100, 100);
    };

    function updateColor() {
        selectedColor = colorPicker.color();
    }

    function complementaryColor(c) {
        let r = 255 - p.red(c);
        let g = 255 - p.green(c);
        let b = 255 - p.blue(c);
        return p.color(r, g, b);
    }
};

new p5(sketch);
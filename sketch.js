let selectedColor;
let colorPicker;
const neutralGray = 128;

function setup() {
    createCanvas(600, 300);
    selectedColor = color(200, 100, 50);
    
    colorPicker = createColorPicker(selectedColor);
    colorPicker.position(10, height + 10);
    colorPicker.input(updateColor);
}

function draw() {
    background(240);
    
    // 左側の大きな正方形（選択した色）
    fill(selectedColor);
    noStroke();
    rect(0, 0, 300, 300);
    
    // 左側の小さな正方形（ニュートラルグレイ）
    fill(neutralGray);
    rect(100, 100, 100, 100);
    
    // 右側の大きな正方形（補色）
    fill(complementaryColor(selectedColor));
    rect(300, 0, 300, 300);
    
    // 右側の小さな正方形（ニュートラルグレイ）
    fill(neutralGray);
    rect(400, 100, 100, 100);
}

function updateColor() {
    selectedColor = colorPicker.color();
}

function complementaryColor(c) {
    let r = 255 - red(c);
    let g = 255 - green(c);
    let b = 255 - blue(c);
    return color(r, g, b);
}
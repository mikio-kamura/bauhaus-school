let compositionSketch = function(p) {
    let mode = 'point'; // 'point', 'line', 'shape'
    let points = [];
    let lines = [];
    let shapes = [];
    let isDragging = false;
    let draggedIndex = -1;
    let draggedType = ''; // 'point', 'line', 'shape'
    let startPoint = null;
    let currentLine = null;
    let shapeType = 'circle'; // 'circle', 'square', 'triangle'
    let pointBtn, lineBtn, shapeBtn, circleBtn, squareBtn, triangleBtn;

    p.setup = function() {
        let canvas = p.createCanvas(600, 400);
        canvas.parent('composition-sketch-container');
        p.background(250);
        
        // モード切り替えボタン
        createModeButtons();
        
        // クリアボタン
        let clearBtn = p.createButton('クリア');
        clearBtn.parent('composition-sketch-container');
        clearBtn.mousePressed(clearCanvas);
        clearBtn.style('margin', '10px 5px');
        clearBtn.style('padding', '8px 15px');
        clearBtn.style('background-color', '#333');
        clearBtn.style('color', 'white');
        clearBtn.style('border', 'none');
        clearBtn.style('cursor', 'pointer');
    };

    function createModeButtons() {
        let buttonContainer = p.createDiv();
        buttonContainer.parent('composition-sketch-container');
        buttonContainer.style('margin-bottom', '10px');
        
        pointBtn = p.createButton('点');
        pointBtn.parent(buttonContainer);
        pointBtn.mousePressed(() => setMode('point'));
        styleButton(pointBtn, 'point');
        
        lineBtn = p.createButton('線');
        lineBtn.parent(buttonContainer);
        lineBtn.mousePressed(() => setMode('line'));
        styleButton(lineBtn, 'line');
        
        shapeBtn = p.createButton('面');
        shapeBtn.parent(buttonContainer);
        shapeBtn.mousePressed(() => setMode('shape'));
        styleButton(shapeBtn, 'shape');
        
        // 形状タイプ選択（面モード時のみ表示）
        let shapeTypeContainer = p.createDiv();
        shapeTypeContainer.id('shape-type-container');
        shapeTypeContainer.parent('composition-sketch-container');
        shapeTypeContainer.style('display', 'none');
        shapeTypeContainer.style('margin-bottom', '10px');
        
        circleBtn = p.createButton('円');
        circleBtn.parent(shapeTypeContainer);
        circleBtn.mousePressed(() => {
            shapeType = 'circle';
            updateShapeTypeButtons();
        });
        styleButton(circleBtn, 'circle');
        
        squareBtn = p.createButton('正方形');
        squareBtn.parent(shapeTypeContainer);
        squareBtn.mousePressed(() => {
            shapeType = 'square';
            updateShapeTypeButtons();
        });
        styleButton(squareBtn, 'square');
        
        triangleBtn = p.createButton('三角形');
        triangleBtn.parent(shapeTypeContainer);
        triangleBtn.mousePressed(() => {
            shapeType = 'triangle';
            updateShapeTypeButtons();
        });
        styleButton(triangleBtn, 'triangle');
    }

    function styleButton(btn, btnType) {
        btn.style('margin', '5px');
        btn.style('padding', '8px 15px');
        btn.style('border', '1px solid #ccc');
        btn.style('cursor', 'pointer');
        updateButtonStyle(btn, btnType);
    }

    function updateButtonStyle(btn, btnType) {
        let isActive = false;
        if (btnType === 'point' || btnType === 'line' || btnType === 'shape') {
            isActive = mode === btnType;
        } else {
            isActive = shapeType === btnType;
        }
        btn.style('background-color', isActive ? '#DFAA35' : 'white');
        btn.style('color', isActive ? 'white' : '#333');
    }

    function updateShapeTypeButtons() {
        if (circleBtn) updateButtonStyle(circleBtn, 'circle');
        if (squareBtn) updateButtonStyle(squareBtn, 'square');
        if (triangleBtn) updateButtonStyle(triangleBtn, 'triangle');
    }

    function setMode(newMode) {
        mode = newMode;
        
        // モードボタンのスタイルを更新
        if (pointBtn) updateButtonStyle(pointBtn, 'point');
        if (lineBtn) updateButtonStyle(lineBtn, 'line');
        if (shapeBtn) updateButtonStyle(shapeBtn, 'shape');
        
        // 形状タイプ選択の表示/非表示
        let shapeTypeContainer = document.getElementById('shape-type-container');
        if (shapeTypeContainer) {
            shapeTypeContainer.style.display = mode === 'shape' ? 'block' : 'none';
        }
        
        // 形状タイプボタンのスタイルを更新
        updateShapeTypeButtons();
    }

    p.draw = function() {
        p.background(250);
        p.stroke(0);
        p.strokeWeight(2);
        
        // グリッドを描画（薄く）
        drawGrid();
        
        // 線を描画
        for (let line of lines) {
            p.stroke(0);
            p.strokeWeight(2);
            p.line(line.x1, line.y1, line.x2, line.y2);
        }
        
        // 面（形状）を描画
        for (let shape of shapes) {
            p.fill(shape.color);
            p.stroke(0);
            p.strokeWeight(2);
            drawShape(shape);
        }
        
        // 点を描画
        for (let point of points) {
            p.fill(0);
            p.noStroke();
            p.ellipse(point.x, point.y, 8, 8);
        }
        
        // 現在描画中の線を表示
        if (currentLine) {
            p.stroke(100);
            p.strokeWeight(1);
            p.line(currentLine.x1, currentLine.y1, p.mouseX, p.mouseY);
        }
        
        // カーソル表示
        p.noFill();
        p.stroke(150);
        p.strokeWeight(1);
        if (mode === 'point') {
            p.ellipse(p.mouseX, p.mouseY, 8, 8);
        } else if (mode === 'shape') {
            drawShapePreview(p.mouseX, p.mouseY);
        }
    };

    function drawGrid() {
        p.stroke(230);
        p.strokeWeight(1);
        for (let i = 0; i < p.width; i += 20) {
            p.line(i, 0, i, p.height);
        }
        for (let i = 0; i < p.height; i += 20) {
            p.line(0, i, p.width, i);
        }
    }

    function drawShape(shape) {
        if (shape.type === 'circle') {
            p.ellipse(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'square') {
            p.rectMode(p.CENTER);
            p.rect(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
            p.triangle(
                shape.x, shape.y - shape.size/2,
                shape.x - shape.size/2, shape.y + shape.size/2,
                shape.x + shape.size/2, shape.y + shape.size/2
            );
        }
    }

    function drawShapePreview(x, y) {
        let size = 40;
        p.stroke(150);
        p.strokeWeight(1);
        p.noFill();
        if (shapeType === 'circle') {
            p.ellipse(x, y, size, size);
        } else if (shapeType === 'square') {
            p.rectMode(p.CENTER);
            p.rect(x, y, size, size);
        } else if (shapeType === 'triangle') {
            p.triangle(
                x, y - size/2,
                x - size/2, y + size/2,
                x + size/2, y + size/2
            );
        }
    }

    p.mousePressed = function() {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
            return;
        }

        if (mode === 'point') {
            // 既存の点をドラッグできるかチェック
            let clickedPoint = getPointAt(p.mouseX, p.mouseY);
            if (clickedPoint !== -1) {
                isDragging = true;
                draggedIndex = clickedPoint;
                draggedType = 'point';
            } else {
                // 新しい点を追加
                points.push({x: p.mouseX, y: p.mouseY});
            }
        } else if (mode === 'line') {
            startPoint = {x: p.mouseX, y: p.mouseY};
            currentLine = {x1: p.mouseX, y1: p.mouseY, x2: p.mouseX, y2: p.mouseY};
        } else if (mode === 'shape') {
            // 既存の形状をドラッグできるかチェック
            let clickedShape = getShapeAt(p.mouseX, p.mouseY);
            if (clickedShape !== -1) {
                isDragging = true;
                draggedIndex = clickedShape;
                draggedType = 'shape';
            } else {
                // 新しい形状を追加
                let colors = [
                    p.color(200, 50, 50),
                    p.color(50, 150, 200),
                    p.color(200, 150, 50),
                    p.color(100, 200, 100),
                    p.color(150, 100, 200)
                ];
                shapes.push({
                    x: p.mouseX,
                    y: p.mouseY,
                    type: shapeType,
                    size: 60,
                    color: colors[shapes.length % colors.length]
                });
            }
        }
    };

    p.mouseDragged = function() {
        if (isDragging) {
            if (draggedType === 'point') {
                points[draggedIndex].x = p.mouseX;
                points[draggedIndex].y = p.mouseY;
            } else if (draggedType === 'shape') {
                shapes[draggedIndex].x = p.mouseX;
                shapes[draggedIndex].y = p.mouseY;
            }
        } else if (mode === 'line' && currentLine) {
            currentLine.x2 = p.mouseX;
            currentLine.y2 = p.mouseY;
        }
    };

    p.mouseReleased = function() {
        if (mode === 'line' && currentLine) {
            lines.push({
                x1: currentLine.x1,
                y1: currentLine.y1,
                x2: currentLine.x2,
                y2: currentLine.y2
            });
            currentLine = null;
        }
        isDragging = false;
        draggedIndex = -1;
        draggedType = '';
    };

    function getPointAt(x, y) {
        for (let i = points.length - 1; i >= 0; i--) {
            let d = p.dist(x, y, points[i].x, points[i].y);
            if (d < 15) {
                return i;
            }
        }
        return -1;
    }

    function getShapeAt(x, y) {
        for (let i = shapes.length - 1; i >= 0; i--) {
            let shape = shapes[i];
            let d = p.dist(x, y, shape.x, shape.y);
            if (d < shape.size/2 + 10) {
                return i;
            }
        }
        return -1;
    }

    function clearCanvas() {
        points = [];
        lines = [];
        shapes = [];
        currentLine = null;
    }
};

new p5(compositionSketch);


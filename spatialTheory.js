let spatialSketch = function (p) {
    let mode = 'perspective'; // 'perspective', 'grid', 'volume'
    let shapes = [];
    let gridVisible = true;
    let rotationX = 0;
    let rotationY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let cameraZ = 400;
    let perspectiveBtn, gridBtn, volumeBtn, clearBtn;

    p.setup = function () {
        let canvas = p.createCanvas(600, 400, p.WEBGL);
        canvas.parent('spatial-sketch-container');
        p.background(250);

        createModeButtons();
    };

    function createModeButtons() {
        let buttonContainer = p.createDiv();
        buttonContainer.parent('spatial-sketch-container');
        buttonContainer.style('margin-bottom', '10px');

        perspectiveBtn = p.createButton('視点');
        perspectiveBtn.parent(buttonContainer);
        perspectiveBtn.mousePressed(() => setMode('perspective'));
        styleButton(perspectiveBtn, 'perspective');

        gridBtn = p.createButton('グリッド');
        gridBtn.parent(buttonContainer);
        gridBtn.mousePressed(() => setMode('grid'));
        styleButton(gridBtn, 'grid');

        volumeBtn = p.createButton('立体');
        volumeBtn.parent(buttonContainer);
        volumeBtn.mousePressed(() => setMode('volume'));
        styleButton(volumeBtn, 'volume');

        clearBtn = p.createButton('クリア');
        clearBtn.parent(buttonContainer);
        clearBtn.mousePressed(clearShapes);
        clearBtn.style('margin', '5px');
        clearBtn.style('padding', '8px 15px');
        clearBtn.style('background-color', '#333');
        clearBtn.style('color', 'white');
        clearBtn.style('border', 'none');
        clearBtn.style('cursor', 'pointer');
    }

    function styleButton(btn, btnType) {
        btn.style('margin', '5px');
        btn.style('padding', '8px 15px');
        btn.style('border', '1px solid #ccc');
        btn.style('cursor', 'pointer');
        updateButtonStyle(btn, btnType);
    }

    function updateButtonStyle(btn, btnType) {
        let isActive = mode === btnType;
        btn.style('background-color', isActive ? '#DFAA35' : 'white');
        btn.style('color', isActive ? 'white' : '#333');
    }

    function setMode(newMode) {
        mode = newMode;
        if (perspectiveBtn) updateButtonStyle(perspectiveBtn, 'perspective');
        if (gridBtn) updateButtonStyle(gridBtn, 'grid');
        if (volumeBtn) updateButtonStyle(volumeBtn, 'volume');
    }

    p.draw = function () {
        p.background(250);
        p.lights();

        // カメラの位置を調整
        p.camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);

        // マウスドラッグで回転
        if (isDragging) {
            rotationY += (p.mouseX - lastMouseX) * 0.01;
            rotationX += (p.mouseY - lastMouseY) * 0.01;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
        }

        p.rotateY(rotationY);
        p.rotateX(rotationX);

        // グリッドを描画（グリッドモードまたは常に表示）
        if (mode === 'grid' || (gridVisible && mode !== 'grid')) {
            drawGrid();
        }

        // 立体を描画（すべてのモードで表示）
        for (let shape of shapes) {
            drawShape(shape);
        }

        // 視点モード：視点のガイドラインを表示
        if (mode === 'perspective') {
            drawPerspectiveGuide();
        }
    };

    function drawGrid() {
        p.stroke(200);
        p.strokeWeight(1);
        p.noFill();

        let size = 200;
        let divisions = 10;
        let step = size / divisions;

        // XY平面のグリッド
        for (let i = -divisions / 2; i <= divisions / 2; i++) {
            p.beginShape();
            p.vertex(-size / 2, i * step, 0);
            p.vertex(size / 2, i * step, 0);
            p.endShape();

            p.beginShape();
            p.vertex(i * step, -size / 2, 0);
            p.vertex(i * step, size / 2, 0);
            p.endShape();
        }

        // XZ平面のグリッド（奥行き）
        for (let i = -divisions / 2; i <= divisions / 2; i++) {
            p.beginShape();
            p.vertex(-size / 2, 0, i * step);
            p.vertex(size / 2, 0, i * step);
            p.endShape();

            p.beginShape();
            p.vertex(i * step, 0, -size / 2);
            p.vertex(i * step, 0, size / 2);
            p.endShape();
        }
    }

    function drawPerspectiveGuide() {
        p.stroke(150, 150, 255, 150);
        p.strokeWeight(1);
        p.noFill();

        // 消失点への線を表示（透視図法のガイド）
        let vanishingPoint = 300;
        let guideSize = 150;

        // 水平方向のガイドライン
        for (let i = -3; i <= 3; i++) {
            p.beginShape();
            p.vertex(i * guideSize, -guideSize, 0);
            p.vertex(i * guideSize * 0.2, 0, vanishingPoint);
            p.endShape();

            p.beginShape();
            p.vertex(i * guideSize, guideSize, 0);
            p.vertex(i * guideSize * 0.2, 0, vanishingPoint);
            p.endShape();
        }

        // 垂直方向のガイドライン
        for (let i = -2; i <= 2; i++) {
            p.beginShape();
            p.vertex(-guideSize, i * guideSize, 0);
            p.vertex(0, i * guideSize * 0.2, vanishingPoint);
            p.endShape();

            p.beginShape();
            p.vertex(guideSize, i * guideSize, 0);
            p.vertex(0, i * guideSize * 0.2, vanishingPoint);
            p.endShape();
        }
    }

    function drawShape(shape) {
        p.push();
        p.translate(shape.x, shape.y, shape.z);
        p.rotateY(shape.rotationY);
        p.rotateX(shape.rotationX);

        p.fill(shape.color);
        p.stroke(0);
        p.strokeWeight(1);

        if (shape.type === 'box') {
            p.box(shape.size);
        } else if (shape.type === 'sphere') {
            p.sphere(shape.size / 2);
        } else if (shape.type === 'cylinder') {
            p.cylinder(shape.size / 2, shape.size);
        }

        p.pop();
    }

    p.mousePressed = function () {
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
            return;
        }

        // マウスの位置を3D座標に変換
        let mouse3D = screenTo3D(p.mouseX, p.mouseY);

        if (mode === 'volume') {
            // 立体を追加
            let colors = [
                p.color(200, 50, 50, 200),
                p.color(50, 150, 200, 200),
                p.color(200, 150, 50, 200),
                p.color(100, 200, 100, 200),
                p.color(150, 100, 200, 200)
            ];

            let types = ['box', 'sphere', 'cylinder'];
            let type = types[shapes.length % types.length];

            shapes.push({
                x: mouse3D.x,
                y: mouse3D.y,
                z: mouse3D.z,
                type: type,
                size: 60,
                color: colors[shapes.length % colors.length],
                rotationY: 0,
                rotationX: 0
            });
        } else {
            // ドラッグ開始（回転用）
            isDragging = true;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
        }
    };

    p.mouseDragged = function () {
        if (isDragging && mode !== 'volume') {
            rotationY += (p.mouseX - lastMouseX) * 0.01;
            rotationX += (p.mouseY - lastMouseY) * 0.01;
            lastMouseX = p.mouseX;
            lastMouseY = p.mouseY;
        }
    };

    p.mouseReleased = function () {
        isDragging = false;
    };

    p.mouseWheel = function (event) {
        // canvas上にマウスがある場合のみカメラの距離を調整
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            cameraZ += event.delta * 0.5;
            cameraZ = p.constrain(cameraZ, 200, 800);
            return false; // canvas上ではページスクロールを防ぐ
        }
        return true; // canvas外ではページスクロールを許可
    };

    function screenTo3D(screenX, screenY) {
        // 簡易的な3D座標変換
        let x = (screenX - p.width / 2) * 0.5;
        let y = (screenY - p.height / 2) * 0.5;
        let z = 0;
        return { x: x, y: y, z: z };
    }

    function clearShapes() {
        shapes = [];
    }
};

new p5(spatialSketch);


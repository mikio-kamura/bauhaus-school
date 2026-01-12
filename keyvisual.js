// バウハウスキービジュアルキャンバス
(function() {
    const canvas = document.getElementById('bauhausKeyvisual');
    const image = document.getElementById('bauhausKeyvisualImage');
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');

    canvas.height = 600;
    canvas.width = canvas.height / 7 * 10;

    let mouse = { x: -1000, y: -1000 };
    let boxSize = canvas.height / 7;
    let isInteractive = true; // true: インタラクティブ, false: 画像表示
    let animationId = null;

    let boxColors = ['#999', '#444', '#ddd', '#c0392b', '#0055a4', '#f1b82d'];

    // 座標計算関数
    function getBoxPosition(row, col) {
        const startX = boxSize;
        const startY = boxSize;
        const spacingX = boxSize * 2;
        const spacingY = boxSize * 2;
        return {
            x: startX + (col * spacingX),
            y: startY + (row * spacingY)
        };
    }

    // 元の画像に基づいた正方形の配置データ（座標を関数で計算）
    const boxes = [
        // 上段
        { ...getBoxPosition(0, 0), color: boxColors[0], size: boxSize }, // グレー
        { ...getBoxPosition(0, 1), color: boxColors[1], size: boxSize }, // 濃いグレー
        { ...getBoxPosition(0, 2), color: boxColors[2], size: boxSize }, // 薄いグレー

        // 中段
        { ...getBoxPosition(1, 0), color: boxColors[3], size: boxSize }, // 赤
        { ...getBoxPosition(1, 1), color: boxColors[4], size: boxSize }, // 青
        { ...getBoxPosition(1, 2), color: boxColors[5], size: boxSize }, // 黄
        { ...getBoxPosition(1, 3), color: boxColors[3], size: boxSize }, // 赤2

        // 下段
        { ...getBoxPosition(2, 0), color: boxColors[0], size: boxSize }, // グレー 
        { ...getBoxPosition(2, 1), color: boxColors[1], size: boxSize }, // 濃いグレー
        { ...getBoxPosition(2, 2), color: boxColors[2], size: boxSize }, // 薄いグレー
        { ...getBoxPosition(2, 3), color: boxColors[0], size: boxSize }, // グレー 
        { ...getBoxPosition(2, 4), color: boxColors[1], size: boxSize }, // 濃いグレー 
    ];

    // letter-spacingを実装する関数
    function drawTextWithLetterSpacing(text, x, y, letterSpacing) {
        const originalTextAlign = ctx.textAlign;
        const originalTextBaseline = ctx.textBaseline;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        let currentX = x;
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], currentX, y);
            currentX += ctx.measureText(text[i]).width + letterSpacing;
        }

        ctx.textAlign = originalTextAlign;
        ctx.textBaseline = originalTextBaseline;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        boxes.forEach(box => {
            const centerX = box.x + box.size / 2;
            const centerY = box.y + box.size / 2;

            const dx = mouse.x - centerX;
            const dy = mouse.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const threshold = 250; // この距離より近い場合のみ影が伸びる

            // 正方形間の隙間を計算（spacingX - boxSize = boxSize * 2 - boxSize = boxSize）
            const gapBetweenBoxes = boxSize;
            // 他の正方形と干渉しない最大の影の長さ（隙間の80%程度に設定）
            const maxShadowLength = gapBetweenBoxes;
            let shadowLength = 0;

            // 閾値より近い場合は最大まで伸び、それ以外は全くない
            if (distance < threshold) {
                shadowLength = maxShadowLength;
            }

            // 影の描画（黒い平行四辺形、方向は左下に固定）
            if (shadowLength > 0) {
                ctx.fillStyle = '#000'; // 影の色
                ctx.beginPath();
                ctx.moveTo(box.x, box.y);
                ctx.lineTo(box.x + box.size, box.y);
                ctx.lineTo(box.x + box.size, box.y + box.size);
                ctx.lineTo(box.x + box.size - shadowLength, box.y + box.size + shadowLength);
                ctx.lineTo(box.x - shadowLength, box.y + box.size + shadowLength);
                ctx.lineTo(box.x - shadowLength, box.y + shadowLength);
                ctx.closePath();
                ctx.fill();
            }

            // 正方形本体
            ctx.fillStyle = box.color;
            ctx.fillRect(box.x, box.y, box.size, box.size);
        });

        // ロゴテキスト（正方形が描かれていない部分に配置）
        ctx.font = 'bold 65px Futura, "Futura-Medium", "Futura Medium", "Century Gothic", sans-serif';
        ctx.fillStyle = '#000';

        // オーバーレイブレンドモードを設定
        ctx.globalCompositeOperation = 'overlay';

        // 元の位置（210, 215）に近い場所で、正方形の隙間に「BAUHAUS」を配置
        // 中段の列0と列1の間の隙間、上段と中段の間の高さ
        const box1_0 = getBoxPosition(1, 0);
        const box1_1 = getBoxPosition(1, 1);
        const box0_1 = getBoxPosition(0, 1);
        // 中段の列0と列1の間の隙間の中央（テキストの左端を隙間の左側に配置）
        const gapCenterX = box1_0.x + boxSize + 100; // 隙間の左側から少し右に
        // 上段と中段の間の高さ（上段の下から少し下に）
        const gapCenterY = box0_1.y + boxSize + 70;
        drawTextWithLetterSpacing('BAUHAUS', gapCenterX - 100, gapCenterY, 5);

        // 元の位置（390, 385）に近い場所で、正方形の隙間に「SCHOOL」を配置
        // 中段の列1と列2の間の隙間、中段と下段の間の高さ
        const box1_2 = getBoxPosition(1, 2);
        // 中段の列1と列2の間の隙間の中央（テキストの左端を隙間の左側に配置）
        const schoolGapX = box1_1.x + boxSize + 105; // 隙間の左側から少し右に
        // 中段と下段の間の高さ（中段の下から少し下に）
        const schoolGapY = box1_1.y + boxSize + 70;
        drawTextWithLetterSpacing('SCHOOL', schoolGapX - 80, schoolGapY, 5);

        // ブレンドモードをリセット
        ctx.globalCompositeOperation = 'source-over';

        if (isInteractive) {
            animationId = requestAnimationFrame(draw);
        }
    }

    // マウス移動イベント
    window.addEventListener('mousemove', (e) => {
        if (!isInteractive) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // クリックで切り替え
    function toggleView() {
        isInteractive = !isInteractive;
        
        if (isInteractive) {
            // インタラクティブモードに切り替え
            canvas.style.display = 'block';
            image.style.display = 'none';
            draw(); // アニメーション再開
        } else {
            // 画像表示モードに切り替え
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            canvas.style.display = 'none';
            image.style.display = 'block';
        }
    }

    // キャンバスと画像の両方にクリックイベントを追加
    canvas.addEventListener('click', toggleView);
    image.addEventListener('click', toggleView);

    // 初期状態でインタラクティブモードを開始
    draw();
})();


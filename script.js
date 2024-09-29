$(document).ready(function() {
    // タブ切り替え機能
    $('.tab').click(function() {
        $('.tab').removeClass('active');
        $('.theory-content').removeClass('active').hide(); //これによって、activeではなくなる時に、コンテンツを消せる
        $(this).addClass('active'); // thisっていうのが
        $('#' + $(this).data('tab')).addClass('active').show();
    });

    // 初期状態でColor Theoryタブをアクティブにする
    $('.tab[data-tab="color"]').click();
    
    $('.modal-trigger').modaal({
        type: 'inline',
        // animation: 'fade',
        // background: '#000',
        overlay_opacity: 0.1,
        width: 800,
        height: 'auto'
    });

    var element = $('.modal-profile-box p');
        var time = 0;
        var amplitude = 450; // 振幅（ピクセル単位）
        var frequency = 0.2; // 周波数

        function animate() {
            var weight = Math.sin(time) * amplitude;
            element.css('font-weight', weight+450);
            time += frequency;
            requestAnimationFrame(animate);
        }

    // animate();

});
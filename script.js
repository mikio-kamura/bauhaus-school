$(document).ready(function() {
    // タブ切り替え機能
    $('.tab').click(function() {
        $('.tab').removeClass('active');
        $('.content').removeClass('active');
        $(this).addClass('active');
        $('#' + $(this).data('tab')).addClass('active');
    });

    // 色彩対比のボタン機能
    $('#simultaneous-contrast').click(function() {
        myp5.changeMode('simultaneous');
        $('#color-explanation').text('同時対比: 同じ明度のグレーでも、周囲の色によって異なって見えます。');
    });

    $('#complementary-contrast').click(function() {
        myp5.changeMode('complementary');
        $('#color-explanation').text('補色対比: 赤と緑のような補色同士を並べると、互いの色が際立って見えます。');
    });
});
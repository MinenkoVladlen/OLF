$('.card').on('click', function () {
    $(".modal_item").removeClass('hide');
})

$('.modal_close').on('click', function () {
    $(".modal").addClass('hide');
});

$('.btn_add').on('click', function () {
    $('.modal_add').removeClass('hide');
})
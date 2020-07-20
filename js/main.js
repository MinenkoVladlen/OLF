const modalSubmit = document.querySelector(".modal_submit");
const elementsModalSubmit = [...modalSubmit.elements].filter(
    (elem) => elem.tagName !== "BUTTON" && elem.type !== "submit"
);

const infoPhoto = {};
const DBase = JSON.parse(localStorage.getItem('olf')) || [];
const renderBase = [];

function getDB() {
    $('.catalog').text('');
    const local = JSON.parse(localStorage.getItem('olf'));
    $.each(local, function (key, val) {
        renderBase.unshift(val);
    });
    $.getJSON("js/db.json", function (arg, val) {
        $.each(arg, function (key, val) {
            renderBase.push(val);
        });
        renderCard(renderBase)
    });
}

function renderCard(data) {
    $(".catalog").text('');
    $.each(data, function (key, val) {
        let itemBody = `<li class="card" data-id=${val.id}>
            <div class="catalog_img">
              <img src="${val.image}" alt="card img" class="card_img" />
            </div>
            <div class="catalog_description">
              <h3 class="card_header">${val.title}</h3>
              <div class="card_price">${val.price}</div>
            </div>
          </li>`;
        $(".catalog").append(itemBody);
    });
}

function CheckForm() {
    if (elementsModalSubmit.every(elem => elem.value)) {
        $('.modal_button_submit').removeAttr('disabled');
    }
}

function CloseModal() {
    $(".modal").addClass("hide");
    $(".modal_submit").trigger('reset');
    $('.modal_button_submit').prop("disabled", true)
}


function openModal(e) {
    const target = e.target;
    const card = target.closest(".card");
    if (card) {
        let dataAttr = $(card).attr("data-id");
        $(".modal_item").removeClass("hide");
        $.each(renderBase, function (key, val) {
            const item = renderBase.find((item) => item.id == dataAttr);
            $(".modal_abb_content_img").attr("src", item.image);
            $(".modal_submit_h3").text(item.title);
            $(".modal_submit_status").text(item.status === "new" ? "новый" : "Б/У");
            $(".modal_submit_description").text(item.description);
            $(".modal_submit_price").text(item.price);
        });
    }
}

$(".button_add_img").on("change", function (e) {
    const target = e.target;
    const reader = new FileReader();
    const file = target.files[0];
    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener("load", (e) => {
        if (infoPhoto.size < 200000) {
            $(".warning_size_photo").text("");
            infoPhoto.base64 = btoa(e.target.result);
            $(".modal_abb_content_img").attr(
                "src",
                `data:image/jpeg;base64,${infoPhoto.base64}`
            );
        } else {
            $(".warning_size_photo").text("размер файла не должен превышать 200кб");
            $(".button_add_img").val("");
        }
    });
});

$(".modal_button_submit").on("click", function (e) {
    e.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    let counter = $('.card').length;
    itemObj.id = counter++;
    itemObj.image = 'data:image/jpeg;base64,' + infoPhoto.base64;
    DBase.push(itemObj);
    renderBase.unshift(itemObj)
    localStorage.setItem("olf", JSON.stringify(DBase));
    renderCard(renderBase);
    $('.input_search').val('');
    CloseModal();
});
$('.menu_category').on('click', event => {
    $('.input_search').val('');
    $('.catalog').text('');
    const target = event.target;
    if (target.tagName === 'A') {
        const result = renderBase.filter(item => item.category === target.dataset.category)
        renderCard(result);
    }
})

$(".btn_add").click(function () {
    $(".modal_add").removeClass("hide");
    $(".modal_abb_content_img").attr('src', 'img/no_poster.jpg')
});

$('.input_search').on('input', function () {
    $('.not_found').addClass('hide');
    const valueSearch = $('.input_search').val().trim().toLowerCase();
    if (valueSearch.length <= 2) {
        renderCard(renderBase);
    } else {
        $('.catalog').text('')
        const result = renderBase.filter(item => item.title.toLowerCase().includes(valueSearch) ||
            item.description.toLowerCase().includes(valueSearch));
        if (result.length == 0) {
            $('.catalog').text('')
            $('.not_found').removeClass('hide');
        } else {
            $('.catalog').text('')
            renderCard(result);
        }
    }
})

$(document).on('keydown', function(e) {
    if (e.keyCode == 27) {
        CloseModal();
    }
});

$('.logo').click(function () {
    location.reload();
});

$(".modal_close").click(CloseModal);

$('.modal_submit').on("input", CheckForm)

$(".catalog").on("click", openModal);

$(document).ready(getDB);

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
    renderCard(local);
    $.each(local, function (key, val) {
        renderBase.push(val);
    });
    $.getJSON("js/db.json", function (arg, val) {
        renderCard(arg);
        $.each(arg, function (key, val) {
            renderBase.push(val);
        });
    });
}

function renderCard(data) {
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
        $.getJSON("js/db.json", function (data) {
            const item = data.find((item) => item.id == dataAttr);
            if (item) {
                $(".modal_abb_content_img").attr("src", item.image);
                $(".modal_submit_h3").text(item.title);
                $(".modal_submit_status").text(item.status === "new" ? "новый" : "Б/У");
                $(".modal_submit_description").text(item.description);
                $(".modal_submit_price").text(item.price);
            } else {
                $.each(DBase, function (key, val) {
                    const item = DBase.find((item) => item.id == dataAttr);
                    $(".modal_abb_content_img").attr("src", item.image);
                    $(".modal_submit_h3").text(item.title);
                    $(".modal_submit_status").text(item.status === "new" ? "новый" : "Б/У");
                    $(".modal_submit_description").text(item.description);
                    $(".modal_submit_price").text(item.price);
                });
            }
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
    localStorage.setItem("olf", JSON.stringify(DBase));
    getDB();
    CloseModal();
});

$('.menu_category').on('click', event => {
    $('.catalog').text('');
    const target = event.target;
    if (target.tagName === 'A') {
        console.log(renderBase);
        const result = renderBase.filter(item => item.category === target.dataset.category)
        renderCard(result);
        console.log(result);
    }
    //проверка на клик по ссылку, пишется тег всегда с большой "A"
    // if(target.tagName === 'A') {
    //     const result = dataBase.filter(item => item.category === target.dataset.category)
    //     renderCard(result);
    // }
})

$(".modal_close").click(CloseModal);

$(".btn_add").click(function () {
    $(".modal_add").removeClass("hide");
    $(".modal_abb_content_img").attr('src', 'img/no_poster.jpg')
});

$('.modal_submit').on("input", CheckForm)

$(".catalog").on("click", openModal);

$(document).ready(getDB);

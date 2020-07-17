const modalSubmit = document.querySelector(".modal_submit");
const elementsModalSubmit = [...modalSubmit.elements].filter(
  (elem) => elem.tagName !== "BUTTON" && elem.type !== "submit"
);
const DBase = [];
const infoPhoto = {};

let counter = DBase.length;

function getDB() {
  $.getJSON("js/db.json", function (data) {
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
      $(".catalog").prepend(itemBody);
    });
  });
}

function render(test) {
  $.each(test, function (key, val) {
    console.log(test);
    let itemBody = `<li class="card" data-id=${val.id}>
              <div class="catalog_img">
                <img src="${val.image}" alt="card img" class="card_img" />
              </div>
              <div class="catalog_description">
                <h3 class="card_header">${val.title}</h3>
                <div class="card_price">${val.price}</div>
              </div>
            </li>`;
    $(".catalog").prepend(itemBody);
  });
}

function openModal(e) {
  const target = e.target;
  const card = target.closest(".card");
  if (card) {
    let dataAttr = $(card).attr("data-id");
    $(".modal_item").removeClass("hide");
    $.getJSON("js/db.json", function (data) {
      const item = data.find((item) => item.id == dataAttr);
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

  console.log(infoPhoto);
});

$(".modal_button_submit").on("click", function (e) {
  e.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    console.log((itemObj[elem.name] = elem.value));
  }
  itemObj.id = counter++;
  DBase.push(itemObj);
  console.log(DBase);
  CloseModal();
});

function CloseModal() {
  $(".modal").addClass("hide");
}

$(".modal_close").click(CloseModal);

$(".btn_add").click(function () {
  $(".modal_add").removeClass("hide");
});

$(".catalog").on("click", openModal);

$(document).ready(getDB);

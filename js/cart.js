let rendercart = document.querySelector("tbody");
let notiDelete = document.querySelector(".toast-cart");
let outofstock = document.querySelector(".toast-mesage-cart");
let formListOrder = document.querySelector("#form-list-order");
let cartWrapp = document.querySelector(".cart-wrap");
let totalElement = document.querySelector(".cart__finally-total");
let listCart = getLocalStorage(keyLocalStorageItemCart);
function reloadCart() {
  listCart = listCart.filter((item) => item !== null);
  let totals;
  if (listCart) {
    let htmls = listCart.map((item, id) => {
      return `<tr>
                        <td>
                            <img class="cart__img"
                                src=${item.url}
                                alt="">
                            <div class="cart__info">
                                <h4 class="cart__head">${item.name}</h4>
                                <span class="cart__qnt">Quantity: ${item.soluong}</span>
                            </div>
                        </td>
                        <td>
                            <span class="cart__remove" onclick="changeqnt(${id},${item.count - 1},${item.soluong})">-</span>
                            <span class="cart__item-qnt">${item.count}</span>
                            <span class="cart__add" onclick="changeqnt(${id},${item.count + 1},${item.soluong})">+</span>
                        </td>
                        <td>
                            <span class="cart__subprice">${item.price}</span>
                        </td>
                        <td>
                            <span class="cart__total">${handleTotal(item.count, item.price)}</span>
                        </td>
                        <td>
                            <i class="fa-solid fa-xmark normal-cart__clear-icon"onclick="handleDelete(${id})"></i>
                        </td>
                    </tr>`;
    });

    totals = listCart.reduce((total, cur) => {
      return total + cur.count * cur.price;
    }, 0);

    rendercart.innerHTML = htmls;
  }
  totalElement.innerText = `Total: ${totals}`;

  emptyCart(listCart);

  return { listCart, totals };
}

reloadCart();

function changeqnt(id, quantity, max) {
  if (quantity > max) {
    return (
      (notiDelete.style.display = "block"),
      (outofstock.innerText = "Số lượng đã hết"),
      setTimeout(() => {
        notiDelete.style.display = "none";
      }, 1000)
    );
  }
  if (quantity === 0) {
    if (confirm("bạn có muốn xoá không")) {
      delete listCart[id];
      notiDelete.style.display = "block";
      outofstock.innerText = "Sản phẩm đã bị xóa";
      setTimeout(() => {
        notiDelete.style.display = "none";
      }, 1000);
    }
  } else {
    listCart[id].count = quantity;
  }
  reloadCart();
}

function handleTotal(quantity, price) {
  return quantity * price;
}
//IIFE
const handleDelete = (id => {
  return () => {
    if (confirm("bạn có muốn xoá không")) {
      listCart.splice(id, 1);
      notiDelete.style.display = "block";
      outofstock.innerText = "Sản phẩm đã bị xóa";
      setTimeout(() => {
        notiDelete.style.display = "none";
      }, 1000);
      reloadCart();
    }
  };
})();


function emptyCart(data) {
  if (!data || data.length === 0) {
    formListOrder.classList.add("hidden");
    cartWrapp.classList.add("cart-wrap-has--no-cart");
    saveLocalStorage(keyLocalStorageItemCart, []);
  }
}
let buyItem = document.querySelector(".cart__control-buy");
let modelForm = document.querySelector(".model");
let btnOff = document.querySelector(".overlay");
let clearForm = document.querySelector(".form__header-icon");
let exitForm = document.getElementById("control-exit");
let submitform = document.querySelector("#sumit-form");

buyItem.addEventListener("click", function (e) {
  e.preventDefault();
  let { listCart, totals } = reloadCart();
  infomation.listOrder = listCart;
  infomation.totals = totals;
  modelForm.classList.remove("hidden");
});

btnOff.addEventListener("click", function (e) {
  modelForm.classList.add("hidden");
});

clearForm.addEventListener("click", function (e) {
  modelForm.classList.add("hidden");
});

exitForm.addEventListener("click", function (e) {
  e.preventDefault();
  modelForm.classList.add("hidden");
});

let province = document.querySelector("#province");
let district = document.querySelector("#district");
let ward = document.querySelector("#ward");


getDataJsonServer(renderProvince, "p");

function renderProvince(data) {
  let html = data.map(
    (data) => `<option value=${data.code}>${data.name}</option>`
  );
  let htmls = ['<option value="">-- Chọn Tỉnh/Thành Phố --</option>', ...html];

  province.innerHTML = htmls.join("");
  province.onchange = getDistrictByProvinceID;
}

function getDistrictByProvinceID(e) {
  let id = parseInt(e.target.value);
  if (id) {
    getDataJsonServer(renderDistrict, "d");
    function renderDistrict(data) {
      let listdict = data.filter((data) => data.province_code === id);
      let htmldict = listdict.map(
        (data) => `<option value=${data.code}>${data.name}</option>`
      );

      let htmldicts = [
        '<option value="">-- Chọn Huyện/Quận --</option>',
        ...htmldict,
      ];
      district.innerHTML = htmldicts.join("");

      district.onchange = getWardsByDistrictID;
    }
  }

  ward.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>';
}

function getWardsByDistrictID(e) {
  let key = parseInt(e.target.value);

  if (key) {
    getDataJsonServer(renderWard, "w");
    function renderWard(data) {
      let listward = data.filter((data) => data.district_code === key);
      let htmlward = listward.map(
        (data) => `<option value=${data.code}>${data.name}</option>`
      );

      let htmlwards = [
        '<option value="">-- Chọn Phường/Xã --</option>',
        ...htmlward,
      ];
      ward.innerHTML = htmlwards.join("");
    }
  }
}
const randomListID = [];
const randomBillID = () => {
  let id = Math.random().toString(16).substring(2, 8);
  while (randomListID.includes(id)) {
    id = Math.random().toString(16).substring(2, 8);
  }
  randomListID.push(id);
  return id;
};
function getDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${day}/${month}/${year}`;
}
infomation.id = randomBillID();
infomation.day = getDate();

function compareData(listBefore, listAfter) {
  listAfter.forEach((afterPro) => {
    let idsp = afterPro.id;
    listBefore.forEach((prevPro) => {
      if (idsp === prevPro.id) {
        let conlai = prevPro.soluong - afterPro.count;
        prevPro.soluong = conlai;
      }
    });
  });
  console.log(listBefore)
  saveLocalStorage(keyLocalStorageListSP, listBefore);
}
let form = new validate("#register-form");

form.onsubmit = function (formData) {
  infomation.infoBuyer = formData;
  modelForm.classList.add("hidden");
  formListOrder.classList.add("hidden");
  cartWrapp.classList.add("cart-wrap-has--no-cart");
  saveLocalStorage(keyLocalStorageItemCart, []);
  saveLocalStorage(listInfo, infomation);
  let listData = getLocalStorage(keyLocalStorageListSP) || [];
  compareData(listData, listCart);
  const createOrder = async (data) => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(URL, options);
      return response.json();
    } catch (error) {
      console.log("Error", error);
    }
  };

  createOrder(infomation);
};

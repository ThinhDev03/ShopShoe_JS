let numberItem = document.querySelector(".header__cart-qnt");
let toastMessage = document.querySelector(".toast");
let listCartItem = {};
let arr = [];
let listSP = getLocalStorage(keyLocalStorageListSP);
if (getLocalStorage(keyLocalStorageListSP) === null) {
  saveLocalStorage(keyLocalStorageListSP, listData);
}

if (listSP) {
  let blockElement = document.getElementById("render-product");
  let htmls = listSP.map(
    (item, index) =>
      ` <div class="col col-3 m-6 c-12" >
                    <div class="product-item">
                    <div class="product-item__img"
                        style="background-image: url(${item.url});"> 
                    </div>
                    <h3 class="product-item__brand">${item.name}</h3>
                    <div class="product-item__info">
                        <span class="product-item__price">$${item.price}</span>
                        <span class="product-item__qnt">Quantity: ${item.soluong}</span>
                    </div>
                    <div class="product-item__cart" onclick="handleAddSp(${index})">
                        <i class="fa-solid fa-cart-shopping product-item__cart-icon "></i>
                    </div>
                </div>
                </div>
                `
  );
  blockElement.innerHTML = htmls.join("");
}

function handleAddSp(index) {
  let check = false;
  let arr = getLocalStorage(keyLocalStorageItemCart) || [];

  if (arr[index] == null) {
    arr[index] = listSP[index];
    arr[index].count = 1;
  } else {
    arr[index].count += 1;
    if (arr[index].count > arr[index].soluong) {
      check = true;
      arr[index].count = arr[index].soluong;
    }
  }

  if (check) {
    toastMessage.style.display = "block";
    toastMessage.innerText = "Số lượng đã hết";
    setTimeout(() => {
      toastMessage.style.display = "none";
    }, 1000);
  } else {
    toastMessage.style.display = "block";
    toastMessage.innerText = " Thêm thành công";
    setTimeout(() => {
      toastMessage.style.display = "none";
    }, 1000);
  }

  saveLocalStorage(keyLocalStorageItemCart, arr);
  let removeNull = arr.filter((item) => item !== null);
  numberItem.innerText = removeNull.length;
}
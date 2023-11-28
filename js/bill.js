const billForm = document.querySelector(".detail-bill-wrapp");
const exitDetailBill = document.querySelector(".overlay__bill");
let listBill = [];
exitDetailBill.onclick = function () {
  exitDetailBill.style.display = "none";
  billForm.style.display = "none";
};
//IIFE
const getOrders = (function () {
  return async function (callback) {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      callback(data);
    } catch (error) {
      throw Error("Error", error);
    }
  };
})();
getOrders(renderOrder);
function renderOrder(orders) {
  listBill = orders;
  const orderList = document.querySelector("#order-cart-list");
  const htmls = orders.map((order, index) => {
    return `<tr class="bill-item-${order.id}">
        <td style="flex-direction: column; ">
            <span class="normal normal--active">${order.id}</span>
            <p class="detail-bill detail-bill--active" onclick="renderBillForm(${index})">
                Detail
            </p>
        </td>
        <td>
            <span class="normal">${order.infoBuyer.firstname} ${order.infoBuyer.lastname}</span>
        </td>
        <td>
            <span class "normal">${order.day}</span>
        </td>
        <td>
            <span class="normal">${order.listOrder.length}</span>
        </td>
        <td>
            <span class="normal">${totalCount(order.listOrder)}</span>
        </td>
        <td>
        <span class="normal">${totalPrice(order.listOrder)}</span>
    </td>
        <td>
            <i onclick="handleDelete(${index})"  class="fa-solid fa-xmark normal-cart__clear-icon" ></i>
        </td>
    </tr>`;
  });

  function totalCount(order) {
    return order.reduce((init, curr) => init + curr.count, 0);
  }
  orderList.innerHTML = htmls.join("");
}
//IIFE
const totalPrice = (function () {
  return function (order) {
    return order.reduce((init, curr) => init + curr.price * curr.count, 0);
  };
})();

async function renderBillForm(index) {
  let bill = listBill[index];
  const address = await getAddress(bill.infoBuyer);
  exitDetailBill.style.display = "block";
  billForm.style.display = "block";
  billForm.innerHTML = `
        <h3 class="detail-bill__heading">Thông tin đơn hàng</h3>
        <p class="detail-bill__info">Họ và tên: ${bill.infoBuyer.firstname} ${bill.infoBuyer.lastname
    }</p>
        <p class="detail-bill__info">Email:${bill.infoBuyer.email}</p>
        <p class="detail-bill__info">SĐT:${bill.infoBuyer.phone}</p>
        <p class="detail-bill__info">Địa chỉ: ${address}</p>
        <p class="detail-bill__info">Ghi chú:${bill.infoBuyer.message} </p>
        <h3 class="detail-bill__heading">Thông tin sản phẩm</h3>
        <ul class="detail-bill-list">
            ${hanleRenderBill(bill.listOrder)}
        </ul>
        <p class="total__price">Tổng tiền:${bill.totals} </p>`;
}

function hanleRenderBill(listOrder) {
  let htmlbill = listOrder
    .map(
      (item) =>
        `
        <li class="detail-bill-list__item">
            <img src=${item.url} alt="" class="detail-bill-list__item-img">
            <div class="detail-bill-list__wrap">
                <h4 class="name__product">${item.name} </h4>
                <span class="product__quantity">Quantity: ${item.count}</span>
            </div>
        </li>`
    )
    .join("");

  return htmlbill;
}

async function getAddress(bill) {
  const address = [bill.sonha];

  const [wards, districts, provinces] = await Promise.all([
    compareDataJsonServer("w"),
    compareDataJsonServer("d"),
    compareDataJsonServer("p"),
  ]);

  const wardItem = wards.find((data) => data.code === parseInt(bill.ward));
  const districtItem = districts.find(
    (data) => data.code === parseInt(bill.district)
  );
  const provinceItem = provinces.find(
    (data) => data.code === parseInt(bill.province)
  );

  if (wardItem) address.push(wardItem.name);
  if (districtItem) address.push(districtItem.name);
  if (provinceItem) address.push(provinceItem.name);

  return address.join(", ");
}

async function updateProductQuantity(order) {
  try {
    const localStorageData = localStorage.getItem(keyLocalStorageListSP);
    const tempListData = JSON.parse(localStorageData);
    order.listOrder.forEach((item) => {
      const productIndex = tempListData.findIndex((product) => product.id === item.id);
      if (productIndex !== -1) {
        tempListData[productIndex].soluong = tempListData[productIndex].soluong + item.count;
      }
    });
    localStorage.setItem(keyLocalStorageListSP, JSON.stringify(tempListData));
  } catch (err) {
    console.error("Error updating product quantity:", err);
  }
}


async function handleDelete(index) {
  if (confirm("bạn có muốn xoá không")) {
    let itemID = listBill[index].id;

    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(URL + "/" + itemID, options)
      .then(async (response) => {
        const data = await response.json();
        updateProductQuantity(listBill[index]);
      })
      .then(function () {
        let orderItem = document.querySelector(".bill-item-" + itemID);
        if (orderItem) {
          orderItem.remove();
        }
      })
      .catch((err) => console.error("Error", err));
  }

}

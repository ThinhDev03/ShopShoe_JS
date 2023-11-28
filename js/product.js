const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageItemCart = "DANHSACHITEMCART";
const listInfo = "THONGTINDATHANG";
const URL = "http://localhost:3000/listOrder";
const infomation = {};

const listData = [
  {
    id: 1,
    url: "https://drake.vn/image/catalog/H%C3%ACnh%20content/hinh-anh-giay-vans/hinh-anh-giay-vans-17.jpg",
    name: "Converse Chuck Taylor",
    price: 140,
    soluong: 10,
  },
  {
    id: 2,
    name: "Adidas Superstar",
    url: "https://vn-test-11.slatic.net/p/8fc8b0949d42407908e0467ee45f21d5.jpg",
    price: 120,
    soluong: 9,
  },
  {
    id: 3,
    name: "Timberland 6-Inch Premium Boot",
    url: "https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-9.jpg",
    price: 110,
    soluong: 12,
  },
  {
    id: 4,
    url: "https://lzd-img-global.slatic.net/g/ff/kf/S0791976b06be49f4b482306a8dd13adcq.jpg_720x720q80.jpg",
    name: "Hunter Original Tall Rain Boot",
    price: 220,
    soluong: 22,
  },
  {
    id: 5,
    name: "Gucci Horsebit Loafer",
    url: "https://tcorder.vn/wp-content/uploads/2015/11/giay-the-thao-nu-de-thap-3.jpg",
    price: 200,
    soluong: 7,
  },
  {
    id: 6,
    name: "Birkenstock Arizona Sandal",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGqbE_C9-A9cfXsXalYB_GyQeBqVUbGiHrA&usqp=CAU",
    price: 180,
    soluong: 5,
  },
];

function saveLocalStorage(key, value) {
  let jsonListData = JSON.stringify(value);
  localStorage.setItem(key, jsonListData);
}


function getLocalStorage(key) {
  let jsonData = localStorage.getItem(key);
  return JSON.parse(jsonData);
}

function getDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${day}/${month}/${year}`;
}

const getDataJsonServer = async (callback, type) => {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/${type}/`);
    const data = await response.json();
    callback(data);
  } catch (error) {
    throw Error("Erro", error);
  }
};

const compareDataJsonServer = async (type) => {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/${type}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw Error(error);
  }
};

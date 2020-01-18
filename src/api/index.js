import ajax from './ajax';

const BASE = ''; //Proxy server

//login request
export const reqLogin = (username, password) => ajax.post(BASE + '/login', {username, password});

//weather request
export const reqWeather = (city) => ajax.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c7dbdc5297ee2fbbeaa2daed2a14e793`);

//get all categories
export const reqCategory = () => ajax.get(BASE + '/manage/category/list');
/* export const reqCategory = () => ajax({
  // method: 'GET',
  url: BASE + '/manage/category/list'
}) */
//export const reqCategory = () => ajax(BASE + '/manage/category/list')

//get category by category_id
export const reqCategoryById = (id) => ajax(BASE + '/manage/category/info', {
  params: {id}
});

// add category
export const reqAddCategory = (categoryName) => ajax.post(BASE + '/manage/category/add', {categoryName});

// update category
// 2 parameters: (categoryId, categoryName) or 1 parameter: 1 object{} ({categoryId, categoryName})
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax.post(BASE + '/manage/category/update', {
  categoryId,
  categoryName
});


//get product list
export const reqProduct = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
  params: { // query
    pageNum,
    pageSize
  }
});

//search product
export const reqSearchProducts = ({
                                    pageNum,
                                    pageSize,
                                    searchName,
                                    searchType // 'productName'or'productDesc'
                                  }) => ajax(BASE + '/manage/product/search', {
  //method: 'GET',
  params: {
    pageNum,
    pageSize,
    [searchType]: searchName, //searchType 属性名而非属性值 searchName是属性名为searchType的属性的值
  }
});

//change product stock status
export const reqUpdateProductStatus = (productId, status) => ajax.post(BASE + '/manage/product/updateStatus', {
  productId,
  status
});

//delete img
export const reqDeleteImg = (name) => ajax.post(BASE + '/manage/img/delete', {name});

//add or update product
export const reqAddUpdateProduct = (product) => ajax.post(
  BASE + '/manage/product/' + (product._id ? 'update' : 'add'),
  product
);
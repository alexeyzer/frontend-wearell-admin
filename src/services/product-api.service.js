import axios from "axios";
const PRODUCTRAPI_URL = "http://51.250.69.184:8080/v1/";
//const PRODUCTRAPI_URL = "http://127.0.0.1:8080/v1/";
const sessionid = "sessionid"


class ProductApiService {
  buildHeader() {
    let session = localStorage.getItem(sessionid);
    if (session === null) {
      delete axios.defaults.headers.common[sessionid];
    } else {
      axios.defaults.headers.common[sessionid] = session;
    }
  }

   //----------------------------------------------------------------PUT---------------------------------------------------------------

   UpdateSize (id, name) {
    this.buildHeader();
    return axios //класс с методами:
    .put(PRODUCTRAPI_URL + "size", {id, name})
    .then((response)=>{
      return response.data;
    }); 
  }

  UpdateBrand (id, name, description, file, fileExtension, deletePhoto) {
    this.buildHeader();
    return axios //класс с методами:
    .put(PRODUCTRAPI_URL + "brand", {id, name, description, file, fileExtension, deletePhoto})
    .then((response)=>{
      return response.data;
    }); 
  }

  UpdateCategory (id, name, level, parentId) {
    this.buildHeader();
    return axios //класс с методами:
    .put(PRODUCTRAPI_URL + "category", {id, name, level, parentId})
    .then((response)=>{
      return response.data;
    }); 
  }

  UpdateFinalProduct (id, sizeId, sku, amount) {
    this.buildHeader();
    return axios //класс с методами:
    .put(PRODUCTRAPI_URL + "final-product", {id, sizeId, sku, amount})
    .then((response)=>{
      return response.data;
    }); 
  }

  UpdateProduct (id, name, description, image, contentType, brandId, categoryId, color, price, deletePhoto) {
    this.buildHeader();
    return axios //класс с методами:
    .put(PRODUCTRAPI_URL + "product", {id, name, description, image, contentType, brandId, categoryId, color, price, deletePhoto})
    .then((response)=>{
      return response.data;
    }); 
  }

  //----------------------------------------------------------------GET---------------------------------------------------------------
  GetProduct (id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "product", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }


  GetBrand (id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "brand", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }

  GetCategory (isAll, number, limit, name, level) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "category", {params:{"page.number": number, "page.limit": limit, "page.isAll": isAll,  name, level }})
    .then((response)=>{
      return response.data;
    }); 
  }
  GetCategoryById (id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "category/" + id)
    .then((response)=>{
      return response.data;
    }); 
  }

  GetColor(id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "color", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }

  GetSize(id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "size", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }

  GetFinalProduct(id) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "final-product", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }

  GetFullProduct (productId) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "full-product", {params:{productId}})
    .then((response)=>{
      return response.data;
    }); 
    }


  GetFinalProductList(productId) {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "final-product/list", {params:{productId}})
    .then((response)=>{
      return response.data;
    }); 
  }


  GetSizeList(){
    this.buildHeader();
    return axios
    .get(PRODUCTRAPI_URL + "size/list")
    .then((response)=>{
        return response.data;
      }
    );
  }

  GetListColor () {
    this.buildHeader();
    return axios //класс с методами:
	.get(PRODUCTRAPI_URL + "color/list")
  .then((response)=>{
		return response.data;
	}); 
  }

  GetListProducts  (isAll, number, limit, name, categoryId, brandId) {
    this.buildHeader();
    return axios //класс с методами:
	.get(PRODUCTRAPI_URL + "product/list", {params:{"page.number": number, "page.limit": limit, "page.isAll": isAll, name, categoryId, brandId }})
  .then((response)=>{
		return response.data;
	}); 
  }


  GetListBrand () {
    this.buildHeader();
    return axios //класс с методами:
    .get(PRODUCTRAPI_URL + "brand/list")
    .then((response)=>{
      return response.data;
    }); 
  }

  //----------------------------------------------------------------DELETE---------------------------------------------------------------

  DeleteColor (id) {
    this.buildHeader();
      return axios //класс с методами:
      .delete(PRODUCTRAPI_URL + "color", {params:{id}})
      .then((response)=>{
        return response.data;
      }); 
  }

  DeleteBrand (id) {
    this.buildHeader();
    return axios 
    .delete(PRODUCTRAPI_URL + "brand", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
}

DeleteCategory (id) {
  this.buildHeader();
  return axios 
  .delete(PRODUCTRAPI_URL + "category", {params:{id}})
  .then((response)=>{
    return response.data;
  }); 
}

DeleteFinalProduct (id) {
  this.buildHeader();
  return axios 
  .delete(PRODUCTRAPI_URL + "final-product", {params:{id}})
  .then((response)=>{
    return response.data;
  }); 
}

DeleteProduct (id) {
  this.buildHeader();
  return axios 
  .delete(PRODUCTRAPI_URL + "product", {params:{id}})
  .then((response)=>{
    return response.data;
  }); 
}

DeleteSize (id) {
  this.buildHeader();
  return axios 
  .delete(PRODUCTRAPI_URL + "size", {params:{id}})
  .then((response)=>{
    return response.data;
  }); 
}

  //----------------------------------------------------------------POST---------------------------------------------------------------

  PostColor (name) {
    this.buildHeader();
      return axios //класс с методами:
      .post(PRODUCTRAPI_URL + "color", {name})
      .then((response)=>{
        return response.data;
      }); 
  }
  PostBrand (name, description, file, fileExtension) {
    this.buildHeader();
    return axios //класс с методами:
    .post(PRODUCTRAPI_URL + "brand", {name, description, file, fileExtension})
    .then((response)=>{
      return response.data;
    }); 
}

PostCategory (name, level, parentId) {
  this.buildHeader();
  return axios //класс с методами:
  .post(PRODUCTRAPI_URL + "category", {name, level, parentId})
  .then((response)=>{
    return response.data;
  }); 
}

PostFinalProduct (productId, sizeId, sku, amount) {
  this.buildHeader();
  return axios //класс с методами:
  .post(PRODUCTRAPI_URL + "final-product", {productId, sizeId, sku, amount})
  .then((response)=>{
    return response.data;
  }); 
}

PostProduct (name, description, image, contentType, brandId, categoryId, color, price) {
  this.buildHeader();
  return axios //класс с методами:
  .post(PRODUCTRAPI_URL + "product", {name, description, image, contentType, brandId, categoryId, color, price})
  .then((response)=>{
    return response.data;
  }); 
}

PostSize (name, categoryId) {
  this.buildHeader();
  return axios //класс с методами:
  .post(PRODUCTRAPI_URL + "size", {name, categoryId})
  .then((response)=>{
    return response.data;
  }); 
}
  

}
export default new ProductApiService();
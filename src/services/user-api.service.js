import axios from "axios";
const USERAPI_URL = "http://62.84.114.46:8080/v1/";
//const USERAPI_URL = "http://127.0.0.1:8080/v1/";
const sessionid = "sessionid"
axios.defaults.withCredentials = true



class UserApiService {
  buildHeader() {
    let session = localStorage.getItem(sessionid);
    console.log("session:", session)
    if (session === null) {
      console.log("deleting:", session)
      delete axios.defaults.headers.common[sessionid];
    } else {
      axios.defaults.headers.common[sessionid] = session;
    }
  }

  ListOrders(userId) {
    return axios //класс с методами:
    .get(USERAPI_URL + "order/list/by-user-id", {params:{userId}})
    .then((response)=>{
      return response.data;
    });
  }
  listRoles() {
    this.buildHeader();
    return axios
      .get(USERAPI_URL + "role/list")
      .then((response) => {
        return response.data;
      });
  }
  GetRole(id) {
    this.buildHeader();
    return axios
      .get(USERAPI_URL + "role", {params:{id}})
      .then((response) => {
        return response.data;
      });
  }
  DeleteRole (id) {
    return axios //класс с методами:
    .delete(USERAPI_URL + "role", {params:{id}})
    .then((response)=>{
      return response.data;
    }); 
  }
  CreateRole (name, description) {
    return axios //класс с методами:
    .post(USERAPI_URL + "role", {name, description})
    .then((response)=>{
      return response.data;
    });
  }
  UpdateRole(id, name, description) {
    return axios //класс с методами:
    .put(USERAPI_URL + "role", {id, name, description})
    .then((response)=>{
      return response.data;
    });
  }
  ListUsers() {
    return axios //класс с методами:
    .get(USERAPI_URL + "user/list")
    .then((response)=>{
      return response.data;
    });
  }
  GetUser(id) {
    this.buildHeader();
    return axios
      .get(USERAPI_URL + "user", {params:{id}})
      .then((response) => {
        return response.data;
      });
  }
  CreateUserRole(userId, roleId) {
    this.buildHeader();
    return axios
      .post(USERAPI_URL + "user-role", {userId, roleId})
      .then((response) => {
        return response.data;
      });
  }
  DeleteUserRole(id) {
    this.buildHeader();
    return axios
      .delete(USERAPI_URL + "user-role", {params:{id}})
      .then((response) => {
        return response.data;
      });
  }

  

  login(email, password) {
    this.buildHeader();

    return axios
      .post(USERAPI_URL + "login", { email, password })
      .then((response) => {
        if (response.data) {
          localStorage.setItem(sessionid, response.data.session);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
  this.buildHeader();
	return axios
	  .post(USERAPI_URL + "logout", {})
	  .then((response) => {
		  return response.data;
	  });
  }
  register(email, name, password,  patronymic,  phone, surname) {
    this.buildHeader();
    return axios
	  .post(USERAPI_URL + "user", { email, name, password,  patronymic,  phone, surname})
	.then((response)=>{
    return response.data;
	}); 
  }
}
export default new UserApiService();
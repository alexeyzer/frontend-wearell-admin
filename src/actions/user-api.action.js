import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "../actions/types";
import UserAPIservice from "../services/user-api.service";

export const login = (email, password) => (dispatch) => {
  return UserAPIservice.login(email, password).then(
    (response) => {
      if (!response.accessToAdminPanel)  {
        dispatch({
          type: LOGIN_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: "У вас нет доступа к панели администраторов",
        });
        return Promise.resolve();
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response },
      });
      return Promise.resolve();
    },
    (error) => {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (error.response.status === 400) {
        message = "Неправильный логин или пароль"
      }
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
export const logout = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch({
    type: LOGOUT,
  });
  UserAPIservice.logout().then(() => {
    localStorage.removeItem("sessionid")
    return Promise.resolve();
  },
  (error) => {
    localStorage.removeItem("sessionid")
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({
      type: SET_MESSAGE,
      payload: message,
    });
    return Promise.reject();
  });
};
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
  } from "../actions/types";

const user = JSON.parse(localStorage.getItem("user"));

function getInitialState() {
	if (user !== null) {
		let isAdmin = false
		let role = user.roles.find(item => {return item.name === "admin"})
		if (role !== undefined) {
			isAdmin = true
		}
		return { isLoggedIn: true, user: user, isAdmin: isAdmin }
	}
	return { isLoggedIn: false, user: null, isAdmin: false }
}

//const initialState = user ? { isLoggedIn: true, user} : { isLoggedIn: false, user: null };

const initialState = getInitialState()

export default function reducer (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
	  case REGISTER_SUCCESS:
		return {
		  ...state,
		  isLoggedIn: true,
		  user: payload.user,
		};
	  case REGISTER_FAIL:
		return {
		  ...state,
		  isLoggedIn: false,
		  user: null,
		};
	  case LOGIN_SUCCESS:
		let isAdmin = false
		let role = payload.user.roles.find(item => {return item.name === "admin"})
		if (role !== undefined) {
			isAdmin = true
		}
		console.log("isAdmin:", isAdmin)
		return {
		  ...state,
		  isLoggedIn: true,
		  isAdmin: isAdmin,
		  user: payload.user,
		};
	  case LOGIN_FAIL:
		return {
		  ...state,
		  isLoggedIn: false,
		  user: null,
		};
	  case LOGOUT:
		return {
		  ...state,
		  isLoggedIn: false,
		  user: null,
		};
	  default:
		return state;
	}
}

import React from 'react';
import {Navbar, Nav, Container, Dropdown, /*Button, ButtonGroup*/} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { logout } from '../actions/user-api.action';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Styles = styled.div`
a, .navbar-brand{
	color:  #fff;
	text-align: center;
	text-decoration: none;
	&:active {
		color: rgba(255, 255, 255, 0.445);
	}
}
.dropdown-toggle {
	color:  #ffff;
}

`

export default function NaviBar() {
	const navigate = useNavigate()
	const dispath = useDispatch()
	const userApiState = useSelector(state => state.userAPIreducer)

	const logoutHandler = () => {
		dispath(logout());
	}

	return (
	<>
	<Styles>
		<Navbar sticky="top" collapseOnSelect expand="lg"  bg="dark" variant="dark">
			<Container>
				<Navbar.Brand><Link to="/" className="BrandLink" id="dropdown-title">Wearell admin</Link></Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
				<Navbar.Collapse id="responsive-navbar-nav">
					{userApiState.isLoggedIn &&(
					<Nav className="me-auto" >
						<Nav.Link><Link to="/users">Пользователи</Link></Nav.Link>
						<Nav.Link><Link to="/roles">Роли</Link></Nav.Link>
						<Nav.Link><Link to="/categories">Категории</Link></Nav.Link>
						<Nav.Link><Link to="/brands">Бренды</Link></Nav.Link>
						<Nav.Link><Link to="/sizes">Размеры</Link></Nav.Link>
					</Nav>)}

					{!userApiState.isLoggedIn &&(
					<Nav>
						<Nav.Link><Link to="/login">Войти</Link></Nav.Link>	
					</Nav>)}
					{userApiState.isLoggedIn &&(
					<Nav>
						<Nav.Link><Link to="/" onClick={logoutHandler}>Выйти</Link></Nav.Link>	
					</Nav>)}

				</Navbar.Collapse>
			</Container>
		</Navbar>
	</Styles>
	</>
)}
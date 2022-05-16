import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, ListGroup, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, Link, useParams } from 'react-router-dom';
import userApiService from '../services/user-api.service';


class User extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		email: "",
		name : "",
		patronymic:"",
		phone:"",
		surname: "",
	  };
	}

	componentDidMount(){
		const { id } = this.props.params;
		userApiService.GetUser(id).then(
		(response) => {
			this.setState({
				id: response.id,
				email: response.email,
				name : response.name,
				patronymic: response.patronymic,
				phone: response.phone,
				surname: response.surname,
				});

			return Promise.resolve();
		},
		(error) => {
			console.log('ошибка GetRole',error)
			return Promise.reject();
		});
	}
	
	render() {
		const {isLoggedIn, message } = this.props;
		
		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				<Container style={{width: "70vh"}} className="mt-3" >
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>ID</Form.Label>
							<Form.Control type="text" value={this.state.id} disabled/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicname">
							<Form.Label>Имя</Form.Label>
							<Form.Control type="text" placeholder="Имя" value={this.state.name} disabled/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicSurname">
							<Form.Label>Фамилия</Form.Label>
							<Form.Control type="text" placeholder="Фамилия" value={this.state.surname} disabled/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPatronymic">
							<Form.Label>Отчество</Form.Label>
							<Form.Control type="text" placeholder="Отчество" value={this.state.patronymic} disabled/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPhone">
							<Form.Label>Номер телефона</Form.Label>
							<Form.Control type="text" placeholder="Номер телефона" value={this.state.phone} disabled/>
						
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" placeholder="Email адрес" value={this.state.email} disabled/>
						</Form.Group>
					</Form>
				</Container>
			</>
	);
	}
}


function mapStateToProps(state) {
	const {isLoggedIn}  = state.userAPIreducer;
	const {message}  = state.message;
	return {
	  isLoggedIn,
	  message
	};
}

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} navigate={useNavigate()} />;
  }

export default withParams(connect(mapStateToProps)(User));
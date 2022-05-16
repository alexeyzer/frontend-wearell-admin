import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, ListGroup, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, Link, useParams } from 'react-router-dom';
import userApiService from '../services/user-api.service';


class Role extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		name: "",
		description: "",
	  };
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangeDescription = this.onChangeDescription.bind(this);
	  this.handleUpdate = this.handleUpdate.bind(this);
	  this.handleCreate = this.handleCreate.bind(this);
	  this.handleDelete = this.handleDelete.bind(this);
	}
	onChangeName(e) {
		this.setState({
			name: e.target.value,
		});
	}
	onChangeDescription(e) {
		this.setState({
			description: e.target.value,
		});
	}
	handleDelete(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		userApiService.DeleteRole(this.state.id).then(
			() => {
				this.props.navigate("/roles");
				return Promise.resolve();
			},
			(error) => {
				this.props.navigate("/roles");
				console.log('ошибка DeleteBrand',error)
				return Promise.reject();
			});
	  
	}
	handleUpdate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		
		userApiService.UpdateRole(this.state.id, this.state.name, this.state.description).then(
			() => {
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка UpdateRole',error)
				return Promise.reject();
			});
	  
	}
	handleCreate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		userApiService.CreateRole(this.state.name, this.state.description, this.state.file, this.state.fileExtension).then(
			(response) => {
				this.setState({
					id: response.id,
				});
				this.props.navigate("/roles/" + response.id);
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка CreateRole',error)
				return Promise.reject();
			});
	  
	}
	componentDidMount(){
		const { id } = this.props.params;
		if (id != "new") {
			userApiService.GetRole(id).then(
				(response) => {
					this.setState({
						id: response.id,
						name: response.name,
						description: response.description,
						});
	
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка GetRole',error)
					return Promise.reject();
				});
		}
	}
	render() {
		const {isLoggedIn, message } = this.props;
		
		const BuildButtons = () => {
			const {id} = this.props.params;
			if (id === "new") {
				return (
					<>
					<Button variant="primary" onClick={this.handleCreate}>
							Добавить
					</Button>
				</>
				)
			} else {
				return (
				<>
				<Button variant="primary" onClick={this.handleUpdate}>
						Обновить
				</Button>{' '}
				<Button variant="primary" onClick={this.handleDelete}>
						Удалить
				</Button>
			</>)
			}
		}

		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				<Container style={{width: "70vh"}} className="mt-3" >
					<Form>
					<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>ID</Form.Label>
							<Form.Control type="text" value={this.state.id} disabled/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Наименование роли</Form.Label>
							<Form.Control type="text" placeholder="Введите наименование роли" value={this.state.name} onChange={this.onChangeName}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Описание</Form.Label>
							<Form.Control  as="textarea" rows={3} placeholder="Введите описание" value={this.state.description} onChange={this.onChangeDescription}/>
						</Form.Group>
						<br />
						{BuildButtons()}
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

export default withParams(connect(mapStateToProps)(Role));
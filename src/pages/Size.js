import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, ListGroup, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, Link, useParams } from 'react-router-dom';


class Size extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		name: "",
		categoryId: "",
		categories: [],
	  };
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangecategoryID = this.onChangecategoryID.bind(this);
	  this.handleUpdate = this.handleUpdate.bind(this);
	  this.handleCreate = this.handleCreate.bind(this);
	  this.handleDelete = this.handleDelete.bind(this);
	}
	onChangeName(e) {
		this.setState({
			name: e.target.value,
		});
	}
	onChangecategoryID(e) {
		this.setState({
			categoryId: e.target.value,
		});
	}
	handleDelete(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.DeleteSize(this.state.id).then(
			() => {
				this.props.navigate("/sizes");
				return Promise.resolve();
			},
			(error) => {
				this.props.navigate("/sizes");
				console.log('ошибка DeleteSize',error)
				return Promise.reject();
			});
	  
	}
	handleUpdate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.UpdateSize(this.state.id, this.state.name, this.state.categoryId).then(
			() => {
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка DeleteSize',error)
				return Promise.reject();
			});
	  
	}
	handleCreate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.PostSize(this.state.name, this.state.categoryId).then(
			(response) => {
				this.setState({
					id: response.id,
				});
				this.props.navigate("/sizes/" + response.id);
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка DeleteSize',error)
				return Promise.reject();
			});
	  
	}
	componentDidMount(){
		const { id } = this.props.params;
		if (id != "new") {
			ProductApiService.GetSize(id).then(
				(response) => {
					this.setState({
						id: response.id,
						name: response.name,
						categoryId: response.categoryId,
						});
	
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка GetSizeList',error)
					return Promise.reject();
				});
		}
		ProductApiService.GetCategory(true).then(
			(response) => {
				this.setState({
					categories: response.items,
					});
				if (this.state.categoryId === "") {
					this.setState({
						categoryId: response.items[0].id,
						});
				}

				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetCategory',error)
				return Promise.reject();
			});
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
							<Form.Label>Наименование размера</Form.Label>
							<Form.Control type="text" placeholder="Введите название размера" value={this.state.name} onChange={this.onChangeName}/>
						</Form.Group>
						<Form.Select aria-label="Default select example" value={this.state.categoryId} onChange={this.onChangecategoryID}>
							{this.state.categories.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
						</Form.Select>
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

export default withParams(connect(mapStateToProps)(Size));
import React, { Component } from 'react';
import {Form, Button, Container, Alert} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, useParams } from 'react-router-dom';


class Category extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		level: "",
		parentId: "",
		categories: [],
		//alert
		alertVariant: "",
		alertText: "",
	  };
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangeLevel = this.onChangeLevel.bind(this);
	  this.onChangeParentId = this.onChangeParentId.bind(this);
	  this.handleUpdate = this.handleUpdate.bind(this);
	  this.handleCreate = this.handleCreate.bind(this);
	  this.handleDelete = this.handleDelete.bind(this);
	  this.handleCloseAlert = this.handleCloseAlert.bind(this);
	  this.handleCreateAlert = this.handleCreateAlert.bind(this);
	}
	handleCreateAlert(text, variant) {
		this.setState({
			alertText: text,
			alertVariant: variant,
		});
		window.scrollTo(0, 0);
	}
	handleCloseAlert() {
		this.setState({
			alertText: "",
		});
	}
	onChangeName(e) {
		this.setState({
			name: e.target.value,
		});
	}
	onChangeLevel(e) {
		this.setState({
			level: e.target.value,
		});
	}
	onChangeParentId(e) {
		this.setState({
			parentId: e.target.value,
		});
	}
	handleDelete(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.DeleteCategory(this.state.id).then(
			() => {
				this.props.navigate("/categories");
				return Promise.resolve();
			},
			(error) => {
				this.handleCreateAlert("Ошибка при удалении категории: "+ error, "danger");
				console.log('ошибка DeleteCategory',error)
				return Promise.reject();
			});
	  
	}
	handleUpdate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		
		ProductApiService.UpdateCategory(this.state.id, this.state.name, this.state.level, this.state.parentId).then(
			() => {
				this.handleCreateAlert("Категория успешна обновлена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.handleCreateAlert("Ошибка при обновлении категории: "+ error, "danger");
				console.log('ошибка UpdateBrand',error)
				return Promise.reject();
			});
	  
	}
	handleCreate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		if (this.state.parentId !== "") {
			ProductApiService.PostCategory(this.state.name, this.state.level, this.state.parentId).then(
				(response) => {
					this.setState({
						id: response.id,
					});
					this.props.navigate("/categories/" + response.id);
					this.handleCreateAlert("Категория успешна создана", "success");
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка PostCategory',error)
					this.handleCreateAlert("Ошибка при создании Категории: "+ error, "danger");
					return Promise.reject();
				});
		} else {
			ProductApiService.PostCategory(this.state.name, this.state.level).then(
				(response) => {
					this.setState({
						id: response.id,
					});
					this.props.navigate("/categories/" + response.id);
					this.handleCreateAlert("Категория успешна создана", "success");
					return Promise.resolve();
				},
				(error) => {
					this.handleCreateAlert("Ошибка при создании Категории: "+ error, "danger");
					console.log('ошибка PostCategory',error)
					return Promise.reject();
				});
		}
	
	  
	}
	componentDidMount(){
		const { id } = this.props.params;
		if (id !== "new") {
			ProductApiService.GetCategoryById(id).then(
				(response) => {
					this.setState({
						id: response.id,
						name: response.name,
						level: response.level,
						parentId: response.parentId,
						});
	
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка GetCategory',error)
					return Promise.reject();
				});
		}
		ProductApiService.GetCategory(true).then(
			(response) => {
				this.setState({
					categories: response.items,
				});
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetListBrand',error)
				return Promise.reject();
			}
		)
	}
	render() {
		const {isLoggedIn } = this.props;
		
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

		const buildAlter = () => {
			if (this.state.alertText !== "") {
				return (
					<>
						<Alert variant={this.state.alertVariant} onClose={this.handleCloseAlert} dismissible>
						{this.state.alertText}
						</Alert>
					  </>
				);
			}
			return (null);
		}


		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				{buildAlter()}
				<Container style={{width: "70vh"}} className="mt-3" >
					<Form>
					<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>ID</Form.Label>
							<Form.Control type="text" value={this.state.id} disabled/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Наименование Категории</Form.Label>
							<Form.Control type="text" placeholder="Введите наименование категории" value={this.state.name} onChange={this.onChangeName}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Уровень категории</Form.Label>
							<Form.Control type="number" placeholder="Введите уровень категории" value={this.state.level} onChange={this.onChangeLevel}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Родительская категория (может отсутствовать)</Form.Label>
							<Form.Select aria-label="Default select example" value={this.state.parentId} onChange={this.onChangeParentId}>
								<option value=""></option>
								{this.state.categories.map((item, index) => (
									<>
									<option value={item.id}>{item.name}</option>
									</>)
								)}
							</Form.Select>
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

export default withParams(connect(mapStateToProps)(Category));
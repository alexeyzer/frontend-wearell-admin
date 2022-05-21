import React, { Component } from 'react';
import {Form, Container, Alert, Button, Modal, Table} from 'react-bootstrap';
import { connect } from 'react-redux'
import { useNavigate, Navigate, useParams } from 'react-router-dom';
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
		userRoles: [],
		//roles list
		roles: [],
		//alert
		alertVariant: "",
		alertText: "",
		//modal
		modal:"",
		modalRoleID:"",
		//orders
		orders: [],
		//orderModal
		orderModal: "",
	  };
	  this.handleCloseAlert = this.handleCloseAlert.bind(this);
	  this.handleCreateAlert = this.handleCreateAlert.bind(this);
	  this.handleAddRoleForUser = this.handleAddRoleForUser.bind(this);
	  this.OpenModal = this.OpenModal.bind(this);
	  this.CloseModal = this.CloseModal.bind(this);
	  this.onChangeModalRoleId = this.onChangeModalRoleId.bind(this);
	  this.deleteRoleFromUser = this.deleteRoleFromUser.bind(this);
	  this.getTime = this.getTime.bind(this);
	  this.OpenOrderModal = this.OpenOrderModal.bind(this);
	  this.CloseOrderModal = this.CloseOrderModal.bind(this);
	  this.getStatus = this.getStatus.bind(this);
	}
	onChangeModalRoleId(e) {
		this.setState({
			modalRoleID: e.target.value,
		});
	}
	OpenOrderModal(param) {
		this.setState({
			orderModal: param,
		});
	}
	CloseOrderModal() {
		this.setState({
			orderModal: "",
		});
	}
	OpenModal() {
		this.setState({
			modal: "open",
			modalRoleID: this.state.roles[0].id,
		});
	}
	CloseModal() {
		this.setState({
			modal: "",
			modalRoleID: "",
		});
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
	deleteRoleFromUser(param) {
		userApiService.DeleteUserRole(param).then(
			(response) => {
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Роль удалена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Произошла ошибка при удалении роли", "danger");
			}
		)
	}
	handleAddRoleForUser() {
		userApiService.CreateUserRole(this.state.id, this.state.modalRoleID).then(
			(response) => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Роль добавлена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Произошла ошибка при добавлении роли", "danger");
			}
		)
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
				userRoles: response.roles,
				});

			return Promise.resolve();
		},
		(error) => {
			console.log('ошибка GetRole',error)
			return Promise.reject();
		});
		userApiService.listRoles().then(
			(response) => {
				this.setState({
					roles: response.roles,
				});
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка listRoles',error)
				return Promise.reject();
			}
		)
		userApiService.ListOrders(id).then(
			(response) => {
				this.setState({
					orders: response.orders,
				});
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка ListOrders',error)
				return Promise.reject();
			}
		)
	}
	getTime(param) {
		var a = new Date(param);
		var months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октрября','Ноября','Декабря'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	getStatus(param) {
		if (param == "CREATED") {
			return "Создан" 
		}
		if (param == "DONE") {
			return "Выполнен" 
		}
		if (param == "DECLINED") {
			return "Отменен" 
		}
	}
	
	render() {
		const {isLoggedIn, isAdmin } = this.props;

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

		const buildModal = () => {
			if (this.state.modal !== "") {
				return (
					<>
				<Modal show={true} onHide={this.CloseModal}>
					<Modal.Header closeButton>
					<Modal.Title>Добавление роли пользователю</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Роли</Form.Label>
							<Form.Select aria-label="Default select example" onChange={this.onChangeModalRoleId}>
							{this.state.roles.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
						</Form.Select>
						</Form.Group>
						<br />
						<Button variant="primary" onClick={this.handleAddRoleForUser}>
							Добавить
						</Button>
					</Form>
					</Modal.Body>
				</Modal>
				</>
				)
			}
			return (null)
		}

		const buildOrderModal = () => {
			if (this.state.orderModal !== "") {
				let order = this.state.orders.filter(item => {return item.id === this.state.orderModal})[0]
				return (
					<>
				<Modal size="lg" show={true} onHide={this.CloseOrderModal}>
					<Modal.Header closeButton>
					<Modal.Title>{"Заказ №" + order.id} </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table>
							<thead>
								<tr>
									<th>Товар</th>
									<th>Описание</th>
									<th>Размер</th>
									<th>Цвет</th>
									<th>Количество</th>
									<th>Цена</th>
								</tr>
							</thead>
							<tbody>
							{order.products.map((item, index) => (
								<> <tr>
									<td>{item.name}</td>
									<td>{item.description}</td>
									<td>{item.size}</td>
									<td>{item.color}</td>
									<td>{item.userQuantity}</td>
									<td>{item.price}</td>
								</tr>
								</>)
							)}
							</tbody>
						</Table>
					</Modal.Body>
				</Modal>
				</>
				)
			}
			return (null)
		}

		const buildRoleTable = () => {
			return (
				<>
					<Container style={{width: "70vh"}} className="mb-3"><h4>Роли пользователя</h4></Container>
					<Container style={{width: "70vh"}} className="mt-3" >
						<Table>
							<thead>
								<tr>
									<th>Роль</th>
									{isAdmin && (<th><Button variant="link" onClick={this.OpenModal}>Добавить</Button></th>)}
								</tr>
							</thead>
							<tbody>
							{this.state.userRoles.map((item, index) => (
								<> <tr>
									<td>{item.name}</td>
									{isAdmin && <td><Button variant="link" onClick={() => this.deleteRoleFromUser(item.userRoleId)}>Удалить</Button></td>}
								</tr>
								</>)
							)}
							</tbody>
						</Table>
					</Container>
				</>
			)
		}

		const buildOrdersTable = () => {
			return (
				<>
					<Container style={{width: "80vh"}} className="mb-3"><h4>Заказы пользователя</h4></Container>
					<Container style={{width: "80vh"}} className="mt-3" >
						<Table>
							<thead>
								<tr>
									<th>Дата заказа</th>
									<th>Статус</th>
									<th>Итоговая стоимость</th>
								</tr>
							</thead>
							<tbody>
							{this.state.orders.map((item, index) => (
								<> <tr>
									<td>{this.getTime(item.orderDate)}</td>
									<td>{this.getStatus(item.orderStatus)}</td>
									<td>{item.totalPrice + " ₽"}</td>
									{isAdmin && <td><Button variant="link" onClick={() => this.OpenOrderModal(item.id)}>Подробнее</Button></td>}
								</tr>
								</>)
							)}
							</tbody>
						</Table>
					</Container>
				</>
			)
		}
		
		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				{buildAlter()}
				{buildModal()}
				{buildOrderModal()}
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
				<br/>
				{buildRoleTable()}
				{buildOrdersTable()}
			</>
	);
	}
}


function mapStateToProps(state) {
	const {isLoggedIn, user, isAdmin}  = state.userAPIreducer;
	console.log(user)
	const {message}  = state.message;
	return {
	  isLoggedIn,
	  isAdmin,
	  message
	};
}

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} navigate={useNavigate()} />;
  }

export default withParams(connect(mapStateToProps)(User));
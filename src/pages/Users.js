import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, Table} from 'react-bootstrap';
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';
import userApiService from '../services/user-api.service';


class Users extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		users: [],
	  };
	}
	componentDidMount(){
		userApiService.ListUsers().then(
			(response) => {
				this.setState({
					users: response.users,
				});
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка ListUsers',error)
				return Promise.reject();
			}
		)
	}
	render() {
		const { isLoggedIn, message } = this.props;
		const buildUserItems = () => { 
			if (this.state.users.length ===0) {
				return <Container><h3 style={{textAlign: "center"}}>Нет информации о пользователях</h3></Container>
			} else {
				return (
				<>
					<Container><h3>Пользователи</h3></Container>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Почта</th>
									<th>Телефон</th>
									<th>Имя</th>
								</tr>
							</thead>
							<tbody>
							{this.state.users.map((item, index) => (
								<> <tr>
									<td>{item.id}</td>
									<td>{item.email}</td>
									<td>{item.name}</td>
									<td>{item.phone}</td>
									<td><Link to={"/users/" + item.id}>подробнее</Link></td>
								</tr>
								</>)
							)}
							</tbody>
						</Table>
					</>
				);
			}
		}
		
		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				<Container>
					<Col>
						<Row>{buildUserItems()}</Row>
					</Col>
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

export default connect(mapStateToProps)(Users);
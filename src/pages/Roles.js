import React, { Component } from 'react';
import {Container, Col, Row, Table} from 'react-bootstrap';
import UserAPIservice from "../services/user-api.service";
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';


class Roles extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		roles: [],
	  };
	}
	componentDidMount(){
		UserAPIservice.listRoles().then(
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
	}
	render() {
		const { isLoggedIn, isAdmin } = this.props;
		const buildRoleItems = () => { 
			return (
			<>
				<Container><h3>Роли</h3></Container>
					<Table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Название</th>
								<th>Описание</th>
								{isAdmin && <th><Link to="/roles/new">Добавить</Link></th>}
							</tr>
						</thead>
						<tbody>
						{this.state.roles.map((item, index) => (
							<> <tr>
								<td>{item.id}</td>
								<td>{item.name}</td>
								<td>{item.description}</td>
								{isAdmin && <td><Link to={"/roles/" + item.id}>редактировать</Link></td>}
							</tr>
							</>)
						)}
						</tbody>
					</Table>
				</>
			);
		}
		
		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				<Container>
					<Col>
						<Row>{buildRoleItems()}</Row>
					</Col>
				</Container>
			</>
	);
	}
}


function mapStateToProps(state) {
	const {isLoggedIn, isAdmin}  = state.userAPIreducer;
	const {message}  = state.message;
	return {
	  isLoggedIn,
	  isAdmin,
	  message
	};
  }

export default connect(mapStateToProps)(Roles);
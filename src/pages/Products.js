import React, { Component } from 'react';
import {Container, Col, Row, Table} from 'react-bootstrap';
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';
import productApiService from '../services/product-api.service';


class Products extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		products: [],
	  };
	}
	componentDidMount(){
		productApiService.GetListProducts(true).then(
			(response) => {
				this.setState({
					products: response.products,
				});
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetListProducts',error)
				return Promise.reject();
			}
		)
	}
	render() {
		const { isLoggedIn } = this.props;
		const buildRoleItems = () => { 
			return (
			<>
				<Container><h3>Товары</h3></Container>
					<Table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Название</th>
								<th>Описание</th>
								<th>Цвет</th>
								<th>Цена</th>
								<th><Link to="/products/new">Добавить</Link></th>
							</tr>
						</thead>
						<tbody>
						{this.state.products.map((item, index) => (
							<> <tr>
								<td>{item.id}</td>
								<td>{item.name}</td>
								<td>{item.description}</td>
								<td>{item.color}</td>
								<td>{item.price}</td>
								<td><Link to={"/products/" + item.id}>редактировать</Link></td>
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
	const {isLoggedIn}  = state.userAPIreducer;
	const {message}  = state.message;
	return {
	  isLoggedIn,
	  message
	};
  }

export default connect(mapStateToProps)(Products);
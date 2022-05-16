import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';


class Brands extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		brands: [],
	  };
	}
	componentDidMount(){
		ProductApiService.GetListBrand().then(
			(response) => {
				this.setState({
					brands: response.brands,
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
		const { isLoggedIn, message } = this.props;
		const buildBrandItems = () => { 
			if (this.state.brands.length ===0) {
				return <Container><h3 style={{textAlign: "center"}}>Нет информации о брендах</h3></Container>
			} else {
				return (
				<>
					<Container><h3>Бренды</h3></Container>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Название</th>
									<th>Описание</th>
									<th><Link to="/brands/new">Добавить</Link></th>
								</tr>
							</thead>
							<tbody>
							{this.state.brands.map((item, index) => (
								<> <tr>
									<td>{item.id}</td>
									<td>{item.name}</td>
									<td>{item.description}</td>
									<td><Link to={"/brands/" + item.id}>редактировать</Link></td>
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
						<Row>{buildBrandItems()}</Row>
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

export default connect(mapStateToProps)(Brands);
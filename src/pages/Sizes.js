import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, ListGroup, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';


class Sizes extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		sizes: [],
	  };
	}
	componentDidMount(){
		ProductApiService.GetSizeList().then(
			(response) => {
				this.setState({
					sizes: response.sizes,
					});

				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetSizeList',error)
				return Promise.reject();
			});
	}
	render() {
		const { isLoggedIn, message } = this.props;
		const buildSizeItems = () => { 
			if (this.state.sizes.length ===0) {
				return <Container><h3 style={{textAlign: "center"}}>Нет информации о размерах</h3></Container>
			} else {
				return (
					<>
						<Container><h3>Размеры</h3></Container>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Название</th>
									<th>Категория</th>
									<th><Link to="/sizes/new">Добавить</Link></th>
								</tr>
							</thead>
							<tbody>
							{this.state.sizes.map((item, index) => (
								<> <tr>
									<td>{item.id}</td>
									<td>{item.name}</td>
									<td>{item.categoryName}</td>
									<td><Link to={"/sizes/" + item.id}>редактировать</Link></td>
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
						<Row>{buildSizeItems()}</Row>
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

export default connect(mapStateToProps)(Sizes);
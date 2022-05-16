import React, { Component } from 'react';
import {Form, Button, Container, Col, Row, Table} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { Navigate, Link } from 'react-router-dom';


class Categories extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		categories: [],
	  };
	}
	componentDidMount(){
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
		const { isLoggedIn, message } = this.props;
		const buildCategoriesItems = () => { 
			if (this.state.categories.length ===0) {
				return <Container><h3 style={{textAlign: "center"}}>Нет информации о категориях</h3></Container>
			} else {
				return (
				<>
					<Container><h3>Категории</h3></Container>
						<Table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Название</th>
									<th>Уровень</th>
									<th>Родительская категория</th>
									<th><Link to="/categories/new">Добавить</Link></th>
								</tr>
							</thead>
							<tbody>
							{this.state.categories.map((item, index) => (
								<> <tr>
									<td>{item.id}</td>
									<td>{item.name}</td>
									<td>{item.level}</td>
									<td>{item.parentId}</td>
									<td><Link to={"/categories/" + item.id}>редактировать</Link></td>
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
						<Row>{buildCategoriesItems()}</Row>
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

export default connect(mapStateToProps)(Categories);
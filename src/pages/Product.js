import React, { Component } from 'react';
import {Form, Button, Container, Table, Modal, Alert} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, useParams } from 'react-router-dom';


class Product extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		name: "",
		description: "",
		categoryId: "",
		brandId: "",
		color: "",
		price: "",
		url: "",
		file: "",
		fileExtension: "",
		categories: [],
		brands: [],
		sizes: [],
		fullProducts: [],
		//modal
		modal: "",
		modalSizeId: "",
		modalSku: "",
		modalAmount: "",
		//alert
		alertVariant: "",
		alertText: "",
	  };
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangeDescription = this.onChangeDescription.bind(this);
	  this.onChangeCategoryID = this.onChangeCategoryID.bind(this);
	  this.onChangeBrandID= this.onChangeBrandID.bind(this);
	  this.onChangePrice = this.onChangePrice.bind(this);
	  this.onChangeColor = this.onChangeColor.bind(this);
	  this.handleUploadFile = this.handleUploadFile.bind(this);
	  this.handleUpdate = this.handleUpdate.bind(this);
	  this.handleCreate = this.handleCreate.bind(this);
	  this.handleDelete = this.handleDelete.bind(this);
	  this.handleDeletePhoto= this.handleDeletePhoto.bind(this);
	  this.onClickSizeButton = this.onClickSizeButton.bind(this);
	  this.onChangeModalSku = this.onChangeModalSku.bind(this);
	  this.onChangeModalSizeId = this.onChangeModalSizeId.bind(this);
	  this.onChangeModalAmount= this.onChangeModalAmount.bind(this);
	  this.handleCreateFinalProduct = this.handleCreateFinalProduct.bind(this);
	  this.handleDeleteFinalProduct = this.handleDeleteFinalProduct.bind(this);
	  this.handleUpdateFinalProduct = this.handleUpdateFinalProduct.bind(this);
	  this.handleCloseModal = this.handleCloseModal.bind(this);
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
	handleCloseModal() {
		this.setState({
			modal: "",
		});
	}
	onChangeModalSku(e) {
		this.setState({
			modalSku: e.target.value,
		});
	}
	onChangeModalSizeId(e) {
		console.log("set:", e.target.value)
		this.setState({
			modalSizeId: e.target.value,
		});
	}
	onChangeModalAmount(e) {
		this.setState({
			modalAmount: e.target.value,
		});
	}
	onClickSizeButton(param) {
		console.log(this.state.sizes)
		if (param === "new") {
			this.setState({
				modal: param,
				modalSizeId: this.state.sizes[0].id,
				modalSku: "",
				modalAmount: "",
			})
		} else {
			let fullProduct = this.state.fullProducts.filter(item => {return item.id === param})
			this.setState({
				modal: param,
				modalSizeId: fullProduct[0].sizeId,
				modalSku: fullProduct[0].sku,
				modalAmount: fullProduct[0].amount,
			})
		}
	}
	onChangePrice(e) {
		this.setState({
			price: e.target.value,
		});
	}
	onChangeColor(e) {
		this.setState({
			color: e.target.value,
		});
	}
	onChangeCategoryID(e) {
		this.setState({
			categoryId: e.target.value,
		});
	}
	onChangeBrandID(e) {
		this.setState({
			brandId: e.target.value,
		});
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
		ProductApiService.DeleteProduct(this.state.id).then(
			() => {
				this.props.navigate("/products");
				return Promise.resolve();
			},
			(error) => {
				this.props.navigate("/products");
				console.log('ошибка DeleteProduct',error)
				return Promise.reject();
			});
	  
	}
	handleDeletePhoto(e) {
		e.preventDefault();
		this.setState({
			url: "",
			file: "",
			fileExtension: "",
		});
	}
	handleUploadFile(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		let reader = new FileReader();
		let file = e.target.files[0];
		console.log(file)
	
		reader.onloadend = () => {
	
		  let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
		  if ((encoded.length % 4) > 0) {
			encoded += '='.repeat(4 - (encoded.length % 4));
		  }
		  this.setState({
			url: reader.result,
			file: encoded,
			fileExtension: file.name.split('.').pop(),
		  });
		}
	
		reader.readAsDataURL(file)
	}

	handleUpdate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		
		let deletePhoto = false
		if (this.state.url === "") {
			deletePhoto = true
		}
		ProductApiService.UpdateProduct(this.state.id, this.state.name, this.state.description, this.state.file, this.state.fileExtension, this.state.brandId, this.state.categoryId, this.state.color, this.state.price, deletePhoto).then(
			() => {
				this.handleCreateAlert("Информация о товаре успешно обновлена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.handleCreateAlert("В процессе обновления произошла ошибка" + error, "danger");
				console.log('ошибка UpdateProduct',error)
				return Promise.reject();
			});
	  
	}
	handleCreate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.PostProduct(this.state.name, this.state.description, this.state.file, this.state.fileExtension, this.state.brandId, this.state.categoryId, this.state.color, this.state.price).then(
			(response) => {
				this.setState({
					id: response.id,
				});
				this.props.navigate("/products/" + response.id);
				this.handleCreateAlert("Товар успешно создан", "success");
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка PostProduct',error)
				this.handleCreateAlert("Произошла ошибка при создании товара: " + error, "danger");
				return Promise.reject();
			});
	  
	}
	handleCreateFinalProduct(e) {
		console.log('size:',this.state.modalSizeId)
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.PostFinalProduct(this.state.id, this.state.modalSizeId, this.state.modalSku, this.state.modalAmount).then(
			() => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Связка товар-размер успешно создана", "success");
				return Promise.resolve();
			},
			(error) => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Произошла ошибка при создании связки товар-размер: "+ error, "danger");
				console.log('ошибка PostFinalProduct',error)
				return Promise.reject();
			});
	}
	handleUpdateFinalProduct(id) {
		ProductApiService.UpdateFinalProduct(id, this.state.modalSizeId, this.state.modalSku, this.state.modalAmount).then(
			() => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Cвязка товар-размер успешно обновлена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Произошла ошибка при обновлении связки товар-размер: "+ error, "danger");
				console.log('ошибка DeleteFinalProduct',error)
				return Promise.reject();
			});
	}
	handleDeleteFinalProduct( id) {
		ProductApiService.DeleteFinalProduct(id).then(
			() => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Связка товар-размер успешно удалена: ", "succes");
				
				return Promise.resolve();
			},
			(error) => {
				this.setState({
					modal: "",
				});
				this.componentDidMount();
				this.forceUpdate();
				this.handleCreateAlert("Произошла ошибка при удалении связки товар-размер: "+ error, "danger");
				console.log('ошибка DeleteFinalProduct',error)
				return Promise.reject();
			});
	}
	componentDidMount(){
		const { id } = this.props.params;
		if (id !== "new") {
			ProductApiService.GetProduct(id).then(
				(response) => {
					this.setState({
						id: response.id,
						name: response.name,
						description: response.description,
						url: response.url,
						brandId: response.brandId,
						categoryId: response.categoryId,
						color: response.color,
						price: response.price,
						});
	
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка GetProduct',error)
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
		ProductApiService.GetListBrand().then(
			(response) => {
				this.setState({
					brands: response.brands,
					});
				if (this.state.brandId === "") {
					this.setState({
						brandId: response.brands[0].id,
						});
				}

				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetListBrand',error)
				return Promise.reject();
			});
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
		ProductApiService.GetFinalProductList(id).then(
			(response) => {
				this.setState({
					fullProducts: response.products,
					});

				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка GetFinalProductList',error)
				return Promise.reject();
			});
	}
	render() {
		const {isLoggedIn} = this.props;
		const {id} = this.props.params;
		
		const BuildButtons = () => {
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
		

		const buildModal = () => {
			if (this.state.modal === "new") {
				return (
					<>
				<Modal show={true} onHide={this.handleCloseModal}>
					<Modal.Header closeButton>
					<Modal.Title>Добавление связки товар размер</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Размер</Form.Label>
							<Form.Select aria-label="Default select example" onChange={this.onChangeModalSizeId}>
							{this.state.sizes.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
						</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>SKU</Form.Label>
						    <Form.Control type="text" placeholder="Введите sku" value={this.state.modalSku} onChange={this.onChangeModalSku}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Количество</Form.Label>
						    <Form.Control type="number" placeholder="Введите количество" value={this.state.modalAmount} onChange={this.onChangeModalAmount}/>
						</Form.Group>
						<br />
						<Button variant="primary" onClick={this.handleCreateFinalProduct}>
							Добавить
						</Button>
					</Form>
					</Modal.Body>
				</Modal>
				</>
				)
			}
			if (this.state.modal !== "") {
			return  (
				<>
			<Modal show={true} onHide={this.handleCloseModal}>
					<Modal.Header closeButton>
					<Modal.Title>Изменение связки товар размер</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Размер</Form.Label>
							<Form.Select aria-label="Default select example" value={this.state.modalSizeId} onChange={this.onChangeModalSizeId}>
							{this.state.sizes.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
						</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>SKU</Form.Label>
						    <Form.Control type="text" placeholder="Введите sku" value={this.state.modalSku} onChange={this.onChangeModalSku}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Количество</Form.Label>
						    <Form.Control type="number" placeholder="Введите количество" value={this.state.modalAmount} onChange={this.onChangeModalAmount}/>
						</Form.Group>
						<br />
						<Button variant="primary" onClick={() => this.handleUpdateFinalProduct(this.state.modal)}>
						Обновить
					</Button>{' '}
					<Button variant="primary" onClick={() => this.handleDeleteFinalProduct(this.state.modal)}>
						Удалить
					</Button>
					</Form>
					</Modal.Body>
				</Modal>
			</>
			)
			}
			return (null);
		}

		const buildSizeTable = () => {
			if (id !== "new") {
				return (
					<>
						<Container style={{width: "70vh"}} className="mb-3"><h4>Размеры и наличие товара</h4></Container>
						<Container style={{width: "70vh"}} className="mt-3" >
							<Table>
								<thead>
									<tr>
										<th>Размер</th>
										<th>SKU</th>
										<th>Количество</th>
										<th><Button variant="link" onClick={() => this.onClickSizeButton("new")}>Добавить</Button></th>
									</tr>
								</thead>
								<tbody>
								{this.state.fullProducts.map((item, index) => (
									<> <tr>
										<td>{item.sizeName}</td>
										<td>{item.sku}</td>
										<td>{item.amount}</td>
										<td><Button variant="link" onClick={() => this.onClickSizeButton(item.id)}>Изменить</Button></td>
									</tr>
									</>)
								)}
								</tbody>
							</Table>
						</Container>
					</>
				)
			}
			return (null);
		}

		return (
			<>
				{!isLoggedIn && <Navigate replace to="/login" />}
				{buildAlter()}
				{buildModal()}

				<Container style={{width: "70vh"}} className="mt-3" >
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>ID</Form.Label>
							<Form.Control type="text" value={this.state.id} disabled/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Наименование товара</Form.Label>
							<Form.Control type="text" placeholder="Введите наименование" value={this.state.name} onChange={this.onChangeName}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Описание</Form.Label>
							<Form.Control  as="textarea" rows={3} placeholder="Введите описание" value={this.state.description} onChange={this.onChangeDescription}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Цвет</Form.Label>
							<Form.Control type="text" placeholder="Введите цвет" value={this.state.color} onChange={this.onChangeColor}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Цена</Form.Label>
							<Form.Control type="text" placeholder="Введите цену" value={this.state.price} onChange={this.onChangePrice}/>
						</Form.Group>
						{this.state.url === "" && <>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>Фото товара</Form.Label>
								<Form.Control type="file" onChange={this.handleUploadFile}/>
							</Form.Group>
						</>}
						{this.state.url !== "" && <>
						<img
     						 src={this.state.url}
      						style={{ maxWidth: '24rem' }}
    						/>
							<br />
							<Button variant="primary" onClick={this.handleDeletePhoto}>
							удалить фото
							</Button>
							<br />
							<br />
						</>}
						<Form.Label>Категория</Form.Label>
						<Form.Select aria-label="Default select example" value={this.state.categoryId} onChange={this.onChangeCategoryID}>
							{this.state.categories.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
							</Form.Select>
							<br />
							<Form.Label>Бренд</Form.Label>
							<Form.Select aria-label="Default select example" value={this.state.brandId} onChange={this.onChangeBrandID}>
							{this.state.brands.map((item, index) => (
								<>
								<option value={item.id}>{item.name}</option>
								</>)
							)}
						</Form.Select>
						<br />
						{BuildButtons()}
					</Form>
				</Container>
				<br />
				{buildSizeTable()}
			
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

export default withParams(connect(mapStateToProps)(Product));
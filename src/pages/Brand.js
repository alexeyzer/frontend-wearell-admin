import React, { Component } from 'react';
import {Form, Button, Container, Alert} from 'react-bootstrap';
import ProductApiService from "../services/product-api.service";
import { connect } from 'react-redux'
import { useNavigate, Navigate, useParams } from 'react-router-dom';


class Brand extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		id: "",
		name: "",
		url: "",
		file: "",
		fileExtension: "",
		description: "",
		//alert
		alertVariant: "",
		alertText: "",
	  };
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangeDescription = this.onChangeDescription.bind(this);
	  this.handleUploadFile = this.handleUploadFile.bind(this);
	  this.handleUpdate = this.handleUpdate.bind(this);
	  this.handleCreate = this.handleCreate.bind(this);
	  this.handleDelete = this.handleDelete.bind(this);
	  this.handleDeletePhoto= this.handleDeletePhoto.bind(this);
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
	onChangeDescription(e) {
		this.setState({
			description: e.target.value,
		});
	}
	handleDelete(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.DeleteBrand(this.state.id).then(
			() => {
				this.props.navigate("/brands");
				return Promise.resolve();
			},
			(error) => {
				this.handleCreateAlert("Произошла ошибка при удалении бренда: "+ error, "danger");
				console.log('ошибка DeleteBrand',error)
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
		ProductApiService.UpdateBrand(this.state.id, this.state.name, this.state.description, this.state.file, this.state.fileExtension, deletePhoto).then(
			() => {
				this.handleCreateAlert("Информация о бренде успешно обновлена", "success");
				return Promise.resolve();
			},
			(error) => {
				this.handleCreateAlert("Произошла ошибка при обновлении бренда: "+ error, "danger");
				console.log('ошибка UpdateBrand',error)
				return Promise.reject();
			});
	  
	}
	handleCreate(e) {
		e.preventDefault(); //предотвращение поведения по умолчанию.
		ProductApiService.PostBrand(this.state.name, this.state.description, this.state.file, this.state.fileExtension).then(
			(response) => {
				this.setState({
					id: response.id,
				});
				this.props.navigate("/brands/" + response.id);
				this.handleCreateAlert("Бренд успешно создан", "success");
				return Promise.resolve();
			},
			(error) => {
				console.log('ошибка DeleteSize',error)
				return Promise.reject();
			});
	  
	}
	componentDidMount(){
		const { id } = this.props.params;
		if (id !== "new") {
			ProductApiService.GetBrand(id).then(
				(response) => {
					this.setState({
						id: response.id,
						name: response.name,
						description: response.description,
						url: response.imageUrl,
						});
	
					return Promise.resolve();
				},
				(error) => {
					console.log('ошибка GetBrand',error)
					return Promise.reject();
				});
		}
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
							<Form.Label>Наименование бренда</Form.Label>
							<Form.Control type="text" placeholder="Введите наименование" value={this.state.name} onChange={this.onChangeName}/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Описание</Form.Label>
							<Form.Control  as="textarea" rows={3} placeholder="Введите описание" value={this.state.description} onChange={this.onChangeDescription}/>
						</Form.Group>
						{this.state.url === "" && <>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>Фото бренда</Form.Label>
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
						</>}
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

export default withParams(connect(mapStateToProps)(Brand));
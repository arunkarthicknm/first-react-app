import React, { Component } from "react";
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem, CardBody, CardText } from "reactstrap";
import { Link } from 'react-router-dom';
import {
    Button, Modal, ModalBody, ModalHeader, Label, Row, Col
} from "reactstrap";

import { FadeTransform, Fade, Stagger } from 'react-animation-components';

import { Control, LocalForm, Errors } from 'react-redux-form';

import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


/**........................ comment component ends ................................................. */
//// validators
const required = (val) => val && val.length; //value > 0
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);


        this.state = {
            isCommentFormModalOpen: false
        };

        this.toggleCommentFormModal = this.toggleCommentFormModal.bind(this);
        this.handleCommentFormSubmit = this.handleCommentFormSubmit.bind(this);

    }

    handleCommentFormSubmit(values) {
        this.toggleCommentFormModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    toggleCommentFormModal() {
        this.setState({
            isCommentFormModalOpen: !this.state.isCommentFormModalOpen
        });
    }


    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleCommentFormModal}>
                    <span className="fa fa-comments fa-lg"></span> Submit Comment
                </Button>


                {/* commentform  Modal */}
                <Modal isOpen={this.state.isCommentFormModalOpen} toggle={this.toggleCommentFormModal} >
                    <ModalHeader toggle={this.toggleCommentFormModal}> Submit Comment </ModalHeader>
                    <ModalBody>

                        <LocalForm onSubmit={(values) => this.handleCommentFormSubmit(values)}>

                            {/* rating */}
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12} >Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating"
                                        className="form-control"
                                        name="rating"
                                        id="rating"
                                        validators={{
                                            required
                                        }}
                                    >
                                        <option>Please Select</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                        }}
                                    />
                                </Col>
                            </Row>


                            {/* author */}
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}> Your Name </Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="First Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>




                            {/* comment */}
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control"
                                        validators={{
                                            required
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                        }}
                                    />
                                </Col>

                            </Row>

                            {/* submit button */}
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>

                        </LocalForm>

                    </ModalBody>
                </Modal>


            </React.Fragment>
        );
    }
}

/**........................ comment component ends ................................................. */


 



const Dishdetail = ({dish,comments,postComment,isLoading,errMess})=>{
    if (isLoading)
    {
        return(
            <div className="container">
            <div className="row">
                <Loading />
            </div>
            </div>
        );
    }
    else if(errMess)
    {
        return(
            <div className="container">
            <div className="row">
                <h4>{errMess}</h4>
            </div>
            </div>
        );
    }
    else
    {   
        return ( 
        <React.Fragment>  
        <RenderDish dish={dish} comments={comments} postComment={postComment}/>
        </React.Fragment>
    );    
    }
}

function formatDate(date)
{
const option = {year: 'numeric', month: 'short', day: 'numeric' };
const date1 = new Date(date)
const newdate = date1.toLocaleDateString("en-US", option)
return newdate;

}


const RenderComments =({comments,postComment,dishId}) =>
{

    if (comments!=null)
    {
        const com = comments.map(co=>{
                
                return(
                <Fade in>
                <li>{co.comment}</li><br />
                <li>-- {co.author}, {formatDate(co.date)}</li><br />
                </Fade>
            )
                
            }
            );
        return(
            <ul className="list-unstyled">
            <Stagger in>
            {com}
            </Stagger>
            <CommentForm dishId={dishId} postComment={postComment}/>
            </ul>
            
        )
    }
    else{
        return(<div></div>)
    }
}

const RenderDish=({dish,comments,postComment})=>
{
    if (dish!=null)
    {
        return(
        <div className="container">
         <div className="row">
        <Breadcrumb>
            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{dish.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12 m-1">
        <h3>{dish.name}</h3>
        </div>
        </div>
        <div className="row">
        <div className="col-12 col-md-5 m-1">
        <FadeTransform in 
        transformProps={{
            exitTransform:'scale(0.5) translateY(-50%)'
        }}>
        <Card>
            <CardImg width="100%" src={baseUrl+dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
        </FadeTransform>
        </div>
        <div className="col-12 col-md-5 m-1" >
        <h4>Comments</h4>
        
        <RenderComments comments={comments}
        postComment={postComment}
        dishId={dish.id}/>
        
        </div>
        </div>
        </div >
        )
    }
    else{
        return(<div></div>)
    }
}
export default Dishdetail;
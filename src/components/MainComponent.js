import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Home from './HomeComponent';
import Menu from './MenuComponents';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Dishdetail from './Dishdetailcomponent';

import { Switch, Route, Redirect,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {  postComment,fetchDishes,fetchComments,fetchPromos,fetchLeaders,postFeedback } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';


const mapStateToProps = state=>
{
  return{
    dishes:state.dishes,
    comments:state.comments,
    promotions:state.promotions,
    leaders:state.leaders
  }
}

const mapDispatchToProps = (dispatch)=>
{
  return (
    {
      postComment:(dishId,rating,author,comment)=>dispatch(postComment(dishId,rating,author,comment)),
      fetchDishes:()=>{dispatch(fetchDishes())},
      resetFeedbackForm:()=>{dispatch(actions.reset('feedback'))},
      fetchComments:()=>{dispatch(fetchComments())},
      fetchPromos:()=>{dispatch(fetchPromos())},
      fetchLeaders:()=>{dispatch(fetchLeaders())},
      postFeedback:(values)=>postFeedback(values),
    }
  )
}



class Main extends Component {

  componentDidMount()
  {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render() {
    const HomePage=()=>{
      return(
        <Home dish={this.props.dishes.dishes.filter(c=>c.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess = {this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter(c=>c.featured)[0]}
        promosLoading={this.props.promotions.isLoading}
        promosErrMess = {this.props.promotions.errMess}
        leader={this.props.leaders.leaders.filter(c=>c.featured)[0]}
        leadersLoading={this.props.leaders.isLoading}
        leadersErrMess = {this.props.leaders.errMess}
        />
        
      )
    }

    const DishWithId=({match})=>
    {

      return(
        <Dishdetail dish={this.props.dishes.dishes.filter(c=>c.id===parseInt(match.params.dishId,10))[0]}
        isLoading={this.props.dishes.isLoading}
        errMess = {this.props.dishes.errMess}
        comments ={this.props.comments.comments.filter(c=>c.dishId===parseInt(match.params.dishId,10))}
        commentsErrMess = {this.props.comments.errMess}
        postComment={this.props.postComment}
        />
      )
    }


    return (
      <div>
        <Header />
        <div>
          <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders.leaders} />} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              
              <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
              <Redirect to="/home" />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
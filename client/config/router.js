import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'
import {
	inject,
	observer,
} from 'mobx-react'
import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import TopicCreate from '../views/topic-create'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={
			(props) => (
				isLogin ?
					<Component {...props} /> :
					<Redirect
						to={{
							pathname: '/user/login',
							search: `?from=${rest.path}`,
						}}
					/>
			)
		}
	/>
)

const InjectedPrivateRoute = withRouter(inject((stores) => {
	return {
		isLogin: stores.appState.user.isLogin,
	}
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
	isLogin: PropTypes.bool,
	component: PropTypes.element.isRequired,
}

PrivateRoute.defaultProps = {
	isLogin: false,
}

export default () => [
	<Route key="first" path="/" render={() => <Redirect to="/index" />} exact/>,
	<Route key="list" path="/index" component={TopicList}/>,
	<Route key="detail" path="/detail/:id" component={TopicDetail}/>,
	<Route key="login" path="/user/login" component={UserLogin}/>,
	<InjectedPrivateRoute key="info" path="/user/info" component={UserInfo}/>,
	<InjectedPrivateRoute key="create" path="/topic/create" component={TopicCreate}/>,
]

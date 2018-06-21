import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import TestApi from '../views/test/api.test'

export default () => [
	<Route key={0} path="/" render={() => <Redirect to="/list"/>} exact/>,
	<Route key={1} path="/list" component={TopicList}/>,
	<Route key={2} path="/detail" component={TopicDetail}/>,
	<Route key={3} path="/test" component={TestApi}/>,
]

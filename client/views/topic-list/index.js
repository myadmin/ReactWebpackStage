import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'

@inject(stores => {
	return {
		appState: stores.appState,
		topicStore: stores.topicStore,
	}
}) @observer
export default class TopicList extends React.Component {
	static contextTypes = {
		router: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.changeTab = this.changeTab.bind(this)
		this.listItemClick = this.listItemClick.bind(this)
	}

	componentDidMount() {
		const tab = this.getTab()
		this.props.topicStore.fetchTopics(tab)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
		}
	}

	getTab(search) {
		search = search || this.props.location.search
		const query = queryString.parse(search)
		return query.tab || 'all'
	}

	changeTab(e, value) {
		this.context.router.history.push({
			pathname: '/index',
			search: `?tab=${value}`,
		})
	}

	listItemClick(topic) {
		this.context.router.history.push(`/detail/${topic.id}`)
	}

	bootstrap() {
		const query = queryString.parse(this.props.location.search)
		const tab = query.tab
		return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
			return true
		}).catch(() => {
			return false
		})
	}

	render() {
		const { topicStore } = this.props
		const topicList = topicStore.topics
		const { createdTopics } = topicStore
		const syncingTopics = topicStore.syncing
		const tab = this.getTab()
		const { user } = this.props.appState

		return (
			<Container>
				<Helmet>
					<title>This is topic list</title>
					<meta name="description" content="This is description"/>
				</Helmet>
				<Tabs value={tab} onChange={this.changeTab}>
					{
						Object.keys(tabs).map((t) => <Tab key={t} label={tabs[t]} value={t} />)
					}
				</Tabs>
				{
					createdTopics && createdTopics.length > 0 ?
						<List style={{ backgroundColor: '#dfdfdf' }}>
							{
								createdTopics.map(topic => {
									topic = Object.assign({}, topic, {
										author: user.info,
									})
									return (
										<TopicListItem
											key={topic.id}
											onClick={() => this.listItemClick(topic)}
											topic={topic}
										/>
									)
								})
							}
						</List> :
						null
				}
				<List>
					{
						topicList.map(topic => <TopicListItem key={topic.id} onClick={() => this.listItemClick(topic)} topic={topic} />)
					}
				</List>
				{
					syncingTopics ?
						(
							<div style={
								{
								display: 'flex',
								justifyContent: 'space-around',
								padding: '40px 0',
							}}
							>
								<CircularProgress color="secondary" size={100} />
							</div>
						) :
						null
				}
			</Container>
		)
	}
}

TopicList.wrappedComponent.propTypes = {
	topicStore: PropTypes.object.isRequired,
	appState: PropTypes.object.isRequired,
}

TopicList.propTypes = {
	location: PropTypes.object.isRequired,
}


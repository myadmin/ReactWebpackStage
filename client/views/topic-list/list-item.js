import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import dateFormat from 'dateformat'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { topicPrimaryStyle, topicSecondaryStyle } from './styles'
import { tabs } from '../../util/variable-define'

const Primary = ({ classes, topic }) => {
	const classNames = cs({
		[classes.tab]: true,
		[classes.top]: topic.top,
		[classes.good]: topic.good,
	})

	return (
		<div className={classes.root}>
			<span className={classNames}>
				{topic.top ?
					'置顶' :
				topic.good ?
					'精华' :
					tabs[topic.tab]
				}
			</span>
			<span className={classes.title}>{topic.title}</span>
		</div>
	)
}

const Secondary = ({ classes, topic }) => (
	<span className={classes.root}>
		<span className={classes.userName}>{topic.author.loginname}</span>
		<span className={classes.count}>
			<span className={classes.accentColor}>{topic.reply_count}</span>
			<span>/</span>
			<span>{topic.visit_count}</span>
		</span>
		<span>创建时间：{dateFormat(topic.create_at, 'yy年mm月dd日')}</span>
	</span>
)

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)
const StyleSecondary = withStyles(topicSecondaryStyle)(Secondary)

Primary.propTypes = {
	topic: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}

Secondary.propTypes = {
	topic: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}

const TopicListItem = ({ onClick, topic }) => (
	<ListItem button onClick={onClick}>
		<Avatar src={topic.author.avatar_url} />
		<ListItemText primary={<StyledPrimary topic={topic} />} secondary={<StyleSecondary topic={topic} />}/>
	</ListItem>
)

TopicListItem.propTypes = {
	onClick: PropTypes.func.isRequired,
	topic: PropTypes.object.isRequired,
}

export default TopicListItem

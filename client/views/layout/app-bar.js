import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
	inject,
	observer,
} from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'

const styles = {
	root: {
		width: '100%',
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
}

@inject((stores) => {
	return {
		appState: stores.appState,
	}
}) @observer

class MainAppBar extends React.Component {
	static contextTypes = {
		router: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.onHomeIconClick = this.onHomeIconClick.bind(this)
		this.createButtonClick = this.createButtonClick.bind(this)
		this.loginButtonClick = this.loginButtonClick.bind(this)
	}

	onHomeIconClick() {
		this.context.router.history.push('/index?tab=all')
	}

	createButtonClick() {
		this.context.router.history.push('/topic/create')
	}

	loginButtonClick() {
		if (this.props.appState.user.isLogin) {
			this.context.router.history.push('/user/info')
		} else {
			this.context.router.history.push('/user/login')
		}
	}

	render() {
		const { classes } = this.props
		const { user } = this.props.appState
		// console.log(this.props.appState)	// eslint-disable-line
		return (
			<div className={classes.root}>
				<AppBar position="fixed">
					<ToolBar>
						<IconButton color="inherit" onClick={this.onHomeIconClick}>
							<HomeIcon />
						</IconButton>
						<Typography type="title" color="inherit" className={classes.flex}>
							CNode
						</Typography>
						<Button variant="raised" color="primary" onClick={this.createButtonClick}>
							新建话题
						</Button>
						<Button variant="default" color="inherit" onClick={this.loginButtonClick}>
							{
								user.isLogin ? user.info.loginname : '登录'
							}
						</Button>
					</ToolBar>
				</AppBar>
			</div>
		)
	}
}

MainAppBar.wrappedComponent.propTypes = {
	appState: PropTypes.object.isRequired,
}

MainAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)

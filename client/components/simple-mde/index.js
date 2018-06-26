import React from 'react'
import PropTypes from 'prop-types'
import generateId from './id-generator'

const NOOP = () => {}

export default class Editor extends React.Component {
	constructor() {
		super()

		this.state = {
			keyChange: false,
		}
	}

	componentWillMount() {
		const id = this.props.id

		if (id) {
			this.id = id
		} else {
			this.id = generateId()
		}
	}

	componentDidMount() {
		if (typeof window !== 'undefined') {
			this.createEditor()
			this.addEvents()
			this.addExtraKeys()
			this.getCursor()
			this.getMdeInstance()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!this.state.keyChange &&
			nextProps &&
			nextProps.value !== this.simplemde.value()
		) {
			this.simplemde.value((nextProps && nextProps.value) || '')
		}

		this.setState({
			keyChange: false,
		})
	}

	componentWillUnmount() {
		this.removeEvents()
	}

	getMdeInstance = () => {
		if (this.props.getMdeInstance) {
			this.props.getMdeInstance(this.simplemde)
		}
	}

	getCursor = () => {
		// https://codemirror.net/doc/manual.html#api_selection
		if (this.props.getLineAndCursor) {
			this.props.getLineAndCursor(this.simplemde.codemirror.getCursor())
		}
	}

	createEditor = () => {
		const SimpleMDE = require('simplemde')	// eslint-disable-line
		const initialOptions = {
			element: document.getElementById(this.id),
			initialValue: this.props.value,
		}
		const allOptions = Object.assign({}, initialOptions, this.props.options)
		this.simplemde = new SimpleMDE(allOptions)
	}

	addExtraKeys = () => {
		// https://codemirror.net/doc/manual.html#option_extraKeys
		if (this.props.extraKeys) {
			this.simplemde.codemirror.setOption('extraKeys', this.props.extraKeys)
		}
	}

	eventWrapper = () => {
		this.setState({
			keyChange: true,
		})
		this.props.onChange(this.simplemde.value())
	}

	removeEvents = () => {
		this.editorEl.removeEventListener('keyup', this.eventWrapper)
		if (this.editorToolbarEl) {
			this.editorToolbarEl.removeEventListener('click', this.eventWrapper)
		}
	}

	addEvents = () => {
		const wrapperId = `${this.id}-wrapper`
		const wrapperEl = document.getElementById(`${wrapperId}`)
		if (wrapperEl) {
			this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0]
			this.editorToolbarEl = wrapperEl.getElementsByClassName(
				'editor-toolbar',
			)[0]

			this.editorEl.addEventListener('keyup', this.eventWrapper)
			if (this.editorToolbarEl) {
				this.editorToolbarEl.addEventListener('click', this.eventWrapper)
			}

			this.simplemde.codemirror.on('cursorActivity', this.getCursor)
		}
	}

	render() {
		return (
			<div id={`${this.id}-wrapper`} className={this.props.className}>
				{this.props.label && (
					<label htmlFor={this.id}> {this.props.label} </label>
				)}
				<textarea id={this.id} />
			</div>
		)
	}
}

Editor.defaultProps = {
	onChange: NOOP,
	options: {},
	className: '',
	extraKeys: '',
	id: '',
}

Editor.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	extraKeys: PropTypes.string,
	options: PropTypes.object,
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string.isRequired,
	getMdeInstance: PropTypes.func,
	getLineAndCursor: PropTypes.func,
}

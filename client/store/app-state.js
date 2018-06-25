import {
	observable,
	action,
	toJS,
} from 'mobx'
import { get, post } from '../util/http'

export default class AppState {
	@observable user = {
		isLogin: false,
		info: {},
		detail: {
			recentTopics: [],
			recentReplies: [],
			syncing: false,
		},
		collection: {
			syncing: false,
			list: [],
		},
	}

	init({ user }) {
		if (user) {
			this.user = user
		}
	}

	@action login(accessToken) {
		return new Promise((resolve, reject) => {
			post('/user/login', {}, {
				accessToken,
			}).then(res => {
				if (res.success) {
					this.user.isLogin = true
					this.user.info = res.data
					resolve()
				} else {
					reject(res)
				}
			}).catch(reject)
		})
	}

	@action getUserDetail() {
		this.user.detail.syncing = true
		return new Promise((resolve, reject) => {
			get(`/user/${this.user.info.loginname}`)
				.then(res => {
					if (res.success) {
						this.user.detail.recentReplies = res.data.recent_replies
						this.user.detail.recentTopics = res.data.recent_topics
						resolve()
					} else {
						reject()
					}
					this.user.detail.syncing = false
				})
				.catch(err => {
					this.user.detail.syncing = false
					reject(err)
				})
		})
	}

	@action getUserCollection() {
		this.user.collection.syncing = true
		return new Promise((resolve, reject) => {
			get(`/topic_collect/${this.user.info.loginname}`)
				.then(res => {
					if (res.success) {
						this.user.collection.list = res.data
						resolve()
					} else {
						reject()
					}
					this.user.collection.syncing = false
				})
				.catch(err => {
					this.user.collection.syncing = false
					reject(err)
				})
		})
	}

	toJson() {
		return {
			user: toJS(this.user),
		}
	}
}


'use strict';
const Ora = require('ora');
const logUpdate = require('log-update');

const spinner = new Ora();

class Render {
	update(title, context) {
		this.title = title;
		this.context = context ? context : '';
	}

	start() {
		if (this._id) {
			return;
		}

		this._id = setInterval(() => {
			const out = (this.context && this.context.length > 0) ? `${spinner.frame()}${this.title}\n${this.context}` : this.title;
			logUpdate(out);
		}, 100);
	}

	end() {
		if (this._id) {
			clearInterval(this._id);
		}
		logUpdate.done();
	}
}

module.exports = new Render();

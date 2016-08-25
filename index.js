'use strict';
const path = require('path');
const PixivAppApi = require('pixiv-app-api');
const pixivImg = require('pixiv-img');
const delay = require('delay');
const co = require('co');
const indentString = require('indent-string');
const logSymbols = require('log-symbols');
const cliTruncate = require('cli-truncate');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const dotProp = require('dot-prop');
const sanitize = require('sanitize-filename');
const prettyMs = require('pretty-ms');
const render = require('./render');

const renderInfo = (name, value) => {
	const meta = chalk.gray(name);
	return `${meta} ${value}`;
};

module.exports = (input, opts) => {
	if (typeof input !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof input}`);
	}

	opts = opts || {};

	if (opts.output) {
		mkdirp.sync(opts.output);
	}

	const pixiv = new PixivAppApi(opts.username, opts.password);

	render.start();
	render.update('Start downloading');

	return co(function * () {
		const result = input === 'ranking' ?
			yield pixiv.illustRanking({mode: opts.mode}) :
			yield pixiv.searchIllust(input);

		let list = result.illusts;

		while (true) { // eslint-disable-line no-constant-condition
			if (!pixiv.hasNext()) {
				break;
			}
			const result = yield pixiv.next();
			list = [].concat(list, result.illusts);
			render.update('Get metadata', `${list.length}`);
			yield delay(opts.delay);
		}

		const hasImageUrl = x => x.meta_single_page.original_image_url;
		const bookmark = x => x.total_bookmarks >= opts.bookmark;
		const filters = [hasImageUrl, bookmark];
		list = list.filter(x => filters.every(filter => filter(x)));
		const len = list.length;

		const start = new Date();

		for (let i = 0; i < len; ++i) {
			const ratio = Math.min(Math.max((i + 1) / len, 0), 1);
			const percent = ratio * 100;

			const elapsed = new Date() - start;
			let eta = percent === 100 ? 0 : elapsed * ((len / (i + 1)) - 1);
			eta = (isNaN(eta) || !isFinite(eta)) ? 0.0 : eta;

			const x = list[i];
			const orignalImgUrl = x.meta_single_page.original_image_url;
			if (!orignalImgUrl) {
				continue;
			}

			const outputFile = () => {
				if (opts.name) {
					const parsed = opts.name.trim().split('-');
					return parsed
						.filter(v => dotProp.has(x, v))
						.map(v => dotProp.get(x, v))
						.join('-') + path.extname(orignalImgUrl);
				}
				return path.basename(orignalImgUrl);
			};

			const outputPath = path.resolve(opts.output, sanitize(outputFile()));

			const title = `${chalk.yellow('Downloading')} ${input} ${i + 1}/${len} (${prettyMs(eta)})`;
			const out = [
				['title', chalk.bold(x.title)],
				['name', `${x.user.name} (${x.user.account})`],
				['caption', cliTruncate(x.caption, process.stdout.columns - 3)],
				['bookmark', x.total_bookmarks],
				['output', outputPath]
			].map(v =>
				renderInfo(v[0], v[1])
			).join('\n');

			render.update(title, indentString(out, 2));

			yield pixivImg(orignalImgUrl, outputPath);
			yield delay(opts.delay);
		}

		render.update(`${logSymbols.success} download finish`);
		yield delay(100);
		render.end();
	}).catch(err => {
		return Promise.resolve().then(() => {
			render.update(`${logSymbols.error} download failer`);
			return delay(100);
		}).then(() => {
			render.end();
			return Promise.reject(err);
		});
	});
};

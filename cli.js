#!/usr/bin/env node
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const Conf = require('conf');
const pixivDl = require('./');

const config = new Conf();

const cli = meow(`
	Usage
	  $ pixiv-dl [input]

	Options
	  --uername, -u   pixiv username (use cache)↲
	  --password, -p  pixiv password (use cache)↲
	  --output, -o    output directory [Default: curret dir]
	  --name, -n      custom filename

	Examples
	  $ pixiv-dl リゼロ10000users入り --username hoge --password fuga
	  $ pixiv-dl リゼロ10000users入り --output rezero --name user.account-title

`, {
	alias: {
		output: 'o',
		name: 'n',
		username: 'u',
		password: 'p'
	},
	default: {
		output: process.cwd()
	}
});

updateNotifier({pkg: cli.pkg}).notify();

if (!cli.input[0]) {
	console.log('required word');
	process.exit(1);
}

const opts = cli.flags;


opts.username = opts.username || config.get('username');
opts.password = opts.password || config.get('password');

if (!(opts.username && opts.password)) {
	console.log('require username && password');
	process.exit(1);
}

pixivDl(cli.input[0], opts);

config.set('username', opts.username);
config.set('password', opts.password);

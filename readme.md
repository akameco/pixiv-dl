# pixiv-dl [![Build Status](https://travis-ci.org/akameco/pixiv-dl.svg?branch=master)](https://travis-ci.org/akameco/pixiv-dl)

[![Greenkeeper badge](https://badges.greenkeeper.io/akameco/pixiv-dl.svg)](https://greenkeeper.io/)

> pixiv image downloader

<img src="screenshot.gif">


## Install

```
$ npm install --global pixiv-dl
```

## Usage

```
$ pixiv-dl --help


  pixiv image downloader

  Usage
    $ pixiv-dl [input]

  Options
    --uername, -u   pixiv username (use cache)↲
    --password, -p  pixiv password (use cache)↲
    --output, -o    output directory [Default: curret dir]
    --name, -n      custom filename
    ranking         ranking mode
      day | week | month | day_male | day_female | week_original | week_rookie | day_mang
      day_r18 | day_male_r18 | day_female_r18 | week_r18 | week_r18g

  Examples
    $ pixiv-dl リゼロ10000users入り --username hoge --password fuga
    $ pixiv-dl リゼロ10000users入り --output rezero --name user.account-title
    $ pixiv-dl ranking day --output rezero --name user.account-title
```

## License

MIT © [akameco](http://akameco.github.io)

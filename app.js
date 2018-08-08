#!/usr/bin/env node

'use strict';
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const VERSION = require('./package.json').version
const program = require('commander')
const request = require('request')
const base = request.defaults({
  headers: {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Origin': 'http://115.com',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer': 'http://115.com/?cid=0&offset=0&mode=wangpan',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7',
    'Cookie': 'PHPSESSID=fipsocmrioqt77uirqol0dfgjd; 115_lang=zh; UID=593148792_A1_1533546332; CID=037c1d9ce9f652747efd5800c8ce7ec9; SEID=d2e9521c04e23847e0b17d2686d6c031d39ea5c33d99a53a0256885323477b46a2cf7435bfd877b730689b2f621f7cc631dbebb5b55582f056ac42da'
  }
})

program
  .version(VERSION, '-v, --version')
  .option('-s --source [string]', '路径')
  .parse(process.argv)

const path = program.source
fs.readdirAsync(path).then(async files => {
  return Promise.each(files, item => {
    if (item === '.DS_Store') return Promise.resolve()
    const _path = fs.readFileSync(`${path}/${item}/${item}-magnet.txt`, 'utf8')
    download(_path)
  })
})

function download (url) {
  base
    .post('http://115.com/web/lixian/?ct=lixian&ac=add_task_url')
    .form({
      url: url,
      uid: '593148792',
      sign: '4adaff1f929477884d15da1c3bcf489c',
      time: '1533620614'
    })
    .on('response', response => {
      console.log(response.body)
      // console.log(data)
    })
    .on('error', error => {
      console.log('错误')
      // console.log(error)
    })
}
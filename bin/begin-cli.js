#! /usr/bin/env node

const fs = require('fs');
const program = require('commander'); //可以解析用户输入的命令。
const download = require('download-git-repo'); //下载git上的文件
const handlebars = require('handlebars'); //渲染模版  对package.json进行修改
const inquirer = require('inquirer'); //与用户询问的交互
const ora = require('ora'); //一个优雅地命令行交互spinner
const chalk = require('chalk'); // 改变命令行输出样式
const symbols = require('log-symbols');

program.version('1.0.0', '-v,--version') //版本号
  .command('init <name>') //执行init name命令
  .action((name) => { //执行init name后发生的事情
    if (!fs.existsSync(name)) {
      inquirer.prompt([{
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answers) => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download('https://github.com:zwl1233/Testcli-vue-template', name, {
          clone: true
        }, (err) => {
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            }
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green('项目初始化完成'));
          }
        })
      })
    } else {
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  });
program.parse(process.argv);
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const i18n = require("i18n");
const user_local = require('get-user-locale');


const prompts = require('./prompts');

module.exports = class extends Generator {

  initializing() {
    this.props = {};

    i18n.configure({
      locales: ['zh', 'en'],
      directory: __dirname + '/locales',
      defaultLocale: 'en',
      register: global
    });
    
    i18n.setLocale(user_local.getUserLocale().substr(0, 2));
  }

  prompting() {
    this.log(yosay(__mf('welcome', chalk.red('unity-package'))));
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    /*
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.projectName + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }

    // 写README.md
    const readmeTpl = _.template(this.fs.read(this.templatePath('README_tmpl.md')));
    this.fs.write(this.destinationPath('README.md'), readmeTpl({
      projectTitle: this.props.projectTitle,
      projectDesc: this.props.projectDesc
    }));

    // 写package.json
    const pkg = this.fs.readJSON(this.templatePath('package_tmpl.json'), {});
    extend(pkg, {
      devDependencies: {
        "webpack": "^3.0.0"
      }
    });
    pkg.keywords = pkg.keywords || [];
    pkg.keywords.push('generator-webpack-example');

    pkg.name = this.props.projectName;
    pkg.description = this.props.projectDesc;
    pkg.main = this.props.projectMain;
    pkg.author = this.props.projectAuthor;
    pkg.license = this.props.projectLicense;

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    // 创建dist目录
    mkdirp('dist');

    // 写index.html
    const indexHtmlTpl = _.template(this.fs.read(this.templatePath('index_tmpl.html')));
    this.fs.write(this.destinationPath('dist/index.html'), indexHtmlTpl({
      projectName: this.props.projectName
    }));

    // 创建src目录
    mkdirp('src');

    // 写webpack.config.js
    this.fs.copy(
      this.templatePath('webpack_tmpl.config.js'),
      this.destinationPath('webpack.config.js')
    );

    // 写index.js
    this.fs.copy(
      this.templatePath('index_tmpl.js'),
      this.destinationPath('src/index.js')
    );
    */
  }
};
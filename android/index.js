'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const i18n = require("i18n");
const user_local = require('get-user-locale');
const rename = require("gulp-rename");
const loadJsonFile = require('load-json-file');


const { __mf } = require('i18n');

module.exports = class extends Generator {

  initializing() {

    this.props = {};

    if (!this.config.existed) {
      this.log(yosay("it`s not a unity-package project"));
      process.exit(1);
    }

    i18n.configure({
      locales: ['zh', 'en'],
      directory: __dirname + '/../locales',
      defaultLocale: 'en',
      register: global
    });
    
    i18n.setLocale(user_local.getUserLocale().substr(0, 2));
  }

  prompting() {
    this.log(yosay(__mf('welcome', chalk.red('unity-package:android'))));
  }

  writing() {

    var THAT = this.config.get('install-info');
    var repositoryPath = path.join(this.destinationRoot(), "Repository");

    this.registerTransformStream(rename(function(p) {
        var basename = p.basename.replace(/\[PackageName\]/g, THAT.packageName);
        basename = basename.replace(/\[ProjectName\]/g, THAT.projectName);
        p.basename = basename;
        var dirname = p.dirname.replace(/\[PackageName\]/g, THAT.packageName);
        dirname = dirname.replace(/\[ProjectName\]/g, THAT.projectName);
        p.dirname = dirname;
      }));

    this.fs.copyTpl(
      this.templatePath('**'), 
      path.join(this.destinationPath()),
      {
        ...THAT,
        ...{
          repositoryPath: repositoryPath
        }
      }
    );
  }

  end() {    
    this.spawnCommandSync('npx', ['gitignore', 'android']);
  }
};
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

    var done = this.async();

    loadJsonFile(this.destinationPath('package.json'))
    .then((data) => {
      this.props.packageName = data.name;
      this.props.projectName = data.displayName;
      done();
    })
    .catch((er) => {
      this.log(yosay("it`s not a unity-package project"));
      process.exit(1);
    });

    i18n.configure({
      locales: ['zh', 'en'],
      directory: __dirname + '/../locales',
      defaultLocale: 'en',
      register: global
    });
    
    i18n.setLocale(user_local.getUserLocale().substr(0, 2));
  }

  prompting() {
    this.log(yosay(__mf('welcome', chalk.red('unity-package:sandbox'))));
  }

  writing() {

    var THAT = this;

    this.registerTransformStream(rename(function(p) {
        var basename = p.basename.replace(/\[YourPackageName\]/g, THAT.props.packageName);
        basename = basename.replace(/\[ProjectName\]/g, THAT.props.projectName);
        p.basename = basename;
        var dirname = p.dirname.replace(/\[YourPackageName\]/g, THAT.props.packageName);
        dirname = dirname.replace(/\[ProjectName\]/g, THAT.props.projectName);
        p.dirname = dirname;
      }));

    this.fs.copyTpl(
      this.templatePath('**'), 
      path.join(this.destinationPath(), "Workspace~"),
      this.config.get('info')
    );
  }

  end() {
    this.log(yosay("Finished! Goodbye~"));
  }
};
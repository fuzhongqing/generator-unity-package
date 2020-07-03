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

const { __mf } = require('i18n');

module.exports = class extends Generator {

  initializing() {

    if (this.config.get('info') == undefined) {
        this.log(yosay("it's not a unity-packge project"));
        process.exit(1);
    }

    this.props = this.config.get('info');

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

    this.log(this.destinationPath());
    

    if (path.basename(this.destinationPath()) !== this.props.projectName) {
        this.log(i18n.__mf('nopath', chalk.green(this.props.projectName)));
        mkdirp(this.props.projectName);
        this.destinationRoot(path.join(this.destinationPath(), this.props.projectName));
      }

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
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const i18n = require("i18n");
const user_local = require('get-user-locale');
const yoPackage = require('../package.json');
const rename = require("gulp-rename");
const spinner = require('cli-spinner');



const prompts = require('./prompts');
const { __mf } = require('i18n');

module.exports = class extends Generator {

  initializing() {
    this.props = {};

    i18n.configure({
      locales: ['zh', 'en'],
      directory: __dirname + '/../locales',
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
    var THAT = this;

    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(i18n.__mf('nopath', chalk.green(this.props.projectName)));
      mkdirp(this.props.projectName);
      this.destinationRoot(path.join(this.destinationPath(), this.props.projectName));
    }

    const repositoryPath = path.join(this.destinationRoot(), "Repository");

    this.registerTransformStream(rename(function(p) {
      var basename = p.basename.replace(/\[PackageName\]/g, THAT.props.packageName);
      basename = basename.replace(/\[ProjectName\]/g, THAT.props.projectName);
      p.basename = basename;
      var dirname = p.dirname.replace(/\[PackageName\]/g, THAT.props.packageName);
      dirname = dirname.replace(/\[ProjectName\]/g, THAT.props.projectName);
      p.dirname = dirname;
    }));

    var opts = {
      unityVersion: this.props.unityVersion,
      projectName: this.props.projectName,
      packageName: this.props.packageName,
      projectDescription: this.props.description,
      yoHomePage: yoPackage.homepage,
      yoIssues: yoPackage.bugs.url
    };

    this.fs.copyTpl(
      this.templatePath('**'), 
      repositoryPath,
      opts
    );

    this.config.set('install-info', opts);

    
    // process package.json
    const pkg = {
      "name": "",
      "version": "",
      "displayName": "",
      "description": "",
      "unity": "",
      "dependencies": {
      },
      "keywords": [
      ],
      "author": {
        "name": "",
        "email": "",
        "url": ""
      }
    }

    pkg.name = this.props.packageName;
    pkg.version = this.props.version;
    pkg.displayName = this.props.projectName;
    pkg.description = this.props.description;
    pkg.unity = this.props.unityVersion;
    pkg.author.name = this.props.author;


    this.fs.writeJSON(path.join(repositoryPath, 'package.json'), pkg);
    this.config.save();
  }

  install() {
    this.yarnInstall(['unity-package-cli', 'gitignore']);
  }

  end() {

    var obj = new spinner.Spinner({
    text: 'add gitignore..... %s',
    stream: process.stderr,
    onTick: function(msg){
        this.clearLine(this.stream);
        this.stream.write(msg);
    }
    });
    this.spawnCommandSync('npx', ['gitignore', 'node']);
    obj.stop(true);
    if (this.props.extensions.indexOf("sandbox") > -1) {
      this.spawnCommandSync('yo', ['unity-package:sandbox']);
    }
    if (this.props.extensions.indexOf("android-plugin") > -1) {
      this.spawnCommandSync('yo', ['unity-package:android']);
    }
    this.log(yosay("Finished! Goodbye~"));
  }
};
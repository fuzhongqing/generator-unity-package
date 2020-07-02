'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const i18n = require("i18n");
const user_local = require('get-user-locale');
const yo = require('../package.json');
const rename = require("gulp-rename");
const dep = require('./dependency');


const prompts = require('./prompts');
const { __mf } = require('i18n');

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
      this.config.set("key", "123");
      this.config.save();
    });
  }

  writing() {
    var THAT = this;

    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(i18n.__mf('nopath', chalk.green(this.props.projectName)));
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }

    // process package.json
    const pkg = this.fs.readJSON(this.templatePath('package.tmpl.json'), {});

    pkg.name = this.props.packageName;
    pkg.version = this.props.version;
    pkg.displayName = this.props.projectName;
    pkg.description = this.props.description;
    pkg.unity = this.props.unityVersion;
    pkg.author.name = this.props.author;
    pkg.dependencies = pkg.dependencies || {};

    this.props.dependencies.forEach(function(i) {
      pkg.dependencies[dep[i].name] = dep[i].version;
    });

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.registerTransformStream(rename(function(p) {
      p.basename = p.basename.replace(/\[YourPackageName\]/g, THAT.props.packageName);
      p.dirname = p.dirname.replace(/\[YourPackageName\]/g, THAT.props.packageName);
    }));

    // process readme
    this.fs.copyTpl(
      this.templatePath('README.tmpl.md'),
      this.destinationPath('README.md'),
      {
        projectName: this.props.projectName,
        packageName: this.props.packageName,
        projectDescription: this.props.description,
        yoHomePage: yo.homepage,
        yoIssues: yo.bugs.url
      }
    );

    this.fs.copy(
      this.templatePath("README.tmpl.md.meta"),
      path.join(this.destinationPath(), "README.md.meta"),
    )
    
    this.fs.copy(
      this.templatePath("package.tmpl.json.meta"),
      path.join(this.destinationPath(), "package.json.meta"),
    )
    
    var opts = {
      projectName: this.props.projectName,
      packageName: this.props.packageName,
      projectDescription: this.props.description,
      yoHomePage: yo.homepage,
      yoIssues: yo.bugs.url
    };

    this.fs.copyTpl(
      this.templatePath('Editor/**'), 
      path.join(this.destinationPath(), "Editor"),
      opts
    );

    this.fs.copy(
      this.templatePath("Editor.meta"),
      path.join(this.destinationPath(), "Editor.meta"),
    )

    this.fs.copyTpl(
      this.templatePath('Runtime/**'), 
      path.join(this.destinationPath(), "Runtime"),
      opts
    );

    this.fs.copy(
      this.templatePath("Runtime.meta"),
      path.join(this.destinationPath(), "Runtime.meta"),
    )

    this.fs.copyTpl(
      this.templatePath('Tests/**'), 
      path.join(this.destinationPath(), "Tests"),
      opts
    );

    this.fs.copy(
      this.templatePath("Tests.meta"),
      path.join(this.destinationPath(), "Tests.meta"),
    );
  }

  end() {
    this.log(yosay("Finished! Goodbye~"));
  }
};
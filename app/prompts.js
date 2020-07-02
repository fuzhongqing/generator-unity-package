module.exports = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Please input project name (webpack-example):',
      default: 'webpack-example'
    },
    {
      type: 'input',
      name: 'projectTitle',
      message: 'Please input project title (webpack示例):',
      default: 'webpack示例'
    },
    {
      type: 'input',
      name: 'projectDesc',
      message: 'Please input project description:'
    },
    {
      type: 'input',
      name: 'projectMain',
      message: 'Main file (src/index.js):',
      default: 'src/index.js'
    },
    {
      type: 'input',
      name: 'projectAuthor',
      message: 'Author (yanyinhong):',
      default: 'yanyinhong'
    },
    {
      type: 'list',
      name: 'projectLicense',
      message: 'Please choose license:',
      choices: ['MIT', 'ISC', 'Apache-2.0', 'AGPL-3.0']
    }
  ]
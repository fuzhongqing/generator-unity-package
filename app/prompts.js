
module.exports = [
    {
      type: 'input',
      name: 'projectName',
      default: 'UnityPackage'
    },
    {
      type: 'input',
      name: 'packageName',
      default: 'your.package.name'
    },
    {
      type: 'input',
      name: 'version',
      default: '0.0.1'
    },
    {
      type: 'input',
      name: 'description',
      default: 'An Unity Package!'
    },
    {
      type: 'list',
      name: 'unityVersion',
      choices: ['2017.1', '2018.4', '2019.1']
    },
    {
      type: 'checkbox',
      name: 'extensions',
      choices: ['sandbox', 'android-plugin', 'iOS-plugin']
    },
    {
      type: 'input',
      name: 'author',
      default: 'anonymous'
    }
  ]
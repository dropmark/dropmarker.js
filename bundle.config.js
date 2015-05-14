module.exports = {
  bundle: {
    dropmarker: {
      scripts: [
        './src/paper-core.js',
        './src/tools/dropmarker-arrow.js',
        './src/tools/dropmarker-freehand.js',
        './src/dropmarker.js'
      ],
      options: {
        uglify: false,
        rev: false,
        maps: false
      }
    }
  }
};
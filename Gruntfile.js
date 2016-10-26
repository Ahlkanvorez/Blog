module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jasmine : {
      src : './**/*.js',
      specs : 'specs/**/*.js',
      helpers : 'specs/helpers/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-runner');

  grunt.registerTask('default', 'jasmine');
};
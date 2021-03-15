'use strict';

var _ = require('underscore');

/* Exclude External Libs From Application , This Will reduce File Size*/
var excludeFiles = {
  "angular": "empty:"
}

var bowerdir = 'bower_components',
  bowercopyFiles = {
    "app/": [
      'library/dist/app/',
      'title/dist/app/',
      'text/dist/app/',
      'image/dist/app/',
      'imageGallery/dist/app/',
      'button/dist/app/',
      'audio/dist/app/',
      'video/dist/app/',
      'videoyt/dist/app/',
      'videogallery/dist/app/',
      'question/dist/app/',
      'datalink/dist/app/',
      'accordion/dist/app/',
      'iGroup/dist/app/',
      'iVideo/dist/app/',
      'slider/dist/app/',
      'table/dist/app/',
      'list/dist/app/',
      'character/dist/app/',
      'quiz/dist/app/',
      'shapes/dist/app/',
      'timer/dist/app/',
      'date/dist/app/',
      'iCharts/dist/app/',
      'iPyramid/dist/app/',
      'iTimeline/dist/app/',
      'input/dist/app/',
      'swf/dist/app/'
    ]
  },
  watchBowerFiles = _.map(_.values(bowercopyFiles), function (path) {
    var addWildcard = path.indexOf('*') >= 0 ? '' : '**/*';
    // console.log([bowerdir, path, addWildcard].join('/'));
    return [bowerdir, path, addWildcard].join('/');
  });

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  var logfile = require('logfile-grunt');

  // Configurable paths for the application
  var config = {
    dist: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    serverPort: 3000,

    src: {
      srcfiles: ['<%= pkg.sourceDir %>/**/*.*']
    },
    html2js: {
      options: {
        base: '<%= dist %>',
        module: 'lqd.templates',
        singleModule: true,
        useStrict: true,
        htmlmin: {
          // collapseBooleanAttributes: true,
          collapseWhitespace: true,
          // removeAttributeQuotes: true,
          // removeComments: true,
          // removeEmptyAttributes: true,
          // removeRedundantAttributes: true,
          // removeScriptTypeAttributes: true,
          // removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        src: [
          'app/views/**/*.html'
        ],
        dest: '<%= pkg.sourceDir %>/templates.js'
      }
    },

    clean: {
      dist: ['<%= dist %>'],
      deps: ['<%= pkg.sourceDir %>/components', '<%= pkg.sourceDir %>/library'],
      release: [
        '<%= pkg.sourceDir %>/templates.js', '<%= pkg.sourceDir %>/tempStyles',
      ],
      styles: ['<%= pkg.sourceDir %>/tempStyles']
    },

    // Copies remaining files to places other tasks can use
    copy: {
      release: {
        files: [{
          src: ['<%= src.all %>'],
          dest: '<%= dist %>/'
        }]
      },
      styles: {

        files: [{
          expand: true,
          src: ['<%= pkg.sourceDir %>/**/*.css', '!<%= pkg.sourceDir %>/components/**/*.css', '!<%= pkg.sourceDir %>/Styles/appStyles.css'],
          dest: '<%= pkg.sourceDir %>/tempStyles/',
          flatten: true
        }]
      },
      distDeps: {
        files: [{
            cwd: '<%= pkg.sourceDir %>/library/fonts',
            expand: true,
            src: ['**/*'],
            dest: '<%= dist %>/fonts/'
          }, {
            cwd: '<%= pkg.sourceDir %>/library/assets',
            expand: true,
            src: ['**/*'],
            dest: '<%= dist %>/data/assets'
          }, {
            cwd: '<%= pkg.sourceDir %>',
            expand: true,
            src: ['views/**/*.png'],
            dest: '<%= dist %>/'
          }, {
            cwd: '<%= pkg.sourceDir %>/data',
            expand: true,
            src: ['**/*'],
            dest: '<%= dist %>/data/'
          }, {
            expand: true,
            src: [
              '<%= pkg.sourceDir %>/icon.png','<%= pkg.sourceDir %>/Nooor.png'

            ],
            dest: '<%= dist %>/',
            flatten: true
          },
          {
            expand: true,
            flatten: true,
            src: ['<%= dist %>/<%= pkg.name %>.js'],
            dest: '<%= dist %>/'
          }
          // , { cwd: '<%= pkg.sourceDir %>', expand: true, src: ['components/**/templates/**.html', 'components/templates/**/*.html'], dest: '<%= dist %>/' }
        ]
      }
    },
    bowercopy: {
      options: {
        clean: true
      },
      common: {
        files: bowercopyFiles
      }
    },
    preprocess: {
      // web: {
      //   src: '<%= pkg.sourceDir %>/index.html',
      //   dest: '<%= dist %>/index.html'
      // }

      main: {
        src: '<%= pkg.sourceDir %>/index.html',
        dest: '<%= dist %>/index.html'
      },
      subMain: {
        src: '<%= pkg.sourceDir %>/Pagetemplate.html',
        dest: '<%= dist %>/Pagetemplate.html'
      }

    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= pkg.sourceDir %>/tempStyles',
          src: ['*.css', '!*.min.css'],
          dest: '<%= pkg.sourceDir %>/tempStyles',
          ext: '.min.css'
        }]
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
              match: /..\/..\/library\//g,
              replacement: ''
            }, {
              match: /..\/..\/library\/assets/g,
              replacement: 'data/assets'
            },{
              match: /library\/assets\//g,
              replacement: 'data/assets/'
            },{
              match: /..\/..\/data\//g,
              replacement: 'data/'
            }, {
              match: /..\/app\//g,
              replacement: ''
            }

          ]
        },
        files: [{
            cwd: '<%= dist %>',
            expand: true,
            src: ['*.css', '**/*.css', '*.js', '!*.map'],
            dest: '<%= dist %>/'
          }

        ]
      }

    },

    requirejs: {
      compile: {
        options: {
          waitSeconds: 0,
          baseUrl: "<%= pkg.sourceDir %>",
          mainConfigFile: "<%= pkg.sourceDir %>/main.js",
          name: "library/js/almond", // assumes a production build using almond
          out: "<%= dist %>/<%= pkg.name %>.js",
          include: 'main',
          optimize: 'uglify2',
          paths: {},
          generateSourceMaps: true,
          uglify2: {
            mangle: false
          },
          useStrict: true
        }
      }
    },

    cacheBust: {

      options: {
        assets: ['css/**', '**.js', '**.css'],
        baseDir: '<%= dist %>',
        deleteOriginals: true

      },
      taskName: {
        files: [{
          expand: true,
          cwd: '<%= dist %>',
          src: ['*.html', 'views/*.html']
        }]

      }

    },
    concat_css: {
      options: {
        baseDir: '<%= dist %>/css'
      },
      dev: {
        src: ["<%= pkg.sourceDir %>/components/**/*.css"],
        dest: "<%= pkg.sourceDir %>/Styles/lqd.Cards.css"
      },
      devLib: {
        src: ["<%= pkg.sourceDir %>/library/**/*.css"],
        dest: "<%= pkg.sourceDir %>/Styles/lqd.library.css"
      },
      devEditor: {
        src: ["<%= pkg.sourceDir %>/views/**/*.css", "<%= pkg.sourceDir %>/views/**/**/*.css",
          "<%= pkg.sourceDir %>/Styles/lqdMain.css"
        ],
        dest: "<%= pkg.sourceDir %>/Styles/lqd.editor.css"
      },
      release: {
        src: ["<%= pkg.sourceDir %>/Styles/lqd.library.css",
          "<%= pkg.sourceDir %>/Styles/lqd.Cards.css",
          "<%= pkg.sourceDir %>/Styles/lqd.editor.css"
        ],
        dest: "<%= dist %>/styles.min.css"
      }
      // release: {
      //   src: ["<%= pkg.sourceDir %>/tempStyles/*.min.css"],
      //   dest: "<%= dist %>/styles.min.css"
      // },
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      files: {
        src: ['Gruntfile.js', '<%= src.js %>']
      }
    },
    uglify: {
      options: {
        mangle: false,
        beautify: false,
        lint: false,
        compress: {},
        warnings: false,
        sourceMap: true
      },
      my_target: {
        files: {
          "<%= dist %>/<%= pkg.name %>.min.js": [
            '<%= pkg.sourceDir %>/appConfig.js', '<%= dist %>/<%= pkg.name %>.js', '<%= pkg.sourceDir %>/templates.js'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: '<%= serverPort%>',
          base: 'app',
          livereload: true
        }
      }
    },
    exec: {
      server: {
        cmd: 'npm run dev'
      }
    }


  };

  // Define the configuration for all the tasks
  grunt.initConfig(config);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('RunServer', [
    'exec:server'
  ]);

  grunt.registerTask('initialize', [
    'clean:deps',
    'bowercopy',
    'concat_css:dev',
    'concat_css:devLib',
    'concat_css:devEditor'

  ]);

  //Run for the final release
  grunt.registerTask('releaseTest', [
    'clean:dist',
    'copy:release'

  ]);

  grunt.registerTask('preprocessRelease', [
    'preprocess:main'
  ]);

  grunt.registerTask('release', [
    'clean:styles',
    'copy:styles',
    'clean:dist',
    'html2js',
    'requirejs:compile',
    'cssmin',
    'copy:distDeps',
    'concat_css:release',
    // 'uglify',
    'preprocessRelease',
    'replace',
    'clean:release',
    'cacheBust'
  ]);


};
module.exports = function(grunt) {

  // Display the elapsed execution time of grunt tasks
  require('time-grunt')(grunt);
  // Load all grunt-* packages from package.json
  require('load-grunt-tasks')(grunt);

  // Load mozilla JPEG encoder
  var mozjpeg = require('imagemin-mozjpeg');
 
  // Project configuration
  grunt.initConfig({

    // This line makes your node configurations available for use
    pkg: grunt.file.readJSON('package.json'),

    // Message included in minified files
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },

    // Path helpers
    paths: {
      src: {
        js: 'src/js',
        css: 'src/css',
        jsAll: 'src/js/**/*.js',
        cssAll: 'src/css/**/*.css'
      },
      dest: {
        js: 'dist/js',
        jsMin: 'dist/js/main.min.js',
        css: 'dist/css',
        cssMin: 'dist/css/style.min.css'
      }
    },

    // check JS syntax & static analysis
    jshint: {
      files: ['<%= paths.src.jsAll %>', 'views/<%= paths.src.jsAll %>'],
      options: {
        // options here to override JSHint defaults
      }
    },

    // minify + compress js
    uglify: {
      options: {
        compress: {},
        mangle: true,
        sourceMap: true,
        banner: '<%= meta.banner %>'
      },
      static_mappings: {
        // Because these src-dest file mappings are manually specified, every
        // time a new file is added or removed, the Gruntfile has to be updated.
        files: [
          {src: '<%= paths.src.js %>/perfmatters.js', dest: '<%= paths.dest.jsMin %>'}
        ]
      },
      dynamic_mappings: {
        // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'src/',      // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
            dest: 'dist/',   // Destination path prefix.
            ext: '.min.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
          },
        ]
      }
    },

    // minify css
    cssmin: {
      static_mappings: {
        files: {
          '<%= paths.dest.css %>/style.min.css': ['<%= paths.src.css %>/style.css'],
          '<%= paths.dest.css %>/font.min.css': ['<%= paths.src.css %>/font.css'],
          '<%= paths.dest.css %>/print.min.css': ['<%= paths.src.css %>/print.css']
        }
      }
    },
    
    // resize-rename images
    responsive_images: {
      percentage: {
        options: {
          engine: 'im',
          newFilesOnly: true,
          sizes: [{
            name: 'small',
            width: '30%',
            suffix: '_small',
            quality: 20
          },{
            name: 'large',
            width: '50%',
            suffix: '_large',
            quality: 40
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'src/img/',
          dest: 'dist/img/'
        }]
      },
      thumbnails: {
        options: {
          engine: 'im',
          newFilesOnly: true,
          sizes: [{
            name: 'thumb',
            width: 115,
            suffix: '_x1',
            quality: 40
          },{
            name: 'icon',
            width: 70,
            suffix: '_x1',
            quality: 40
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{gif,jpg,png}'],
          cwd: 'src/img/',
          dest: 'dist/img/'
          //custom_dest: 'dist/img/{%= name %}/'
        }]
      },
      pizza: {
        options: {
          engine: 'im',
          newFilesOnly: true,
          sizes: [{
            name: 'thumb',
            width: 115,
            suffix: '_x1',
            quality: 20
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{gif,jpg,png}'],
          cwd: 'views/src/images/',
          dest: 'views/dist/images'
          //custom_dest: 'views/dist/images/{%= name %}/'
        }]
      }
    },

    // compress images
    imagemin: {                          // Task
      static: {                          // Target
        options: {                       // Target options
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: {                         // Dictionary of files
          'dist/img.png': 'src/img.png', // 'destination': 'source'
          'dist/img.jpg': 'src/img.jpg',
          'dist/img.gif': 'src/img.gif'
        }
      },
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          cwd: 'dist/img',               // Src matches are relative to this path
          dest: 'dist/img'    // Destination path prefix
        }, {
          expand: true,
          src: ['**/*.{png,jpg,gif}'],
          cwd: 'views/dist/images',  // pizza view
          dest: 'views/dist/images'
        }]
      }
    },

    // process HTML (inline css from external css files)
    processhtml: {
      test: {
        options: {
          process: true,
          includeBase: './',
          data: {
            title: 'My app',
            message: 'This is production distribution'
          }
        },
        files: {
          'dist/index.inlined.html': ['src/index.html']
        }
      },
      dist: {
        options: {
          process: true,
          includeBase: './',
          data: {
            title: 'My app',
            message: 'This is production distribution'
          }
        },
        files: {
          'index.html': ['src/index.html']
        }
      }
    },

    // minify html
    htmlmin: {
      test: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.min.html': 'dist/index.inlined.html'
        }
      },
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.html': 'index.html',
          'dist/index.html': 'index.html',
        }
      }
    },

    // check page speed insights
    pagespeed: {
      options: {
        nokey: true,
        url: "https://developers.google.com"
      },
      prod_desktop: {
        options: {
          url: "http://muratozgul.github.io/udacity_fewd_p4/",
          locale: "en_GB",
          strategy: "desktop",
          threshold: 0 //bug hotfix, otherwise hangs
        }
      },
      prod_mobile: {
        options: {
          url: "http://muratozgul.github.io/udacity_fewd_p4/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 0 //bug hotfix, otherwise hangs
        }
      }
    }
  });

  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('min', [
    'uglify:static_mappings',
    'cssmin:static_mappings',
    'processhtml:dist',
    'htmlmin:dist'
  ]);
  grunt.registerTask('img', [
    'responsive_images:thumbnails',
    'responsive_images:pizza',
    'imagemin:dynamic'
  ]);
  grunt.registerTask('speed', ['pagespeed:prod_desktop']);
  
  // For testing:
  // grunt.registerTask('jscomp', ['uglify:static_mappings']);
  // grunt.registerTask('csscomp', ['cssmin:static_mappings']);
  // grunt.registerTask('imgcomp', ['responsive_images:thumbnails', 'responsive_images:pizza']);
  // grunt.registerTask('imgopt', ['imagemin:dynamic']);
  // grunt.registerTask('inline', ['processhtml:test']);
  // grunt.registerTask('htmlcomp', ['htmlmin:test']);
};
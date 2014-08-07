module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            less: ["css/<%= pkg.name %>-<%= pkg.version %>.css"],
            product: ["css/**/*.css", "dist/*", "js/**/*.js", "img/*", "fonts/*"]
        },

        less: {
            develop: {
                files: {
                    "css/<%= pkg.name %>-<%= pkg.version %>.css": "src/style/ohfresh.less"
                }
            },
            product: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "css/<%= pkg.name %>-<%= pkg.version %>.min.css": "src/style/ohfresh.less"
                }
            }
        },

        uglify: {
            dependencies: {
                files: {
                    'dist/js/vendor.min.js': [
                        'bower_components/modernizr/modernizr.js',
                        'bower_components/respond/src/respond.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/moment/moment.js',
                        'bower_components/moment/lang/zh-cn.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-route/angular-route.js',
                        'bower_components/angular-touch/angular-touch.js',
                        'bower_components/angular-moment/angular-moment.js',
                        'bower_components/angular-translate/angular-translate.js',
                        'bower_components/angular-local-storage/angular-local-storage.js',
                        'bower_components/angular-carousel/dist/angular-carousel.js'
                    ]
                }
            },
            product: {
                options: {
                    banner: '/*!\n * @overview <%= pkg.name %>\n * @author <%= pkg.author%>\n * @version <%= pkg.version %>\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
                },

                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': [
                        'src/js/application.js',
                        'src/js/settings.js',
                        'src/js/lang/**/*.js',
                        'src/js/service/**/*.js',
                        'src/js/home/**/*.js',
                        'src/js/customer/**/*.js',
                        'src/js/order/**/*.js',
                        'src/js/address/**/*.js',
                        'src/js/product/**/*.js',
                        'src/js/routes.js'
                    ]
                }
            },
            template: {
                options: {
                    banner: '/*!\n * @overview <%= pkg.name %>-Bootstrap-Template\n * @author <%= pkg.author%>\n * @version <%= pkg.version %>\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
                },
                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>-bootstrap-tpl.min.js': [
                        'js/<%= pkg.name %>-<%= pkg.version %>-bootstrap-tpl.js'
                    ]
                }
            }
        },

        concat: {
            style: {
                src: [
                    'css/<%= pkg.name %>-<%= pkg.version %>.min.css',
                    'bower_components/fontawesome/css/font-awesome.min.css',
                    'bower_components/animate-css/animate.min.css'
                ],
                dest: 'dist/css/<%= pkg.name %>-<%= pkg.version %>-all.min.css'
            }
        },

        copy: {
            develop: {
                files: [
                    {expand: true, cwd: 'bower_components/fontawesome/fonts/', src: ['*'], dest: 'fonts/'},
                    {expand: true, cwd: 'bower_components/fontawesome/css/', src: ['*.min.css'], dest: 'css/'},
                    {expand: true, cwd: 'bower_components/bootstrap/fonts/', src: ['*'], dest: 'fonts/'}
                ]
            },
            product: {
                files: [
                    {expand: true, cwd: 'bower_components/fontawesome/fonts/', src: ['*'], dest: 'dist/fonts/'},
                    {expand: true, cwd: 'bower_components/bootstrap/fonts/', src: ['*'], dest: 'dist/fonts/'},
                    {expand: true, src: ['img/*'], dest: 'dist/'}
                ]
            }
        },

        imagemin: {
            dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/img',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'img'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist_index.html'
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            less: {
                files: ['src/style/**/*.less'],
                tasks: ['clean:less', 'less:develop']
            },
            img: {
                files: ['src/img/**'],
                tasks: ['imagemin']
            },
            tpl: {
                files: ['src/template/**/*.html'],
                tasks: ['ngtemplates']
            }
        },
        connect: {
            server: {
                options: {
                    port: 3100,
                    base: ''
                }
            }
        },
        open: {
            kitchen: {
                path: 'http://localhost:3100/'
            }
        },

        ngtemplates: {
            "bootstrap": {
                cwd: 'src/template/bootstrap',
                src: '**/*.html',
                dest: 'js/<%= pkg.name %>-<%= pkg.version %>-bootstrap-tpl.js',
                options: {
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
                    bootstrap: function (module, script) {
                        return '(function(angular){angular.module("ohFresh.template",[]).run(["$templateCache",function($templateCache){' + script + '}]);})(angular);';
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('server', ['connect', 'open', 'watch']);
    grunt.registerTask('cleanAll', ['clean:product']);
    grunt.registerTask('build', ['clean:less', 'less:develop', 'imagemin', 'copy:develop', 'ngtemplates']);
    grunt.registerTask('publish', ['clean', 'less:product', 'ngtemplates', 'uglify', 'concat', 'imagemin', 'htmlmin', 'copy:product']);
    grunt.registerTask('devlop', ['clean:less', 'less:develop', 'watch']);
}
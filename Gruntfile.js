(function () {
    'use strict';

    module.exports = function (grunt) {

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            banner: (
                '<% var subtask = uglify[grunt.task.current.target]; %>' +
                '/*!\n' +
                'Project:  <%= pkg.name %>\n' +
                'Name:     <%= subtask.name %>\n' +
                'Version:  <%= pkg.version %>\n' +
                'Compiled: <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'
            ),

            concat: {
                options: {
                    separator: ';'
                },
                dist: {
                    src: [
                        'js/core/required/*.js',
                        'js/core/add-ons/*.js',
                    ],
                    dest: 'js/q4.core.js'
                }
            },

            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                core: {
                    name: 'q4.core.js',
                    files: [{
                        src: 'js/q4.core.js',
                        dest: 'dist/js/q4.core.<%= pkg.version %>.min.js'
                    }]
                },
                app: {
                    name: 'q4.app.js',
                    files: [{
                        src: 'js/q4.app.js',
                        dest: 'dist/js/q4.app.<%= pkg.version %>.min.js'
                    }]
                }
            },

            //qunit: {
            //  files: ['test/**/*.html']
            //},

            jshint: {
                files: ['Gruntfile.js', 'js/q4.app.js'],
                options: {
                    // options here to override JSHint defaults
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true,
                        document: true
                    }
                }
            },

            // watch: {
            //     files: ['<%= jshint.files %>'],
            //     tasks: ['jshint', 'qunit']
            // },

            sass: {
                dist: {
                    options: {
                        style: 'expanded',
                        sourcemap: 'none'
                    },
                    files: {
                        'dist/css/classic/global.css': 'css/classic/global_master.scss',
                        'dist/css/classic/client.css': 'css/classic/client_master.scss',
                        'dist/css/classic/news-details.css': 'css/classic/news-details_master.scss',
                        // 'dist/css/newsclassic2019na1/global.css': 'css/newsclassic2019na1/global_master.scss',
                        // 'dist/css/newsclassic2019na1/client.css': 'css/newsclassic2019na1/client_master.scss',
                        // 'dist/css/newsclassic2019na1/news-details.css': 'css/studioclassic2018na1/news-details_master.scss',
                        'dist/css/studioclassic2018na1/global.css': 'css/studioclassic2018na1/global_master.scss',
                        'dist/css/studioclassic2018na1/client.css': 'css/studioclassic2018na1/client_master.scss',
                        'dist/css/studioclassic2018na1/news-details.css': 'css/studioclassic2018na1/news-details_master.scss',
                        'dist/css/studioclassic2018na2/global.css': 'css/studioclassic2018na2/global_master.scss',
                        'dist/css/studioclassic2018na2/client.css': 'css/studioclassic2018na2/client_master.scss',
                        'dist/css/studioclassic2018na2/news-details.css': 'css/studioclassic2018na2/news-details_master.scss',
                        'dist/css/studioclassic2018na3/global.css': 'css/studioclassic2018na3/global_master.scss',
                        'dist/css/studioclassic2018na3/client.css': 'css/studioclassic2018na3/client_master.scss',
                        'dist/css/studioclassic2018na3/news-details.css': 'css/studioclassic2018na3/news-details_master.scss',
                        'dist/css/studioclassic2018na4/global.css': 'css/studioclassic2018na4/global_master.scss',
                        'dist/css/studioclassic2018na4/client.css': 'css/studioclassic2018na4/client_master.scss',
                        'dist/css/studioclassic2018na4/news-details.css': 'css/studioclassic2018na4/news-details_master.scss',
                        'dist/css/studioclassic2020na5/global.css': 'css/studioclassic2020na5/global_master.scss',
                        'dist/css/studioclassic2020na5/client.css': 'css/studioclassic2020na5/client_master.scss',
                        'dist/css/studioclassic2020na5/news-details.css': 'css/studioclassic2020na5/news-details_master.scss',
                        'dist/css/studioclassic2020na6/global.css': 'css/studioclassic2020na6/global_master.scss',
                        'dist/css/studioclassic2020na6/client.css': 'css/studioclassic2020na6/client_master.scss',
                        'dist/css/studioclassic2020na6/news-details.css': 'css/studioclassic2020na6/news-details_master.scss',
                        'dist/css/studiospac/global.css': 'css/studiospac/global_master.scss',
                        'dist/css/studiospac/client.css': 'css/studiospac/client_master.scss',
                        'dist/css/studiospac/news-details.css': 'css/studiospac/news-details_master.scss',
                        'dist/css/studiospacone/global.css': 'css/studiospacone/global_master.scss',
                        'dist/css/studiospacone/client.css': 'css/studiospacone/client_master.scss',
                        'dist/css/studiospacone/news-details.css': 'css/studiospacone/news-details_master.scss'
                    }
                }
            },

            sassdoc: {
                default: {
                    src: 'css/*.scss',
                    options: {
                        dest: 'docs/css',
                        display: {
                            access: ['public', 'private'],
                            alias: true,
                            watermark: true,
                        }
                    },
                },
            },

            jsdoc: {
                dist: {
                    src: ['js/q4.app.js'],
                    options: {
                        destination: 'docs/js',
                        template: "node_modules/minami"
                        // configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
                    }
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        //grunt.loadNpmTasks('grunt-contrib-qunit');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-sassdoc');
        grunt.loadNpmTasks('grunt-contrib-sass');
        grunt.loadNpmTasks('grunt-jsdoc');

        //grunt.registerTask('test', ['jshint', 'qunit']);

        grunt.registerTask('default', [
            'jshint',
            //'qunit',
            'concat',
            'uglify',
            'sass',
            'sassdoc',
            // 'jsdoc'
        ]);

        grunt.registerTask('jsonly', [
            'jshint',
            'concat',
            'uglify',
        ]);
    };
}());
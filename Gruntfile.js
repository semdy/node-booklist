module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['views/foot.ejs', 'views/head.ejs']
        },
        copy: {
            ejs: {
                expand: true,
                cwd: 'views/layout',
                src: ['head-template.ejs', 'foot-template.ejs'],
                dest: 'views/layout',
                rename: function(dest, src) {
                    return dest + "/" + src.replace("-template", "");
                }
            }
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'css',
                            replacement: 'styles/css/<%= pkg.name %>.css?<%= new Date().getTime() %>'
                        },
                        {
                            match: 'main',
                            replacement: 'scripts/main'
                        },
                        {
                            match: 'require',
                            replacement: 'vendors/require/require.js'
                        }
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['views/layout/head.ejs', 'views/layout/foot.ejs'],
                    dest: 'views/layout'
                }]
            },
            prod: {
                options: {
                    patterns: [
                        {
                            match: 'css',
                            replacement: 'styles/css/<%= pkg.name %>.min.css?<%= new Date().getTime() %>'
                        },
                        {
                            match: 'main',
                            replacement: 'scripts/<%= pkg.name %>.min'
                        },
                        {
                            match: 'require',
                            replacement: 'scripts/require.min.js'
                        }
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['views/layout/head.ejs', 'views/layout/foot.ejs'],
                    dest: 'views/layout'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');

    // 默认为开发模式
    grunt.registerTask('default', ['clean', 'copy', 'replace:dev']);

    grunt.registerTask('prod', ['clean', 'copy', 'replace:prod']);
};
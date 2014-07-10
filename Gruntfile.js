module.exports = function(grunt){
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            build: {
                options: {
                    'sourcemap': true,
                    'style': 'nested'
                },
                files: [{
                    expand: true,
                    cwd: './sass',
                    src: ['glDatePicker.scss'],
                    dest: './dist/css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            build: {
                files: './sass/*',
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('css', function () {
        grunt.task.run('sass');
        grunt.task.run('watch');
    });
    // 默认任务
    grunt.registerTask('default', ['sass']);
}
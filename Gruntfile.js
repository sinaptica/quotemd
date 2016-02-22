module.exports = function(grunt) {

// ===========================================================================
// CONFIGURE GRUNT ===========================================================
// ===========================================================================
grunt.initConfig({

// get the configuration info from package.json ----------------------------
// this way we can use things like name and version (pkg.name)
pkg: grunt.file.readJSON('package.json'),

// all of our configuration will go here

// configure jshint to validate js files -----------------------------------
jshint: {
    options: {
        reporter: require('jshint-stylish')
    },

// when this task is run, lint the Gruntfile and all js files in src
    build: ['Grunfile.js', 'routes/*.js', 'routes/api/*.js', 'routes/users/*.js', "models/*js", "config/*js"]
},

watch: {
    // for scripts, run jshints
    scripts: {
        files: ['routes/*.js', 'routes/api/*.js', 'routes/users/*.js' ,"models/*js", "config/*js", 'public/js/*.js'],
        tasks: ['jshint']
    },
}, // watch

nodemon: {
    dev: {
        script: './server.js'
    }
}, // nodemon

 concurrent: {
    dev: {
        tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true,
                limit: 10
            }
    }
} // concurrent

});

// ===========================================================================
// LOAD GRUNT PLUGINS ========================================================
// ===========================================================================
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-nodemon');


grunt.registerTask('default', ['jshint', 'concurrent']);
};
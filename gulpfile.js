var gulp = require('gulp')
var fs = require('fs')
var del = require('del')
var Q = require('q')
var util = require('gulp-template-util')
var babel = require('gulp-babel')
var replace = require('gulp-replace')
var apiHost = '/handoutresource/api/Find?'
var host = 'https://test.ehanlin.com.tw'
var S3 =
  'https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/event-collection_107/'

function libTask (dest) {
  return function () {
    var packageJson = JSON.parse(
      fs.readFileSync('package.json', 'utf8').toString()
    )
    if (!packageJson.dependencies) {
      packageJson.dependencies = {}
    }
    var webLibModules = []
    for (var module in packageJson.dependencies) {
      webLibModules.push('node_modules/' + module + '/**/*')
    }
    return gulp
      .src(webLibModules, {
        base: 'node_modules/'
      })
      .pipe(gulp.dest(dest))
  }
}

function copyStaticTask (dest) {
  return function () {
    return gulp
      .src(
      [
        'src/**/*.html',
        'src/css/**/*.css',
        'src/css/icon/*',
        'src/css/icon/*.ico',
        'src/lib/**/*',
        'src/js/*.js',
        'src/img/*.png',
        'src/img/*.jpg'
      ], {
        base: 'src'
      }
      )
      .pipe(gulp.dest(dest))
  }
}

function changeTag () {
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(
      replace(/\/(event-collection_107)\/(\d\.\d\.\d{2}-\w+)/g, function (
        match,
        p1
      ) {
        let changeTag = gulp.env.tag
        return `/${p1}/${changeTag}`
      })
    )
    .pipe(gulp.dest('src'))
}

function testChangeToDevURL () {
  var url = S3 + '(\\d.\\d.\\d{1,2}-\\w+)'
  var regExp = new RegExp(url, 'g')
  return gulp
    .src(['src/js/handoutresource.js'], {
      base: 'src'
    })
    .pipe(replace(regExp, '.'))
    .pipe(
      replace(
        apiHost + '${query}',
        `${host}${apiHost}year=107&type=高一上學習寶典&subject=cs`
      )
    )
    .pipe(gulp.dest('src'))
}

function devChangeToTestURL () {
  return gulp
    .src(['src/js/handoutresource.js'], {
      base: 'src'
    })
    .pipe(replace('./js', `${S3}${gulp.env.tag}/js`))
    .pipe(
      replace(
        `${host}${apiHost}year=107&type=高一上學習寶典&subject=cs`,
        apiHost + '${query}'
      )
    )
    .pipe(gulp.dest('src'))
}

function testChangeToProduction () {
  var url = S3 + '(\\d.\\d.\\d{1,2}-\\w+)'
  var regExp = new RegExp(url, 'g')
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(replace(regExp, `${S3}${gulp.env.tag}/js`))
}

function productionChangeToTest () {
  var url = S3 + '(\\d.\\d.\\d{1,2})'
  var regExp = new RegExp(url, 'g')
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(
      replace(regExp, /\/(event-collection_107)\/(\d\.\d\.\d{1,2}-SNAPSHOT)/g)
    )
}

function cleanTask () {
  return del(['dist', ''])
}

gulp.task('lib', libTask('src/lib'))
gulp.task('changeTag', changeTag)
gulp.task('changeDev', testChangeToDevURL) // 正常運作
gulp.task('changeTest', devChangeToTestURL) // 正常運作
gulp.task('testChangeProduction', testChangeToProduction)
gulp.task('productionChangeTest', productionChangeToTest)
gulp.task('js', function () {
  return gulp
    .src('src/js/handoutresource.js', {
      base: 'src'
    })
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('package', function () {
  var deferred = Q.defer()
  Q.fcall(function () {
    return util.logPromise(cleanTask)
  }).then(function () {
    return Q.all([
      util.logStream(libTask('dist/lib')),
      util.logStream(copyStaticTask('dist'))
    ])
  })

  return deferred.promise
})

const Q = require('q')
const del = require('del')
const gulp = require('gulp')
const cache = require('gulp-cache')
const babel = require('gulp-babel')
const replace = require('gulp-replace')
const imageMin = require('gulp-imagemin')
const util = require('gulp-template-util')
const gcPub = require('gulp-gcloud-publish')
const pngquant = require('imagemin-pngquant')
const templateUtil = require('gulp-template-util')

const apiHost = '/handoutresource/api/Find?'
const host = 'https://test.ehanlin.com.tw'
const S3 = 'https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/event-collection_107/'

let bucketNameForTest = 'tutor-events-test'
let bucketNameForProd = 'tutor-events'
let projectId = 'tutor-204108'
let keyFilename = 'tutor.json'
let projectName = 'event/collection/'

let copyStaticTask = dest => {
  return () => {
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

let changeTag = () => {
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(
      replace(/\/(event-collection_107)\/(\d\.\d\.\d{2}-\w+)/g, (match, p1) => {
        let changeTag = gulp.env.tag
        return `/${p1}/${changeTag}`
      })
    )
    .pipe(gulp.dest('src'))
}

let testChangeToDevURL = () => {
  let url = S3 + '(\\d.\\d.\\d{1,2}-\\w+)'
  let regExp = new RegExp(url, 'g')
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

let devChangeToTestURL = () => {
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

let testChangeToProduction = () => {
  let url = S3 + '(\\d.\\d.\\d{1,2}-\\w+)'
  let regExp = new RegExp(url, 'g')
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(replace(regExp, `${S3}${gulp.env.tag}/js`))
}

let productionChangeToTest = () => {
  let url = S3 + '(\\d.\\d.\\d{1,2})'
  let regExp = new RegExp(url, 'g')
  return gulp
    .src(['src/index.html'], {
      base: 'src'
    })
    .pipe(
      replace(regExp, /\/(event-collection_107)\/(\d\.\d\.\d{1,2}-SNAPSHOT)/g)
    )
}

let cleanTask = () => {
  return del(['dist', ''])
}

let minifyImage = sourceImage => {
  return gulp
    .src(sourceImage, {
      base: './src'
    })
    .pipe(cache(imageMin({
      use: [pngquant({
        speed: 7
      })]
    })))
    .pipe(gulp.dest('./dist'))
}

let uploadGCS = bucketName => {
  return gulp
    .src([
      './dist/*.html',
      './dist/css/**/*.css',
      './dist/js/**/*.js',
      './dist/lib/**/*.@(js|json|css|map|svg|eot|ttf|woff|woff2)',
      './dist/img/**/*.@(png|jpg|svg|gif)'
    ], {
      base: `${__dirname}/dist/`
    })
    .pipe(gcPub({
      bucket: bucketName,
      keyFilename: keyFilename,
      base: projectName,
      projectId: projectId,
      public: true,
      metadata: {
        cacheControl: 'no-store'
      }
    }))
}

/* upload to gcp test */
gulp.task('uploadGcpTest', uploadGCS.bind(uploadGCS, bucketNameForTest))
/* upload to gcp prod */
gulp.task('uploadGcpProd', uploadGCS.bind(uploadGCS, bucketNameForProd))

gulp.task('changeTag', changeTag)
gulp.task('changeDev', testChangeToDevURL) // 正常運作
gulp.task('changeTest', devChangeToTestURL) // 正常運作
gulp.task('testChangeProduction', testChangeToProduction)
gulp.task('productionChangeTest', productionChangeToTest)
gulp.task('js', () => {
  return gulp
    .src('src/js/handoutresource.js', {
      base: 'src'
    })
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('package', () => {
  let deferred = Q.defer()
  Q.fcall(() => {
    return util.logPromise(cleanTask)
  })
    .then(() => {
      return Q.all([
        templateUtil.logStream(minifyImage.bind(minifyImage, './src/img/**/*.png'))
      ])
    })
    .then(() => {
      return Q.all([
        util.logStream(copyStaticTask('dist'))
      ])
    })
  return deferred.promise
})

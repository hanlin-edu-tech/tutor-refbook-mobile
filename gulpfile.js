const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
const Q = require('q')
const util = require('gulp-template-util')
const babel = require('gulp-babel')
const replace = require('gulp-replace')
const gcPub = require('gulp-gcloud-publish')
const Storage = require('@google-cloud/storage')

const apiHost = '/handoutresource/api/Find?'
const host = 'https://test.ehanlin.com.tw'
const S3 = 'https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/event-collection_107/'
let bucketName = 'tutor-events'
let projectId = 'tutor-204108'
let keyFilename = './tutor.json'
let projectName = 'collection_107'

const storage = new Storage({
  projectId: projectId,
  keyFilename: keyFilename
})

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

let removeEmptyFiles = () => {
  let array = ['img', 'css', 'lib', 'js']
  array.forEach(emptyFiles => {
    storage
      .bucket(bucketName)
      .file(`/event/${projectName}/${emptyFiles}`)
      .delete()
      .then(() => {
        console.log(`gs://${bucketName}/${emptyFiles} deleted.`)
      })
      .catch(err => {
        console.error('ERROR:', err)
      })
  })
}

gulp.task('uploadGcp', () => {
  return gulp.src(['dist/**/*'])
    .pipe(gcPub({
      bucket: bucketName,
      keyFilename: keyFilename,
      projectId: projectId,
      base: `/event/${projectName}`,
      public: true,
      transformDestination: path => {
        return path
      },
      metadata: {
        cacheControl: 'max-age=315360000, no-transform, public'
      }
    }))
})

gulp.task('removeEmptyFiles', () => {
  removeEmptyFiles()
})

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
  }).then(() => {
    return Q.all([
      util.logStream(copyStaticTask('dist'))
    ])
  })
  return deferred.promise
})

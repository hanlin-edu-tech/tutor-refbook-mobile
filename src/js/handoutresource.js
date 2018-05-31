define(['jquery', 'ajaxGet', 'jqueryTemplate'], function ($, ajaxGet) {
  var urlParams = {}
  var preElement = {}
  const tablePrefix = 'tb'
  var qrcodeLists = []

  function clickVideo () {
    var data = getData(this)
    var temp = $('#video-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  function clickMp3 () {
    var data = getData(this)
    var temp = $('#mp3-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  function clickPng () {
    var data = getData(this)
    var temp = $('#png-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    temp.find('img').load(iframeResize)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  function clickPdf () {
    var data = getData(this)
    var temp = $('#pdf-template').tmpl({
      data: data
    })
    temp.find('a').on('click', function (e) {
      e.stopPropagation()
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  function clickCommingSoon () {
    var data = getData(this)
    var temp = $('#comming-template').tmpl({
      data: data
    })
    temp.find('img').load(iframeResize)
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  function getData (data) {
    var returnData = {}
    returnData.resourceIds = $(data).attr('data-resourceIds')
    if (returnData.resourceIds) {
      returnData.resourceIds = returnData.resourceIds.split(',')
    }
    returnData.id = $(data)
      .attr('data-target')
      .substring(1)
    if (location.hash) {
      returnData.hash = location.hash.substring(1)
    }
    returnData.year = urlParams['year']
    returnData.type = urlParams['type']
    returnData.subject = urlParams['subject']
    return returnData
  }

  function fillIconInternal (element, index, array) {
    if (element.qRcode) {
      element.qRcode = element.qRcode.split('#')[1]
    }
    switch (element.resourceType) {
      case '實驗影片':
        element.resourceClass = 'flaticon-video-lab'
        element.resourceTemplate = 'video'
        break
      case '英中翻譯':
        element.resourceClass = 'flaticon-png-translate'
        element.resourceTemplate = 'png'
        break
      case '中文翻譯':
        element.resourceClass = 'flaticon-png-translate'
        element.resourceTemplate = 'pdf'
        break
      case '解題影片':
        element.resourceClass = 'flaticon-video-solving'
        element.resourceTemplate = 'video'
        break
      case '教學影片':
        element.resourceClass = 'flaticon-video-teaching'
        element.resourceTemplate = 'video'
        break
      case '英聽訓練':
        element.resourceClass = 'flaticon-mp3-listen'
        element.resourceTemplate = 'mp3'
        break
      case '文章朗讀':
        element.resourceClass = 'flaticon-mp3-listen'
        element.resourceTemplate = 'mp3'
        break
      case '單字朗讀':
        element.resourceClass = 'flaticon-mp3-listen'
        element.resourceTemplate = 'mp3'
        break
      default:
        element.resourceClass = 'flaticon-video-solving'
        break
    }
  }

  function getTbodyIndex (resources) {
    for (var i = 0, len = resources.length; i < len; i++) {
      if (resources[i].qRcode) {
        var index = resources[i].qRcode.split('_')[0]
        if (qrcodeLists.indexOf(index) === -1) {
          qrcodeLists.push(index)
          return index
        } else {
          continue
        }
      }
    }
  }

  function procressData (element, index, array) {
    element.resources = element.resources.filter(function (
      resource,
      index,
      array
    ) {
      return resource.visible
    })
    element.resources.forEach(fillIconInternal)
    element.tbodyIndex = getTbodyIndex(element.resources)
    if (!element.tbodyIndex) {
      element.tbodyIndex = 'tb' + index
    }
  }

  function move () {
    var target = location.hash
    $(target).trigger('click')
  }

  function iframeResize () {
    if (window.parent.resourcesLoaded) {
      window.parent.resourcesLoaded()
    }
  }

  function collapse () {
    var sender = $(this)
    var target = $(sender.attr('data-target'))
    target.toggleClass('in')
    sender.trigger('collpase', sender)
    iframeResize()
  }

  function fillQueryString () {
    var e,
      a = /\+/g, // Regex for replacing addition symbol with a space
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, ' '))
      },
      q = window.location.search.substring(1)
    while ((e = r.exec(q))) {
      urlParams[d(e[1])] = d(e[2])
    }
  }

  function procressTrigger (sender) {
    var pre = $(preElement)
    var sen = $(sender)
    if (
      sen.attr('data-parentgroup') &&
      pre.attr('data-parentgroup') &&
      sen.attr('data-parentgroup') !== pre.attr('data-parentgroup')
    ) {
      var parentElement = document.getElementById(
        pre.attr('data-parentgroup').substring(1)
      )
      $(parentElement).removeClass('in')
    }
    pre.find('div').removeClass('in')
    if (pre.hasClass('videoRow')) {
      stopYoutube(pre)
    }
    if (pre.hasClass('mp3Row')) {
      stopAudio(pre)
    }
    iframeResize()
  }

  function stopYoutube (element) {
    element.find('.youtube_player_iframe').each(function () {
      this.contentWindow.postMessage(
        '{"event":"command","func":"' + 'stopVideo' + '","args":""}',
        '*'
      )
    })
  }

  function stopAudio (element) {
    element.find('audio').each(function () {
      this.pause()
      this.currentTime = 0
    })
  }

  var init = function () {
    fillQueryString()
    var query =
      'year=' +
      urlParams['year'] +
      '&type=' +
      urlParams['type'] +
      '&subject=' +
      urlParams['subject']
    ajaxGet(
      `/handoutresource/api/Find?${query}`,
      null,
      function (data) {
        let htmlTitle = data[0].subjectName
        document.title = htmlTitle

        if (!data[0].resources.length) {
          var img =
            '<img style="max-width: 100%; height:auto;" src="https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/handoutresource/img/%E6%95%AC%E8%AB%8B%E6%9C%9F%E5%BE%85.jpg">'
          $(img)
            .load(iframeResize)
            .appendTo($('#div_demo'))
        } else {
          data.forEach(procressData)

          var parentHash = 0
          // if (location.hash) {
          //   parentHash = location.hash.split("_")[0].substring(1);
          // }
          var temp = $('#resource').tmpl({
            data: data,
            parentHash: parentHash
          })
          temp.on('click', 'tr[data-target]', collapse)
          temp.on('click', 'td[data-target]', collapse)
          temp.appendTo('#div_demo')
          $('#div_demo .videoRow').one('click', clickVideo)
          $('#div_demo .pngRow').one('click', clickPng)
          $('#div_demo .pdfRow').one('click', clickPdf)
          $('#div_demo .mp3Row').one('click', clickMp3)
          $('#div_demo .commingSoon').one('click', clickCommingSoon)
          if (location.hash) {
            move()
          }
        }

        iframeResize()
        $(document).on('collpase', function (event) {
          if (!(event.target === preElement)) {
            procressTrigger(event.target)
          }
          preElement = event.target
        })

        /* 點擊logo導頁 */
        $('.ehanlinLogo').on('click', () => {
          window.location.href = 'https://www.ehanlin.com.tw/courses_map.html'
        })
        $('.dataRow.panel').on('click', function () {
          // let getId = $(this)
          //   .attr('id')
          //   .split('')
          // if (getId[0] === 't') {
          //   let dataRow = $(this)
          //     .parents('tbody')
          //     .next()
          //     .find('tr td.dataRow')
          //   dataRow.css('display', 'none')
          // }
          // $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.mp3Row').on('click', function () {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.pngRow').on('click', function () {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.pdfRow').on('click', function () {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.videoRow').on('click', function () {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.commingSoon').on('click', function () {
          $(this).css('color', '#848484')
        })
        $('.advertising').on('click', function () {
          let thisImg = $(this).find('td img')
          $(this).css('color', '#848484')
          if (thisImg.css('display') === 'none') {
            thisImg.css('display', '')
          } else {
            thisImg.css('display', 'none')
          }
        })
        $('.advertising img').on('click', function () {
          window.open(
            '/type/ONLINE/id/y106_g10_s1_so_training_et/SalesPlans.html',
            '社會段考特訓e名師'
          )
          return false
        })

        //  android 系統的使用者
        //  navigator.userAgent.match(/android/i)
        if (navigator.userAgent.match(/android/i)) {
          function onYouTubeIframeAPIReady (youtubeId) {
            let player = new YT.Player(youtubeId, {
              videoId: youtubeId
            })

            $('.dataRow.videoRow').on('click', function () {
              player.stopVideo()
            })
            $('.dataRow.panel').on('click', function () {
              player.stopVideo()
            })
          }

          $('.dataRow.videoRow').on('click', function (event) {
            let youtubeId = event.target.getAttribute('data-resourceIds')
            let youtubeIds = youtubeId.split(',')
            let fullscreenBtn = $('tr.fullscreen-tr')
            let thisBtnTarget = $(this)
              .parents('tr')
              .next('tr.fullscreen-tr')
            let iframe
            let iframeSrc

            if (thisBtnTarget.css('display') === 'none') {
              fullscreenBtn.hide()
              thisBtnTarget.css('display', '')
            } else {
              thisBtnTarget.css('display', 'none')
            }

            /* 針對題組影片 如：一個題組有多個影片 */
            youtubeIds.forEach(ele => {
              iframe = document.getElementById(ele)
              iframeSrc = iframe.src
              iframe.src = iframeSrc
              onYouTubeIframeAPIReady(ele)
            })
          })

          if (location.hash) {
            $(document).ready(function () {
              let qRcodeId = location.hash
              let tbodyId = qRcodeId.split('_')[0]
              let youtubeId = $(qRcodeId).attr('data-resourceIds')
              let fullscreenBtn = $('tr.fullscreen-tr')
              let thisBtnTarget = $(qRcodeId)
                .parents('tr')
                .next('tr.fullscreen-tr')

              $(tbodyId).click()
              $(qRcodeId).click()

              /* qrcode 掃到的題組彈至網頁最上方 */
              location.href = qRcodeId

              if (thisBtnTarget.css('display') === 'none') {
                fullscreenBtn.hide()
                thisBtnTarget.css('display', '')
              } else {
                thisBtnTarget.css('display', 'none')
              }

              onYouTubeIframeAPIReady(youtubeId)
            })
          }

          $('.wrapper .fullscreen-button').on('click', playFullscreen)

          function playFullscreen (event) {
            let youtubeId = $(event.currentTarget)
              .parents('tr.fullscreen-tr')
              .prev('tr')
              .find('.dataRow.videoRow')
              .attr('data-resourceids')
            let youtubeIds = youtubeId.split(',')
            let iframe

            /* 針對題組影片 如：一個題組有多個影片 */
            youtubeIds.forEach(ele => {
              iframe = document.getElementById(ele)
              let requestFullScreen =
                iframe.requestFullScreen ||
                iframe.mozRequestFullScreen ||
                iframe.webkitRequestFullScreen
              if (requestFullScreen) {
                requestFullScreen.bind(iframe)()
              }
            })
          }

          $('.junior-advertising').on('click', () => {
            window.open('https://www.ehanlin.com.tw/type/ONLINE/category/%E3%80%90e%E5%90%8D%E5%B8%AB%E3%80%91%E5%9C%8B%E4%B8%AD%E6%9C%83%E8%80%83%E7%B8%BD%E8%A4%87%E7%BF%92/SalesPlans.html')
          })

          // 其他系統的使用者
        } else {
          function onYouTubeIframeAPIReady (youtubeId) {
            let player = new YT.Player(youtubeId, {
              videoId: youtubeId
            })

            $('.dataRow.videoRow').on('click', function () {
              player.stopVideo()
            })

            $('.dataRow.panel').on('click', function () {
              player.stopVideo()
            })
          }

          $('.dataRow.videoRow').on('click', function (event) {
            let youtubeId = event.target.getAttribute('data-resourceIds')
            let youtubeIds = youtubeId.split(',')
            let iframe
            let iframeSrc

            /* 針對題組影片 如：一個題組有多個影片 */
            youtubeIds.forEach(ele => {
              iframe = document.getElementById(ele)
              iframeSrc = iframe.src
              iframe.src = iframeSrc
              onYouTubeIframeAPIReady(ele)
            })
          })

          if (location.hash) {
            $(document).ready(function () {
              let qRcodeId = location.hash
              let tbodyId = qRcodeId.split('_')[0]
              let youtubeId = $(qRcodeId).attr('data-resourceIds')

              $(tbodyId).click()
              $(qRcodeId).click()
              /* qrcode 掃到的題組彈至網頁最上方 */
              location.href = qRcodeId
              onYouTubeIframeAPIReady(youtubeId)
            })
          }

          $('.junior-advertising').on('click', () => {
            window.open('https://www.ehanlin.com.tw/type/ONLINE/category/%E3%80%90e%E5%90%8D%E5%B8%AB%E3%80%91%E5%9C%8B%E4%B8%AD%E6%9C%83%E8%80%83%E7%B8%BD%E8%A4%87%E7%BF%92/SalesPlans.html')
          })
        }
      },
      function (data) {
        console.log('errorData: ' + data)
      }
    )
  }
  init()
})

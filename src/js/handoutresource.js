define(['jquery', 'ajaxGet', 'jqueryTemplate'], ($, ajaxGet) => {
  let urlParams = {}
  let preElement = {}
  // const tablePrefix = 'tb'
  let qrcodeLists = []

  let clickVideo = () => {
    let data = getData(this)
    let temp = $('#video-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  let clickMp3 = () => {
    let data = getData(this)
    let temp = $('#mp3-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  let clickPng = () => {
    let data = getData(this)
    let temp = $('#png-template').tmpl({
      data: data
    })
    temp.appendTo(this)
    temp.find('img').load(iframeResize)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  let clickPdf = () => {
    let data = getData(this)
    let temp = $('#pdf-template').tmpl({
      data: data
    })
    temp.find('a').on('click', e => {
      e.stopPropagation()
    })
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  let clickCommingSoon = () => {
    let data = getData(this)
    let temp = $('#comming-template').tmpl({
      data: data
    })
    temp.find('img').load(iframeResize)
    temp.appendTo(this)
    if ($.isEmptyObject(preElement)) {
      preElement = this
    }
    iframeResize()
  }

  let getData = data => {
    let returnData = {}
    returnData.resourceIds = $(data).attr('data-resourceIds')
    if (returnData.resourceIds) {
      returnData.resourceIds = returnData.resourceIds.split(',')
    }
    returnData.id = $(data)
      .attr('data-target')
      .substring(1)
    if (window.location.hash) {
      returnData.hash = window.location.hash.substring(1)
    }
    returnData.year = urlParams['year']
    returnData.type = urlParams['type']
    returnData.subject = urlParams['subject']
    return returnData
  }

  let fillIconInternal = (element, index, array) => {
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

  let getTbodyIndex = resources => {
    for (let i = 0, len = resources.length; i < len; i++) {
      if (resources[i].qRcode) {
        let index = resources[i].qRcode.split('_')[0]
        if (qrcodeLists.indexOf(index) === -1) {
          qrcodeLists.push(index)
          return index
        } else {
          continue
        }
      }
    }
  }

  let procressData = (element, index, array) => {
    element.resources = element.resources.filter((
      resource,
      index,
      array
    ) => {
      return resource.visible
    })
    element.resources.forEach(fillIconInternal)
    element.tbodyIndex = getTbodyIndex(element.resources)
    if (!element.tbodyIndex) {
      element.tbodyIndex = 'tb' + index
    }
  }

  let move = () => {
    let target = window.location.hash
    $(target).trigger('click')
  }

  let iframeResize = () => {
    if (window.parent.resourcesLoaded) {
      window.parent.resourcesLoaded()
    }
  }

  let collapse = () => {
    let sender = $(this)
    let target = $(sender.attr('data-target'))
    target.toggleClass('in')
    sender.trigger('collpase', sender)
    iframeResize()
  }

  let fillQueryString = () => {
    let e,
      a = /\+/g, // Regex for replacing addition symbol with a space
      r = /([^&=]+)=?([^&]*)/g,
      d = s => {
        return decodeURIComponent(s.replace(a, ' '))
      },
      q = window.location.search.substring(1)
    while ((e = r.exec(q))) {
      urlParams[d(e[1])] = d(e[2])
    }
  }

  let procressTrigger = sender => {
    let pre = $(preElement)
    let sen = $(sender)
    if (
      sen.attr('data-parentgroup') &&
      pre.attr('data-parentgroup') &&
      sen.attr('data-parentgroup') !== pre.attr('data-parentgroup')
    ) {
      let parentElement = document.getElementById(
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

  let stopYoutube = element => {
    element.find('.youtube_player_iframe').each(() => {
      this.contentWindow.postMessage(
        '{"event":"command","func":"' + 'stopVideo' + '","args":""}',
        '*'
      )
    })
  }

  let stopAudio = element => {
    element.find('audio').each(() => {
      this.pause()
      this.currentTime = 0
    })
  }

  let init = () => {
    fillQueryString()
    let query =
      'year=' +
      urlParams['year'] +
      '&type=' +
      urlParams['type'] +
      '&subject=' +
      urlParams['subject']
    ajaxGet(
      `/handoutresource/api/Find?${query}`,
      null,
      data => {
        let htmlTitle = data[0].subjectName
        document.title = htmlTitle

        if (!data[0].resources.length) {
          let img =
            '<img style="max-width: 100%; height:auto;" src="https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/handoutresource/img/%E6%95%AC%E8%AB%8B%E6%9C%9F%E5%BE%85.jpg">'
          $(img)
            .load(iframeResize)
            .appendTo($('#div_demo'))
        } else {
          data.forEach(procressData)

          let parentHash = 0
          // if (location.hash) {
          //   parentHash = location.hash.split("_")[0].substring(1);
          // }
          let temp = $('#resource').tmpl({
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
          if (window.location.hash) {
            move()
          }
        }

        iframeResize()
        $(document).on('collpase', event => {
          if (!(event.target === preElement)) {
            procressTrigger(event.target)
          }
          preElement = event.target
        })

        $('.dataRow.panel').on('click', () => {
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
        $('.dataRow.mp3Row').on('click', () => {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.pngRow').on('click', () => {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.pdfRow').on('click', () => {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.dataRow.videoRow').on('click', () => {
          $('.advertising img').css('display', 'none')
          $(this).css('color', '#848484')
        })
        $('.advertising').on('click', () => {
          let thisImg = $(this).find('td img')
          $(this).css('color', '#848484')
          if (thisImg.css('display') === 'none') {
            thisImg.css('display', '')
          } else {
            thisImg.css('display', 'none')
          }
        })
        $('.advertising img').on('click', () => {
          window.open(
            '/type/ONLINE/id/y106_g10_s1_so_training_et/SalesPlans.html',
            '社會段考特訓e名師'
          )
          return false
        })

        //  android 系統的使用者
        //  navigator.userAgent.match(/android/i)
        if (navigator.userAgent.match(/android/i)) {
          if (window.location.hash) {
            $(document).ready(() => {
              let qRcodeId = window.location.hash
              let tbodyId = qRcodeId.split('_')[0]
              let youtubeId = $(qRcodeId).attr('data-resourceIds')
              let fullscreenBtn = $('tr.fullscreen-tr')
              let thisBtnTarget = $(qRcodeId)
                .parents('tr')
                .next('tr.fullscreen-tr')

              $(tbodyId).click()
              $(qRcodeId).click()

              if (thisBtnTarget.css('display') === 'none') {
                fullscreenBtn.hide()
                thisBtnTarget.css('display', '')
              } else {
                thisBtnTarget.css('display', 'none')
              }

              onYouTubeIframeAPIReady(youtubeId)
            })
          }

          $('.dataRow.videoRow').on('click', event => {
            let youtubeId = event.target.getAttribute('data-resourceIds')
            let fullscreenBtn = $('tr.fullscreen-tr')
            let thisBtnTarget = $(this)
              .parents('tr')
              .next('tr.fullscreen-tr')

            let iframe = document.getElementById(youtubeId)
            let iframeSrc = iframe.src
            iframe.src = iframeSrc

            if (thisBtnTarget.css('display') === 'none') {
              fullscreenBtn.hide()
              thisBtnTarget.css('display', '')
            } else {
              thisBtnTarget.css('display', 'none')
            }

            onYouTubeIframeAPIReady(youtubeId)
          })

          let onYouTubeIframeAPIReady = youtubeId => {
            let player = new YT.Player(youtubeId, {
              videoId: youtubeId
            })

            $('.dataRow.videoRow').on('click', () => {
              player.stopVideo()
            })
            $('.dataRow.panel').on('click', () => {
              player.stopVideo()
            })
          }

          let playFullscreen = event => {
            let youtubeId = $(event.currentTarget)
              .parents('tr.fullscreen-tr')
              .prev('tr')
              .find('.dataRow.videoRow')
              .attr('data-resourceids')
            let iframe = document.getElementById(youtubeId)
            let requestFullScreen =
              iframe.requestFullScreen ||
              iframe.mozRequestFullScreen ||
              iframe.webkitRequestFullScreen
            if (requestFullScreen) {
              requestFullScreen.bind(iframe)()
            }
          }

          $('.wrapper .fullscreen-button').on('click', playFullscreen)

          // 其他系統的使用者
        } else {
          if (window.location.hash) {
            $(document).ready(() => {
              let qRcodeId = window.location.hash
              let tbodyId = qRcodeId.split('_')[0]
              let youtubeId = $(qRcodeId).attr('data-resourceIds')
              $(tbodyId).click()
              $(qRcodeId).click()
              onYouTubeIframeAPIReady(youtubeId)
            })
          }

          $('.dataRow.videoRow').on('click', event => {
            let youtubeId = event.target.getAttribute('data-resourceIds')
            let iframe = document.getElementById(youtubeId)
            let iframeSrc = iframe.src
            iframe.src = iframeSrc

            onYouTubeIframeAPIReady(youtubeId)
          })

          let onYouTubeIframeAPIReady = youtubeId => {
            let player = new YT.Player(youtubeId, {
              videoId: youtubeId
            })

            $('.dataRow.videoRow').on('click', () => {
              player.stopVideo()
            })

            $('.dataRow.panel').on('click', () => {
              player.stopVideo()
            })
          }
        }
      },
      data => {
        console.log('errorData: ' + data)
      }
    )
  }
  init()
})

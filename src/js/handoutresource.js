define(["jquery", "ajaxGet", "jqueryTemplate"], function($, ajaxGet) {
    var urlParams = {};
    var preElement = {};
    const tablePrefix = "tb";
    var qrcodeLists = [];

    function clickVideo() {
        var data = getData(this);
        var temp = $("#video-template").tmpl({
            data: data
        });
        temp.appendTo(this);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
    }

    function clickMp3() {
        var data = getData(this);
        var temp = $("#mp3-template").tmpl({
            data: data
        });
        temp.appendTo(this);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
    }

    function clickPng() {
        var data = getData(this);
        var temp = $("#png-template").tmpl({
            data: data
        });
        temp.appendTo(this);
        temp.find("img").load(iframeResize);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
    }

    function clickAdv() {
        var data = getData(this);
        data["advurl"] = $(this).attr("data-desc");
        var temp = $("#adv-template").tmpl({
            data: data
        });
        temp.appendTo(this);
        temp.find("img").load(iframeResize);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
    }

    function clickPdf() {
        var data = getData(this);
        var temp = $("#pdf-template").tmpl({
            data: data
        });
        temp.find("a").on("click", function(e) {
            e.stopPropagation();
        });
        temp.appendTo(this);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
    }

    function clickCommingSoon() {
        var data = getData(this);
        var temp = $("#comming-template").tmpl({
            data: data
        });
        temp.find("img").load(iframeResize);
        temp.appendTo(this);
        if ($.isEmptyObject(preElement)) {
            preElement = this;
        }
        iframeResize();
        // $(".more-video-advertising").on("click", () => {
        //     window.open("https://www.ehanlin.com.tw/products/type/ONLINE/id/y106_g10_s1_so_training_et/SalesPlans.html");
        // });
    }

    // function clickCommingSoon2() {
    //     var data = getData(this);
    //     var temp = $("#comming-template2").tmpl({
    //         data: data
    //     });
    //     temp.find("img").load(iframeResize);
    //     temp.appendTo(this);
    //     if ($.isEmptyObject(preElement)) {
    //         preElement = this;
    //     }
    //     iframeResize();
    //     $(".more-video-advertising2").on("click", () => {
    //         window.open("https://www.ehanlin.com.tw/products/type/ONLINE/id/y106_g10_s2_so_training_et/SalesPlans.html");
    //     });
    // }

    function getData(data) {
        var returnData = {};
        returnData.resourceIds = $(data).attr("data-resourceIds");
        if (returnData.resourceIds) {
            returnData.resourceIds = returnData.resourceIds.split(",");
        }
        returnData.id = $(data)
            .attr("data-target")
            .substring(1);
        if (location.hash) {
            returnData.hash = location.hash.substring(1);
        }
        returnData.year = urlParams["year"];
        returnData.type = urlParams["type"];
        returnData.subject = urlParams["subject"];
        return returnData;
    }

    function fillIconInternal(element, index, array) {
        if (element.qRcode) {
            element.qRcode = element.qRcode.split("#")[1];
        }
        switch (element.resourceType) {
            case "實驗影片":
                element.resourceClass = "flaticon-video-lab";
                element.resourceTemplate = "video";
                break;
            case "英中翻譯":
                element.resourceClass = "flaticon-png-translate";
                element.resourceTemplate = "png";
                break;
            case "中文翻譯":
                element.resourceClass = "flaticon-png-translate";
                element.resourceTemplate = "pdf";
                break;
            case "解題影片":
                element.resourceClass = "flaticon-video-solving";
                element.resourceTemplate = "video";
                break;
            case "教學影片":
                element.resourceClass = "flaticon-video-teaching";
                element.resourceTemplate = "video";
                break;
            case "英聽訓練":
                element.resourceClass = "flaticon-mp3-listen";
                element.resourceTemplate = "mp3";
                break;
            case "文章朗讀":
                element.resourceClass = "flaticon-mp3-listen";
                element.resourceTemplate = "mp3";
                break;
            case "單字朗讀":
                element.resourceClass = "flaticon-mp3-listen";
                element.resourceTemplate = "mp3";
                break;
            case "更多影片":
                element.resourceClass = "flaticon-adv-translate";
                element.resourceTemplate = "adv";
                break;
            default:
                element.resourceClass = "flaticon-video-solving";
                break;
        }
    }

    function getTbodyIndex(resources) {
        for (var i = 0, len = resources.length; i < len; i++) {
            if (resources[i].qRcode) {
                var index = resources[i].qRcode.split("_")[0];
                if (qrcodeLists.indexOf(index) === -1) {
                    if (index.match("s2")) {
                        let index = resources[i].qRcode.split("_")[1];
                        qrcodeLists.push(index);
                        return index;
                    } else {
                        qrcodeLists.push(index);
                        return index;
                    }
                }
            }
        }
        return null;
    }

    function procressData(element, index, array) {
        element.resources = element.resources.filter(function(resource, index, array) {
            return resource.visible;
        });
        element.resources.forEach(fillIconInternal);
        element.tbodyIndex = getTbodyIndex(element.resources);
        if (!element.tbodyIndex) {
            // element.tbodyIndex = 'tb' + index
            element.tbodyIndex = "s2" + "_" + (parseInt(index) + 1);
        }
    }

    function move() {
        var target = location.hash;
        $(target).trigger("click");
    }

    function iframeResize() {
        if (window.parent.resourcesLoaded) {
            window.parent.resourcesLoaded();
        }
    }

    function collapse() {
        var sender = $(this);
        var target = $(sender.attr("data-target"));
        target.toggleClass("in");
        sender.trigger("collpase", sender);
        iframeResize();
    }

    function fillQueryString() {
        var e,
            a = /\+/g, // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function(s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = window.location.search.substring(1);
        while ((e = r.exec(q))) {
            urlParams[d(e[1])] = d(e[2]);
        }
    }

    function procressTrigger(sender) {
        var pre = $(preElement);
        var sen = $(sender);
        if (sen.attr("data-parentgroup") && pre.attr("data-parentgroup") && sen.attr("data-parentgroup") !== pre.attr("data-parentgroup")) {
            var parentElement = document.getElementById(pre.attr("data-parentgroup").substring(1));
            $(parentElement).removeClass("in");
        }
        pre.find("div").removeClass("in");
        if (pre.hasClass("videoRow")) {
            stopYoutube(pre);
        }
        if (pre.hasClass("mp3Row")) {
            stopAudio(pre);
        }
        iframeResize();
    }

    function stopYoutube(element) {
        element.find(".youtube_player_iframe").each(function() {
            this.contentWindow.postMessage('{"event":"command","func":"' + "stopVideo" + '","args":""}', "*");
        });
    }

    function stopAudio(element) {
        element.find("audio").each(function() {
            this.pause();
            this.currentTime = 0;
        });
    }

    function showMp3DownloadButton(params) {
        let downloadLink = `https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/handoutresource/${params.year}/${params.type}/${params.subject}/mp3/all.zip`;
        $.ajax({
            type: "HEAD",
            url: downloadLink,
            success: function() {
                $("#download-all-mp3")
                    .show()
                    .find("a")
                    .attr("href", downloadLink);
            }
        });
    }

    function updateUI(data) {
        let htmlTitle = data[0].subjectName;
        document.title = htmlTitle;

        if (!data[0].resources.length) {
            var img = '<img style="max-width: 100%; height:auto;" src="https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/handoutresource/img/%E6%95%AC%E8%AB%8B%E6%9C%9F%E5%BE%85.jpg">';
            $(img)
                .load(iframeResize)
                .appendTo($("#div_demo"));
        } else {
            data.forEach(procressData);

            var parentHash = 0;
            var temp = $("#resource").tmpl({
                data: data,
                parentHash: parentHash
            });
            temp.on("click", "tr[data-target]", collapse);
            temp.on("click", "td[data-target]", collapse);
            temp.appendTo("#div_demo");
            $("#div_demo .videoRow").one("click", clickVideo);
            $("#div_demo .pngRow").one("click", clickPng);
            $("#div_demo .pdfRow").one("click", clickPdf);
            $("#div_demo .mp3Row").one("click", clickMp3);
            $("#div_demo .advRow").one("click", clickAdv);
            $("#div_demo .commingSoon").one("click", clickCommingSoon);
            // $("#div_demo .commingSoon2").one("click", clickCommingSoon2);
            if (location.hash) {
                move();
            }

            showMp3DownloadButton(urlParams);
        }

        iframeResize();
        $(document).on("collpase", function(event) {
            if (!(event.target === preElement)) {
                procressTrigger(event.target);
            }
            preElement = event.target;
        });

        /* 點擊logo導頁 */
        $(".ehanlinLogo").on("click", () => {
            window.location.href = "https://www.ehanlin.com.tw/courses_map.html";
        });
        $(".dataRow.panel").on("click", function() {
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
            $(this).css("color", "#848484");
        });
        $(".dataRow.mp3Row").on("click", function() {
            $(".advertising img").css("display", "none");
            $(this).css("color", "#848484");
        });
        $(".dataRow.pngRow").on("click", function() {
            $(".advertising img").css("display", "none");
            $(this).css("color", "#848484");
        });
        $(".dataRow.pdfRow").on("click", function() {
            $(".advertising img").css("display", "none");
            $(this).css("color", "#848484");
        });
        $(".dataRow.videoRow").on("click", function() {
            $(".advertising img").css("display", "none");
            $(this).css("color", "#848484");
        });
        $(".dataRow.commingSoon").on("click", function() {
            $(this).css("color", "#848484");
        });
        $(".dataRow.commingSoon2").on("click", function() {
            $(this).css("color", "#848484");
        });
        $(".advertising").on("click", function() {
            let thisImg = $(this).find("td img");
            $(this).css("color", "#848484");
            if (thisImg.css("display") === "none") {
                thisImg.css("display", "");
            } else {
                thisImg.css("display", "none");
            }
        });

        //  android 系統的使用者
        //  navigator.userAgent.match(/android/i)
        if (navigator.userAgent.match(/android/i)) {
            function onYouTubeIframeAPIReady(youtubeId) {
                let player = new YT.Player(youtubeId, {
                    videoId: youtubeId
                });

                $(".dataRow.videoRow").on("click", function() {
                    player.stopVideo();
                });
                $(".dataRow.panel").on("click", function() {
                    player.stopVideo();
                });
            }

            $(".dataRow.videoRow").on("click", function(event) {
                let youtubeId = event.target.getAttribute("data-resourceIds");
                let youtubeIds = youtubeId.split(",");
                let fullscreenBtn = $("tr.fullscreen-tr");
                let thisBtnTarget = $(this)
                    .parents("tr")
                    .next("tr.fullscreen-tr");
                let iframe;
                let iframeSrc;

                if (thisBtnTarget.css("display") === "none") {
                    fullscreenBtn.hide();
                    thisBtnTarget.css("display", "");
                } else {
                    thisBtnTarget.css("display", "none");
                }

                /* 針對題組影片 如：一個題組有多個影片 */
                youtubeIds.forEach(ele => {
                    iframe = document.getElementById(ele);
                    iframeSrc = iframe.src;
                    iframe.src = iframeSrc;
                    onYouTubeIframeAPIReady(ele);
                });

                $(".junior-advertising").on("click", () => {
                    window.open("https://www.ehanlin.com.tw/products/type/ONLINE/category/%E3%80%90e%E5%90%8D%E5%B8%AB%E3%80%91%E5%9C%8B%E4%B8%AD%E6%9C%83%E8%80%83%E7%B8%BD%E8%A4%87%E7%BF%92/SalesPlans.html");
                });
            });

            if (location.hash) {
                $(document).ready(function() {
                    let qRcodeId = location.hash;
                    let tbodyId;
                    let youtubeId;
                    let fullscreenBtn = $("tr.fullscreen-tr");
                    let thisBtnTarget = $(qRcodeId)
                        .parents("tr")
                        .next("tr.fullscreen-tr");

                    if (qRcodeId.match("s")) {
                        tbodyId = "#" + qRcodeId.split("_")[1];
                    } else {
                        tbodyId = qRcodeId.split("_")[0];
                    }
                    youtubeId = $(qRcodeId).attr("data-resourceIds");

                    $(tbodyId).click();
                    $(qRcodeId).click();

                    /* qrcode 掃到的題組彈至網頁最上方 */
                    location.href = qRcodeId;

                    if (thisBtnTarget.css("display") === "none") {
                        fullscreenBtn.hide();
                        thisBtnTarget.css("display", "");
                    } else {
                        thisBtnTarget.css("display", "none");
                    }

                    onYouTubeIframeAPIReady(youtubeId);
                });
            }

            $(".wrapper .fullscreen-button").on("click", playFullscreen);

            function playFullscreen(event) {
                let youtubeId = $(event.currentTarget)
                    .parents("tr.fullscreen-tr")
                    .prev("tr")
                    .find(".dataRow.videoRow")
                    .attr("data-resourceids");
                let youtubeIds = youtubeId.split(",");
                let iframe;

                /* 針對題組影片 如：一個題組有多個影片 */
                youtubeIds.forEach(ele => {
                    iframe = document.getElementById(ele);
                    let requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
                    if (requestFullScreen) {
                        requestFullScreen.bind(iframe)();
                    }
                });
            }

            // ios系統的使用者
        } else if (navigator.userAgent.match(/iphone/i)) {
            function onYouTubeIframeAPIReady(youtubeId) {
                let player = new YT.Player(youtubeId, {
                    videoId: youtubeId
                });

                $(".dataRow.videoRow").on("click", function() {
                    player.stopVideo();
                });

                $(".dataRow.panel").on("click", function() {
                    player.stopVideo();
                });
            }

            $(".dataRow.videoRow").on("click", function(event) {
                let youtubeId = event.target.getAttribute("data-resourceIds");
                let youtubeIds = youtubeId.split(",");
                let iframe;
                let iframeSrc;

                /* 針對題組影片 如：一個題組有多個影片 */
                youtubeIds.forEach(ele => {
                    iframe = document.getElementById(ele);
                    iframeSrc = iframe.src;
                    iframe.src = iframeSrc;
                    onYouTubeIframeAPIReady(ele);
                });

                $(".junior-advertising").on("click", () => {
                    window.open("https://www.ehanlin.com.tw/products/type/ONLINE/category/%E3%80%90e%E5%90%8D%E5%B8%AB%E3%80%91%E5%9C%8B%E4%B8%AD%E6%9C%83%E8%80%83%E7%B8%BD%E8%A4%87%E7%BF%92/SalesPlans.html");
                });
            });

            if (window.location.hash) {
                $(document).ready(function() {
                    let qRcodeId = window.location.hash;
                    let tbodyId;
                    let youtubeId;
                    if (qRcodeId.match("s")) {
                        tbodyId = "#" + qRcodeId.split("_")[1];
                    } else {
                        tbodyId = qRcodeId.split("_")[0];
                    }
                    youtubeId = $(qRcodeId).attr("data-resourceIds");

                    $(tbodyId).click();
                    $(qRcodeId).click();
                    /* qrcode 掃到的題組彈至網頁最上方 */
                    window.location.href = qRcodeId;
                    onYouTubeIframeAPIReady(youtubeId);
                });
            }
            // 其他系統的使用者
        } else {
            $(".ehanlinLogo").css("height", "15%");

            function onYouTubeIframeAPIReady(youtubeId) {
                let player = new YT.Player(youtubeId, {
                    videoId: youtubeId
                });

                $(".dataRow.videoRow").on("click", function() {
                    player.stopVideo();
                });

                $(".dataRow.panel").on("click", function() {
                    player.stopVideo();
                });
            }

            $(".dataRow.videoRow").on("click", function(event) {
                let youtubeId = event.target.getAttribute("data-resourceIds");
                let youtubeIds = youtubeId.split(",");
                let iframe;
                let iframeSrc;

                /* 針對題組影片 如：一個題組有多個影片 */
                youtubeIds.forEach(ele => {
                    iframe = document.getElementById(ele);
                    iframeSrc = iframe.src;
                    iframe.src = iframeSrc;
                    onYouTubeIframeAPIReady(ele);
                });

                $(".junior-advertising").on("click", () => {
                    window.open("https://www.ehanlin.com.tw/products/type/ONLINE/category/%E3%80%90e%E5%90%8D%E5%B8%AB%E3%80%91%E5%9C%8B%E4%B8%AD%E6%9C%83%E8%80%83%E7%B8%BD%E8%A4%87%E7%BF%92/SalesPlans.html");
                });
            });

            if (window.location.hash) {
                $(document).ready(function() {
                    let qRcodeId = window.location.hash;
                    let tbodyId;
                    let youtubeId;
                    if (qRcodeId.match("s")) {
                        tbodyId = "#" + qRcodeId.split("_")[1];
                    } else {
                        tbodyId = qRcodeId.split("_")[0];
                    }
                    youtubeId = $(qRcodeId).attr("data-resourceIds");

                    $(tbodyId).click();
                    $(qRcodeId).click();
                    /* qrcode 掃到的題組彈至網頁最上方 */
                    window.location.href = qRcodeId;
                    onYouTubeIframeAPIReady(youtubeId);
                });
            }
        }
    }

    var init = function() {
        fillQueryString();
        var query = "year=" + urlParams["year"] + "&type=" + urlParams["type"] + "&subject=" + urlParams["subject"];
    
    //切換線上和本機測試
    //*
        ajaxGet(
            `/handoutresource/api/Find?${query}`,
            null,
            updateUI,
            function(data) {
                console.log("errorData: " + data);
            }
        );
    /*/
       let testData = [{"resources":[{"_id":"109_WIN_JEN_read1_TB_001000","resourceName":"37","resourceType":"文章朗讀","resourceIds":["109-level1-part1-01"],"resourceDescription":"","qRcode":"read1#0_0","visible":true,"enable":true,"order":1,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_002000","resourceName":"38","resourceType":"文章朗讀","resourceIds":["109-level1-part1-02"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":2,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_003000","resourceName":"39","resourceType":"文章朗讀","resourceIds":["109-level1-part1-03"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":3,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_004000","resourceName":"更多影片","resourceType":"更多影片","resourceIds":["109國中總複習清單內廣告.png"],"resourceDescription":"https://www.ehanlin.com.tw/event/jhsrev/index.html","qRcode":null,"visible":true,"enable":true,"order":4,"redirector":null}],"_id":{"timestamp":1592534256,"machine":539497,"pid":3356,"increment":11635513,"creationTime":"2020-06-19T02:37:36Z"},"unitName":"Part 1 ","type":"贏家英語系列","subject":"read1","subjectName":"贏家整合式閱讀1","year":109,"order":103},{"resources":[{"_id":"109_WIN_JEN_read1_TB_005000","resourceName":"40","resourceType":"文章朗讀","resourceIds":["109-level1-part2-01"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":5,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_006000","resourceName":"41","resourceType":"文章朗讀","resourceIds":["109-level1-part2-02"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":6,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_007000","resourceName":"42","resourceType":"文章朗讀","resourceIds":["109-level1-part2-03"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":7,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_008000","resourceName":"43","resourceType":"文章朗讀","resourceIds":["109-level1-part2-04"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":8,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_009000","resourceName":"44","resourceType":"文章朗讀","resourceIds":["109-level1-part2-05"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":9,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_010000","resourceName":"更多影片","resourceType":"更多影片","resourceIds":["109國中總複習清單內廣告.png"],"resourceDescription":"https://www.ehanlin.com.tw/event/jhsrev/index.html","qRcode":null,"visible":true,"enable":true,"order":10,"redirector":null}],"_id":{"timestamp":1592534257,"machine":539497,"pid":3356,"increment":11635514,"creationTime":"2020-06-19T02:37:37Z"},"unitName":"Part 2","type":"贏家英語系列","subject":"read1","subjectName":"贏家整合式閱讀1","year":109,"order":103},{"resources":[{"_id":"109_WIN_JEN_read1_TB_011000","resourceName":"45","resourceType":"文章朗讀","resourceIds":["109-level1-part3-01"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":11,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_012000","resourceName":"46","resourceType":"文章朗讀","resourceIds":["109-level1-part3-02"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":12,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_013000","resourceName":"更多影片","resourceType":"更多影片","resourceIds":["109國中總複習清單內廣告.png"],"resourceDescription":"https://www.ehanlin.com.tw/event/jhsrev/index.html","qRcode":null,"visible":true,"enable":true,"order":13,"redirector":null}],"_id":{"timestamp":1592534257,"machine":539497,"pid":3356,"increment":11635515,"creationTime":"2020-06-19T02:37:37Z"},"unitName":"Part 3","type":"贏家英語系列","subject":"read1","subjectName":"贏家整合式閱讀1","year":109,"order":103},{"resources":[{"_id":"109_WIN_JEN_read1_TB_014000","resourceName":"47","resourceType":"文章朗讀","resourceIds":["109-level1-part4-01"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":14,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_015000","resourceName":"48","resourceType":"文章朗讀","resourceIds":["109-level1-part4-02"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":15,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_016000","resourceName":"49","resourceType":"文章朗讀","resourceIds":["109-level1-part4-03"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":16,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_017000","resourceName":"50","resourceType":"文章朗讀","resourceIds":["109-level1-part4-04"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":17,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_018000","resourceName":"51","resourceType":"文章朗讀","resourceIds":["109-level1-part4-05"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":18,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_019000","resourceName":"52","resourceType":"文章朗讀","resourceIds":["109-level1-part4-06"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":19,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_020000","resourceName":"53","resourceType":"文章朗讀","resourceIds":["109-level1-part4-07"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":20,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_021000","resourceName":"54","resourceType":"文章朗讀","resourceIds":["109-level1-part4-08"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":21,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_022000","resourceName":"55","resourceType":"文章朗讀","resourceIds":["109-level1-part4-09"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":22,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_023000","resourceName":"更多影片","resourceType":"更多影片","resourceIds":["109國中總複習清單內廣告.png"],"resourceDescription":"https://www.ehanlin.com.tw/event/jhsrev/index.html","qRcode":null,"visible":true,"enable":true,"order":23,"redirector":null}],"_id":{"timestamp":1592534257,"machine":539497,"pid":3356,"increment":11635516,"creationTime":"2020-06-19T02:37:37Z"},"unitName":"Part 4","type":"贏家英語系列","subject":"read1","subjectName":"贏家整合式閱讀1","year":109,"order":103},{"resources":[{"_id":"109_WIN_JEN_read1_TB_024000","resourceName":"56","resourceType":"文章朗讀","resourceIds":["109-level1-part5-01"],"resourceDescription":"","qRcode":null,"visible":true,"enable":true,"order":24,"redirector":null},{"_id":"109_WIN_JEN_read1_TB_025000","resourceName":"更多影片","resourceType":"更多影片","resourceIds":["109國中總複習清單內廣告.png"],"resourceDescription":"https://www.ehanlin.com.tw/event/jhsrev/index.html","qRcode":null,"visible":true,"enable":true,"order":25,"redirector":null}],"_id":{"timestamp":1592534257,"machine":539497,"pid":3356,"increment":11635517,"creationTime":"2020-06-19T02:37:37Z"},"unitName":"Part 5","type":"贏家英語系列","subject":"read1","subjectName":"贏家整合式閱讀1","year":109,"order":103}];
       updateUI(testData);
    //*/
    };
    init();
});

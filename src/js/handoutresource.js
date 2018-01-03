var urlParams = {};
var preElement = {};
const tablePrefix = "tb";
var qrcodeLists = [];

function Clickvideo() {
  var data = GetData(this);
  var temp = $("#video-template").tmpl({
    data: data
  });
  screen.lockOrientation("portrait");
  temp.appendTo(this);
  if ($.isEmptyObject(preElement)) {
    preElement = this;
  }
  IframeResize();
}

function Clickmp3() {
  var data = GetData(this);
  var temp = $("#mp3-template").tmpl({
    data: data
  });
  temp.appendTo(this);
  if ($.isEmptyObject(preElement)) {
    preElement = this;
  }
  IframeResize();
}

function Clickpng() {
  var data = GetData(this);
  var temp = $("#png-template").tmpl({
    data: data
  });
  temp.appendTo(this);
  temp.find("img").load(IframeResize);
  if ($.isEmptyObject(preElement)) {
    preElement = this;
  }
  IframeResize();
}

function Clickpdf() {
  var data = GetData(this);
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
  IframeResize();
}

function ClickCommingSoon() {
  var data = GetData(this);
  var temp = $("#comming-template").tmpl({
    data: data
  });
  temp.find("img").load(IframeResize);
  temp.appendTo(this);
  if ($.isEmptyObject(preElement)) {
    preElement = this;
  }
  IframeResize();
}

function GetData(data) {
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

function FillIconInternal(element, index, array) {
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
    default:
      element.resourceClass = "flaticon-video-solving";
      break;
  }
}

function GetTbodyIndex(resources) {
  for (var i = 0, len = resources.length; i < len; i++) {
    if (resources[i].qRcode) {
      var index = resources[i].qRcode.split("_")[0];
      if (qrcodeLists.indexOf(index) === -1) {
        qrcodeLists.push(index);
        return index;
      } else {
        continue;
      }
    }
  }
}

function ProcressData(element, index, array) {
  element.resources = element.resources.filter(function(
    resource,
    index,
    array
  ) {
    return resource.visible;
  });
  element.resources.forEach(FillIconInternal);
  element.tbodyIndex = GetTbodyIndex(element.resources);
  if (!element.tbodyIndex) {
    element.tbodyIndex = "tb" + index;
  }
}

function Move() {
  var target = location.hash;
  $(target).trigger("click");
}

function IframeResize() {
  if (window.parent.resourcesLoaded) {
    window.parent.resourcesLoaded();
  }
}

function Collapse() {
  var sender = $(this);
  var target = $(sender.attr("data-target"));
  target.toggleClass("in");
  sender.trigger("collpase", sender);
  IframeResize();
}

function FillQueryString() {
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

function ProcressTrigger(sender) {
  var pre = $(preElement);
  var sen = $(sender);
  if (
    sen.attr("data-parentgroup") &&
    pre.attr("data-parentgroup") &&
    sen.attr("data-parentgroup") !== pre.attr("data-parentgroup")
  ) {
    var parentElement = document.getElementById(
      pre.attr("data-parentgroup").substring(1)
    );
    $(parentElement).removeClass("in");
  }
  pre.find("div").removeClass("in");
  if (pre.hasClass("videoRow")) {
    StopYoutube(pre);
  }
  if (pre.hasClass("mp3Row")) {
    StopAudio(pre);
  }
  IframeResize();
}

function StopYoutube(element) {
  element.find(".youtube_player_iframe").each(function() {
    this.contentWindow.postMessage(
      '{"event":"command","func":"' + "stopVideo" + '","args":""}',
      "*"
    );
  });
}

function StopAudio(element) {
  element.find("audio").each(function() {
    this.pause();
    this.currentTime = 0;
  });
}

var Init = function(host) {
  FillQueryString();
  var query =
    "year=" +
    urlParams["year"] +
    "&type=" +
    urlParams["type"] +
    "&subject=" +
    urlParams["subject"];
  ajaxGet(
    "/handoutresource" + "/api/Find?" + query,
    // "https://www.ehanlin.com.tw/handoutresource/api/Find?year=106&type=橘子複習講義&subject=pc",
    null,
    function(data) {
      console.log(data);

      if (!data[0].resources.length) {
        var img =
          '<img style="max-width: 100%; height:auto;" src="https://s3-ap-northeast-1.amazonaws.com/ehanlin-web-resource/handoutresource/img/%E6%95%AC%E8%AB%8B%E6%9C%9F%E5%BE%85.jpg">';
        $(img)
          .load(IframeResize)
          .appendTo($("#div_demo"));
      } else {
        data.forEach(ProcressData);
        var parentHash = 0;
        if (location.hash) {
          parentHash = location.hash.split("_")[0].substring(1);
        }
        var temp = $("#resource").tmpl({
          data: data,
          parentHash: parentHash
        });
        temp.on("click", "tr[data-target]", Collapse);
        temp.on("click", "td[data-target]", Collapse);
        temp.appendTo("#div_demo");
        $("#div_demo .videoRow").one("click", Clickvideo);
        $("#div_demo .pngRow").one("click", Clickpng);
        $("#div_demo .pdfRow").one("click", Clickpdf);
        $("#div_demo .mp3Row").one("click", Clickmp3);
        $("#div_demo .commingSoon").one("click", ClickCommingSoon);
        if (location.hash) {
          Move();
        }
      }
      IframeResize();
      $(document).on("collpase", function(event) {
        if (!(event.target === preElement)) {
          ProcressTrigger(event.target);
        }
        preElement = event.target;
      });
    },
    function(data) {
      console.log("errorData: " + data);
    }
  );
};

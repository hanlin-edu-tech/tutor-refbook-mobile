var appendSubjectTitle = function() {
  let subjectMap = new Map();
  subjectMap.set("pc", "國文");
  subjectMap.set("en", "英文");
  subjectMap.set("ma1", "數學乙");
  subjectMap.set("ma2", "數學甲");
  subjectMap.set("ch", "物理");
  subjectMap.set("ph", "化學");
  subjectMap.set("bi", "生物");
  subjectMap.set("hi", "歷史");
  subjectMap.set("ge", "地理");
  subjectMap.set("cs", "公民");

  ajaxGet(
    "https://www.ehanlin.com.tw/handoutresource/api/Find?year=106&type=橘子複習講義&subject=pc",
    null,
    function(jsonData) {
      let getSubject = jsonData[0].subject;
      let subjectSession = $(".table .info").html();
      $(".table .info").html(
        "<span>" +
          subjectMap.get(getSubject) +
          "&nbsp;&nbsp;" +
          subjectSession +
          "</span>"
      );
      console.log("appendSubjectTitle()" + subjectMap.get(getSubject));
    },
    function(jsonData) {
      console.log("errorData: " + jsonData);
    }
  );
};

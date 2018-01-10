/**
 * Http Get by ajax
 */
require(["jquery"], function($) {
  var ajaxGet = function(url, param, success, error) {
    return $.ajax({
      type: "GET",
      url: url,
      data: param,
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      cache: false,
      crossDomain: true,
      success: success,
      error: error
    });
  };
});

require.config({
  baseUrl: "js",
  paths: {
    jquery: "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min"
  }
});

/**
 * requireJs 模組化
 */
require(["handoutresource", "ajax"], function(handoutresource, ajax) {});

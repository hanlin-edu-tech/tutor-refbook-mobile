require.config({
  shim: {
    jqueryTemplate: {
      deps: ["jquery"]
    }
  },

  baseUrl: "js",
  paths: {
    jquery: "../lib/jquery/jquery-1.7.2.min",
    jqueryTemplate: "../lib/jquery/jquery.tmpl",
    ajaxGet: "./ajax"
  }
});

/**
 * requireJs 模組化
 */
require(["handoutresource", "ajax"], function(handoutresource, ajax) {});

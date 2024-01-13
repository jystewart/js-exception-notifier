(function() {
  var JSExceptionNotifierLogger, isExcludedContext, isExcludedFile;

  isExcludedContext = function(context) {
    var excludedContext;
    if (!context) {
      return false;
    }
    excludedContext = [];
    excludedContext.push('NREUMQ');
    let match = excludedContent.find((value) => context.match(value));
    return match !== undefined;
  };

  isExcludedFile = function(filename) {
    var excludedServices;
    if (!filename) {
      return false;
    }
    excludedServices = [];
    excludedServices.push('newrelic', 'livechatinc', 'selenium-ide', 'firebug', 'tracekit', 'amberjack', 'googleapis');

    let match = excludedServices.find((value) => filename.match(value));
    return match !== undefined;
  };

  TraceKit.report.subscribe(JSExceptionNotifierLogger = function(errorReport) {
    var ref;
    if (errorReport.message !== '' && errorReport.stack && errorReport.stack[0] && errorReport.stack[0].line > 0 && !isExcludedFile(errorReport.stack[0].url) && !isExcludedContext((ref = errorReport.stack[0].context) != null ? ref.join() : void 0)) {
      window.errorCount || (window.errorCount = 0);
      if (window.errorCount > 5) {
        return;
      }
      window.errorCount += 1;
      errorReport.url = document.location.href;
      errorReport.useragent = navigator.userAgent;
      return $.ajax({
        url: '/js_exception_notifier',
        headers: {
          'X-CSRF-Token': typeof jQuery === "function" ? jQuery('meta[name="csrf-token"]').attr('content') : void 0
        },
        data: {
          errorReport: errorReport
        },
        type: 'POST',
        dataType: 'JSON',
        error: function(data, textStatus, jqXHR) {
          return console.log(data);
        }
      });
    }
  });

  $.fn.ready = TraceKit.wrap($.fn.ready);

}).call(this);
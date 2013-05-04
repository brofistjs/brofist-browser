var _ = require('dominatrix')
var doom = require('doom')()
var boo = require('boo')

var isArray     = Array.isArray
var append      = doom.append
var query       = doom.query
var head        = doom.head
var replace     = doom.replace
var listen      = doom.listen
var toggleClass = doom.toggleClass
var setText     = doom.setText
var merge       = boo.merge

function verdictFor(result) {
  return result.verdict?  '.' + result.verdict
  :      /* otherwise */  ''
}

function isSlow(result) {
  return result.slow?     '.slow'
  :      /* otherwise */  ''
}

function runningTime(result) {
  var time = result.finished - result.started

  return isNaN(time)?     null
  :      /* otherwise */  _('.running-time', '(' + time + 'ms)')
}

function renderException(exception) {
  if (!exception) return _('.no-exception')

  return _('.exception'
          , _('strong.title'
             , _('.type', exception.name)
             , _('.message', exception.message))
          , _('.stack', exception.stack))
}

function renderTitle(result) {
  return _('.title'
          , result.title
          , runningTime(result))
}

function renderResult(result, details) {
  return _('li.report.test-result' + verdictFor(result)
                                   + isSlow(result)
          , toggleParent(renderTitle(result))
          , details)
}

function renderTestResult(result) {
  return renderResult(result
                     , _('.details'
                        , renderException(result.exception)))
}

function renderSuiteResult(result) {
  return renderResult(result
                     , _('ul.details'))
}

function makeTestResult(result) {
  return merge(result
              , { title: result.test.title })
}

function makeSuiteResult(suite, results) {

}

var toggleParent = listen('click', function(ev) {
                     var parent = ev.currentTarget.parentElement
                     toggleClass('active', parent)
                   })


function setupSearchPanel(button, panel) {
  var all = doom.concat(button, panel)
  doom.listen( 'click'
             , doom.toggleClass.bind(null, 'active', all)
             , button)
}

function reporter(report) {
  var container = head(query('#test-results'))
  var context   = container
  var current   = null
  var stack     = [] // :: [Result]

  var passedTests  = head(query('#status .passed .test-count'))
  var failedTests  = head(query('#status .failed .test-count'))
  var ignoredTests = head(query('#status .ignored .test-count'))

  report.on('suite:started', function(ev, suite) {
  })

  report.on('test:started', function(ev, test) {
    current = renderTestResult(makeTestResult({ test: test }))
    append(context, current)
  })

  report.on('result', function(ev, result) {
    var r = renderTestResult(makeTestResult(result))
    replace(current, r)
  })

  report.on('success', function() {
    setText(report.passed.length, passedTests)
  })

  report.on('failure', function() {
    setText(report.failed.length, failedTests)
  })

  report.on('ignored', function() {
    setText(report.ignored.length, ignoredTests)
  })
}

setupSearchPanel(query('#search-button'), query('#search-panel'))

module.exports = reporter
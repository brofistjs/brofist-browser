var _ = require('dominatrix')
var doom = require('doom')()

var isArray = Array.isArray
var append  = doom.append
var query   = doom.query
var head    = doom.head
var replace = doom.replace

// type ReportResult
//   :: TestReport | SuiteReport

// type TestReport
//   title   :: String
//   result  :: Result
//   element :: HTMLElement
//   parent  :: Suite

// type SuiteReport
//   title   :: String
//   result  :: [Result]
//   report  :: Report
//   element :: HTMLElement
//   parent  :: Suite



// :: a -> Bool
function isSuite(a) {
  return a && isArray(a.tests)
}

// :: Test -> TestReport
function makeTestReport(test) {
  return { title   : test.title
         , result  : {}
         , element : _('li.report.test-result'
                      , _('strong.title', test.title))
         , parent  : test.parent }
}

// :: Suite -> SuiteReport


function verdictFor(result) {
  return result.verdict?  '.' + result.verdict
  :      /* otherwise */  ''
}

function isSlow(result) {
  return result.slow?     '.slow'
  :      /* otherwise */  ''
}

function runningTime(result) {
  return '(' + (result.finished - result.started) + 'ms)'
}

function renderException(exception) {
  if (!exception) return _('.no-exception')

  return _('.exception'
          , _('strong.title'
             , _('.type', exception.name)
             , _('.message', exception.message))
          , _('.stack', exception.stack))
}

// :: TestReport -> ()
function updateRender(report) {
  replace( report.element
         , _('li.report.test-result' + verdictFor(report.result)
                                     + isSlow(report.result)
            , toggleParent(_('.title'
                            , report.title
                            , ' '
                            , _('.running-time'
                               , runningTime(report.result))))
            , _('.details'
               , renderException(report.result.exception))))
}

var toggleParent = doom.listen('click', function(ev) {
                     var parent = ev.currentTarget.parentElement
                     doom.toggleClass('active', parent)
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

  report.on('test:started', function(ev, test) {
    current = makeTestReport(test)
    append(context, current.element)
  })

  report.on('result', function(ev, result) {
    current.result = result
    updateRender(current)
  })
}

setupSearchPanel(doom.query('#search-button')
                ,doom.query('#search-panel'))

module.exports = reporter
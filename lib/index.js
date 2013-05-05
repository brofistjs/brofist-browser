/// Module buddy-browser
//
// Interface and reporter for browser tests.
//
//
// Copyright (c) 2013 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
module.exports = function(engine, events) {

  var _ = require('dominatrix')
  var doom = require('doom')(engine, events)
  var boo = require('boo')
  var qs = require('querystring')
  var Test = require('test-buddy').Test

  var isArray     = Array.isArray
  var append      = doom.append
  var query       = doom.query
  var head        = doom.head
  var replace     = doom.replace
  var listen      = doom.listen
  var toggleClass = doom.toggleClass
  var addClass    = doom.addClass
  var setText     = doom.setText
  var merge       = boo.merge

  function last(xs){ return xs[xs.length - 1] }

  function verdictFor(result) {
    return result.verdict?  '.' + result.verdict
    :      /* otherwise */  ''
  }

  function isSlow(result) {
    return result.slow?     '.slow'
    :      /* otherwise */  ''
  }

  function suiteVerdict(results) {
    var verdicts = results.map(function(r) { return r.verdict })

    return verdicts.indexOf('failure') != -1?  'failure'
    :      verdicts.indexOf('success') != -1?  'success'
    :      /* otherwise */                     ''
  }

  function isSuiteSlow(results) {
    return results.some(function(result) { return result.slow })
  }

  function suiteTime(results) {
    return results.reduce(function(r, a) {
             return r + (time(a) || 0)
           }, 0)
  }

  function time(result) {
    return result.finished - result.started
  }

  function runningTime(t) {
    return isNaN(t)?  null
    :      /* _ */    _('.running-time', '(' + t + 'ms)')
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
            , runningTime(time(result)))
  }

  function renderResult(type, result, details) {
    return _('li.report.test-result' + verdictFor(result)
                                     + isSlow(result)
                                     + '.' + type
            , toggleDetails(renderTitle(result))
            , details)
  }

  function renderTestResult(result) {
    return renderResult('test-case'
                       , result
                       , _('.details'
                          , renderException(result.exception)))
  }

  function renderSuiteResult(result) {
    return renderResult('suite'
                       , result
                       , _('ul.details.active'))
  }

  function makeTestResult(result) {
    return merge(result
                , { title: result.test.title })
  }

  function makeSuiteResult(suite, results) {
    return { title: suite.title }
  }

  var toggleDetails = listen('click', function(ev) {
                       var parent = ev.currentTarget.parentElement
                       toggleClass('active', query('.details', parent))
                     })


  function setupSearchPanel(button, panel) {
    var all = doom.concat(button, panel)
    doom.listen( 'click'
               , doom.toggleClass.bind(null, 'active', all)
               , button)

    var filter = qs.parse(location.search.slice(1))['q']
    applySearchFilter(filter)
  }

  function applySearchFilter(filter) {
    if (filter) {
      var re = new RegExp(filter)
      Test.enabled = function(t) {
                       return re.test(this.fullTitle().join(' '))
                     }
      head(query('#q')).value = filter
      addClass('active', query('#search-button, #search-panel'))
    }
  }

  function reporter(report) {
    var container = head(query('#test-results'))
    var context   = container
    var current   = null
    var stack     = [] // :: [Result]

    var passedTests  = head(query('#status .passed .test-count'))
    var failedTests  = head(query('#status .failed .test-count'))
    var ignoredTests = head(query('#status .ignored .test-count'))

    setupSearchPanel( query('#search-button')
                    , query('#search-panel'))

    report.on('suite:started', function(ev, suite) {
      var render = renderSuiteResult(makeSuiteResult(suite))
      append(context, render)
      stack.push(context)
      context = head(query('.details', render))
    })

    report.on('suite:finished', function(ev, results, suite) {
      var verdict = suiteVerdict(results)
      var slow    = isSuiteSlow(results)
      var parent  = context.parentElement

      if (verdict)  addClass(verdict, parent)
      if (slow)     addClass('slow', parent)

      append( head(query('.title', parent))
            , runningTime(suiteTime(results)))

      context = stack.pop()
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

  return reporter
}
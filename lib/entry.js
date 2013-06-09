var beanB      = require('doom-bean')
var nwmatcherB = require('doom-nwmatcher')
var brofist    = require('brofist')
var browser    = require('./index')
var specs      = require('::specs')

if (!Array.isArray(specs))  specs = [specs]

brofist.run(specs, browser(nwmatcherB, beanB))
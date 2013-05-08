var spec   = require('brofist')()

spec('Your thing', function(it) {
  it('Should pass', function() {
    /* yay */
  })

  it('Should fail', function() {
    throw new Error('Failed.')
  })
})

spec.run(require('../')())
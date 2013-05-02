# buddy-browser

Browser reporter for Buddy.

## Example

You pass the `buddy-browser` library as your reporter:

```js
var spec   = require('test-buddy')()
var assert = require('assert')

spec('Your thing', function(it) {
  it('Should do X', function() {
    assert.strictEqual(f(x), g(x))
  })
})

spec.run(require('buddy-browser')())
```

And get back this deliciously rich output!


## Installing

Just grab it from NPM:

    $ npm install buddy-browser
    
## Licence

MIT/X11. IOW you just do whatever the fuck you want to ;3

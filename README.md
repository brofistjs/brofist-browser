# brofist-browser

Browser reporter for [Brofist](https://github.com/brofistjs/brofist).

## Example

You write your tests [Brofist style](https://github.com/brofistjs/brofist/wiki/Writing-tests)

```js
var spec = require('brofist')()

module.exports = spec('Your thing', function(it) {
  it('Should pass', function() {

  })

  it('Should fail', function() {
    throw new Error('boo')
  })
})
```

Then point the server to your file:

```bash
$ brofist-browser serve your-file.js
```

And get back this deliciously rich output!

![The output of Brofist-browser](example.png)


## Installing

Just grab it from NPM:

    $ npm install -g brofist-browser
    
## Licence

MIT/X11. IOW you just do whatever the fuck you want to ;3

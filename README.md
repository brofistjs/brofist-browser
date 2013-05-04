# buddy-browser

Browser reporter for Buddy.

## Example

You pass the `buddy-browser` library as your reporter:

```js
var spec   = require('test-buddy')()

spec('Your thing', function(it) {
  it('Should pass', function() {

  })

  it('Should fail', function() {
    throw new Error('boo')
  })
})

spec.run(require('buddy-browser')())
```

Then point the server to your file:

```bash
$ buddy-browser serve your-file.js
```

And get back this deliciously rich output!

![The output of Buddy-browser](example.png)


## Installing

Just grab it from NPM:

    $ npm install -g buddy-browser
    
## Licence

MIT/X11. IOW you just do whatever the fuck you want to ;3

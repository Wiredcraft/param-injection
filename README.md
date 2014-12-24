# Param Injection

(Node.js) Wraps a function so that one or some of the parameters can be auto-loaded at run time. Mainly used to build modules or functions that may have some run time dependencies.

This is similar to "Dependency Injection" but much simpler.

## What

It exports a function.

```js
var injectify = require('param-injection');
```

And that can be used to wrap a function, so that one or some of the parameters of the function can be actively retrieved (with a given getter) at run time.

For example, say you have a function that does something, and requires some arguments.

```js
var request = require('request');
var Promise = require('bluebird');

function requestSomething(url, other, args) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, res) {
            if (err) return reject(err);
            resolve(res);
        });
    })
}
```

And one of the arguments can be from another function (or say you want to build it with another function).

```js
function getUrl() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('http://www.google.com');
        }, 10);
    });
}
```

Now instead of calling them together all the time, you can wrap the original function and you get a new function.

```js
var myRequest = injectify(requestSomething, 'url');
```

And inject the getter function.

```js
myRequest.inject('url', getUrl);
```

__Tip__: you can do the above 2 lines in one step.

```js
var myRequest = injectify(requestSomething, 'url').inject('url', getUrl);
```

Now you can run the wrapper, with only the other arguments (meaning that the new function has a different API with the original function).

```js
myRequest('other', 'args').then(function(res) {
    // res.should.be.type('object');
    // res.should.have.property('statusCode', 200);
});
```

## Why

This small tool solves a very specific problem, where:

1. You are building a module (not an application where you could do whatever you want).
2. And you are building a function that has some asynchronous dependencies.
3. And you want to give it a default parameter while still give your user a chance to change it.

Without this tool it is usually hard to achieve the same thing but with this tool the code can be a bit more complex; your choice.

## API

TODO

## Variations

### Return self

A variation that returns the context or `this`.

Can be used to build some callback based APIs.

However note that the dependencies are still promise based.

### Return auto

A variation that returns either the promise or the context, depends on if a callback function is given.

Can be used to build something with both a promise API and a callback API.

However note that 1) the dependencies are still promise based and 2) the last argument is considered as a callback if it is a function and 3) we assume the callback will be properly handled.

### With "promisify"

TODO

### Cached result (caching the promise)

TODO

## Bonus

### As a flow control tool

TODO

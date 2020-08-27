---
title: How Does Ember's Dependency Injection System Work?
image: /images/sweetgun-UrY8jgHHapw-unsplash.jpg
imageMeta:
  attribution: "甜心之枪 Sweetgun"
  attributionLink: https://unsplash.com/photos/UrY8jgHHapw
featured: true
authors:
  - nullvoxpopuli
date: Sat Aug 08 2020 13:04:01 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
  - javascript
  - architecture
  - frontend
---

## Why?

One of the most common things I hear from people who are new to Ember,
new to programming in general, or coming from another frontend ecosystem
(especially React and Vue), is that they think Ember's dependency injection
system is too complicated and magical --
too hard to reason about or know where the injected services come from.
I, too, was in that boat -- until I really dove into how it works -- it was
then that I began to understand why dependency injection even exists, and
how it's actually _simpler_ than _not_ having it at all.

But first, I'm a proponent of ["show, don't tell"](https://en.wikipedia.org/wiki/Show,_don%27t_tell),
so we'll start by implementing dependency injection from scratch in order to demystify
and have something concrete that can be referenced.

## What is Dependency Injection?

According to [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)

> *dependency injection* is a technique in which an object receives other obects that it depends on.

_That's it_.

So... this is dependency injection?

```js
let foo = new Foo()

let bar = new Bar(foo);
```

yes!.

The big deal with dependency injection usually comes from _managing_ how an object
receives those other objects.


## Why use Dependency Injection?

## How does Dependency Injection work in Ember?

## What does Ember do behind the scenes?



## Let's write our own!

This is a bottom-up approach, meaning that we start with the bare minimum, and the
gradually add more behavior as we move forward. First, we'll need to define some
terms and set goals, so we're on the same page:

Nomenclature:
- Service: a named bucket of state and/or behavior (usually a class instance);
- Injection: the act of defining a reference to a Service
- Container: the object that holds references to each Service

Goals:
1. A Service can be referenced from anywhere, regardless of where it is accessed
2. A Service is a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern)
3. Services can reference each other (circular dependencies are valid)
4. Access to the global namespace is not allowed



This could be considered an ancestor to dependency injection, where there exists
a shared `container` object in the module scope, still allowing for us to
achieve the first three goals.


```ts
// app.js
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

class Bot {
  begin() {
    let nextMove = container.ai.getMove();

    container.ui.sendKeyPress(nextMove);
  }
}

function initalizeServices() {
  container.ai = new AI();
  container.bot = new Bot();
  container.ui = new UI();
}


bootApp();
```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-1-19yqj)

In a multi-file environment we don't have access to the same module scope between files,

```ts
// app.js
import Bot from './bot';
import AI from './ai';
import UI from './ui';

let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  container.ai = new AI(container);
  container.bot = new Bot(container);
  container.ui = new UI(container);
}

// bot.js
export default class Bot {
  constructor(container) {
    this.container = container;
  }

  begin() {
    let nextMove = this.container.ai.getMove();

    this.container.ui.sendKeyPress(nextMove);
  }
}

```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-2-b0qws)

However, as a framework or library developer, forcing users / application developers
to remember to assign the container each time isn't very ergonomic.

```ts
// app.js
// same as before

// service.js
export default class Service {
  constructor(container) {
    this.container = container;
  }
}

// bot.js
import Service from './service';

export default class Bot extends Service {
  begin() {
    let nextMove = this.container.ai.getMove();

    this.container.ui.sendKeyPress(nextMove);
  }
}
```

This is a little better, we have abstracted away a bit of boilerplate, but there is still
a "magic property", `container` -- this is generally where object oriented programming
can get a negative reputation for -- a lack of _proper_ or _incomplete_ abstraction.

> _A bad abstraction is worse than no abstraction_

So, let's clean that up a bit using a [decorator](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

```ts
// app.js
// same as before

// service.js
let CONTAINER = Symbol('container');

export default class Service {
  constructor(container) {
    // the container is now set on a symbol-property so that app-devs don't
    // directly access the container. We want app-devs to use the abstraction,
    // which we're aiming to be more ergonamic
    this[CONTAINER] = container;
  }
}

// TODO: explain that this is a decorator
export function injectService(target, name, descriptor) {
  return {
    configurable: false,
    enumerable: true,
    get: function() {
      if (!this[CONTAINER]) {
        throw new Error(`${target.name} does not have a container. Did it extend from Service?`);
      }

      return this[CONTAINER][name];
    }
  }
}

// bot.js
import Service { injectService } from './service';

export default class Bot extends Service {
  @injectService ai;
  @injectService ui;

  begin() {
    let nextMove = this.ai.getMove();

    this.ui.sendKeyPress(nextMove);
  }
}
```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-3-mum0p?file=/bot.js)

With this approach we can reference each service by name -- but we have a new problem now:
_as a framework developer, how do we ensure that service properties match up to the service classes?_

In the current implementation, we've been arbitrarily assigning values on the `container` object,
`ui`, `ai`, and `bot`. Since this has been in user-space, we've always known what those properties
are on the container.

This is where convention steps in.


As framework / library authors, we can say that services are required to be in the
`services/` folder of your project.

```ts
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  for (let [name, AppSpecificService] of detectedServices) {
   container[name]  = new AppSpecificService(container);
  }
}
```

However, if you're familiar with module-based javascript, you'll noticed that `detectedServices`
needs to _somehow_ be aware of the services in the `services/` folder and know their names.

This is where a CLI, at build-time, can help out our framework at run-time.

In Ember, this step is handled be the [ember-resolver](https://github.com/ember-cli/ember-resolver)
which then defers to [requirejs](https://github.com/ember-cli/ember-resolver/blob/master/addon/resolvers/classic/index.js#L16),
which [defines modules](https://requirejs.org/docs/api.html#define) in the [AMD](https://requirejs.org/docs/whyamd.html#namedmodules)
format -- which, for now, we don't need to worry about.

For demonstration purposes, we'll "say" that our bundler and CLI are configured
together to produce a map of relative file paths to modules:
```ts
let containerRegistry = {
  'services/bot': import('./services/bot'),
  'services/ai': import('./services/ai'),
  'services/ui': import('./services/ui'),
}
```

so then our `app.js` may look like this:
```ts
let knownServices = Object.entries(containerRegistry);
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  for (let [fullName, ServiceModule] of knownServices) {
    let name = fullName.replace('services/', '');
    let DefaultExport = ServiceModule.default;

    container[name]  = new DefaultExport(container);
  }
}
```

So now in our documentation, we can write that whatever the file name of the service is
will be the name of the property pointing to an instance of that service within
the `container`.


Now, what if we wanted our services to be lazily instantiated, so that we don't negatively
impact the _time to interactive_ benchmark if we don't have to?

So far our `container` has been a plain old object. We can utilize a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```ts
let knownServices = Object.entries(containerRegistry);
let registry = {};

let container = new Proxy(registry, {
  get: function(target, propertyName) {
    if (target[propertyName]) {
      return target[propertyName];
    }

    let FoundService = lookupService(propertyName);

    target[propertyName] = new FoundService(container);

    return target[propertyName];
  }
});

function lookupService(serviceName) {
  let serviceModule = Object.entries(knownServices).find((serviceInfo) => {
    let [ servicePath, serviceModule ] = serviceInfo;

    let name = servicePath.replace('services/', '');

    if (serviceName === name) {
      return serviceModule;
    }
  });

  if (!serviceModule) {
    throw new Error(`The Service, ${serviceName}, was not found.`);
  }

  return serviceModule.default;
}

function bootApp() {
  // initialization now happens on-demand
  container.bot.begin();
}
```

To see the final implementation, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-4-5fjzg)

## "That's It!"

Once I realized the implementation of ember's dependency injection, it felt
simple. It's prerty much a _global store_ where instances of classes are
stored on that _global store_ and referenced from other places within your app.
If something here _doesn't_ feel simple, let me know!, and hopefully I can tweak
this blog post until it does feel simple.

I like the pattern a lot, because it avoids the need to explicitly pass references
to every object you want to use throughout your entire app. Instead, Ember abstracts
away the passing of the container object to all objects created through that container
(mostly components and services, but custom classes can be used as well).

## Disclaimers

Dependency injection can be a big topic and have a lot of features implemented.
This demonstration has narrow scope and is not intended to be a "fully featured"
dependency injection implementation.

## About

Professionally, I had my start to frontend development in React, and at the time
there was really only Redux and MobX for state management -- but I only had the
privilege of working with Redux and eventually React's Context Provider/Consumer
pattern. There _is_ a little bit of overlap between React's Contexts and Ember's
Services, but they differ in fundamental ways -- which could be a topic for
another time.

Now that I'm getting paid to work with Ember almost every day I've only
gotten more excited about the programming patterns introduced by the framework and
am eager to share them with the world.


-----------------------

_This was inspired from some conversations on Twitter as well as trying not
to use a web framework for building an
[Artificatial Intelligence to play a game](https://github.com/NullVoxPopuli/doctor-who-thirteen-game-ai/blob/bc09c823abe89894cf7607aaa1820c348b900c10/ai.js#L5)_



## References

- [TC39 Decorator Proposal](https://github.com/tc39/proposal-decorators)
- [Ember Documentation on Dependency Injection](https://guides.emberjs.com/release/applications/dependency-injection/)

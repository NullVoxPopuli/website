---
title: Ember Concurrency
image: /images/mike-enerio-2IkxeDKaZdY-unsplash.jpg
imageMeta:
  attribution:
  attributionLink: https://unsplash.com/photos/2IkxeDKaZdY
featured: true
authors:
  - nullvoxpopuli
date: Tue Aug 27 2019 21:17:22 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
---

# Concurrency, the problems you don't know you have

In user interface develompent, there are many intermediate states that must be accounted for.
A user may click a button that triggers something that will take a while, such as an API request.
Maybe a websocket connection needs to be established,
or there is a page with search or autocomplete capabilities.
[ember-concurrency](https://ember-concurrency.com) solves a number of problems
with dealing with intermediate state in both user interaction and background async behavior.
Let's take a look at what ways that ember-concurrency makes things easier,
and what ways it's not needed.

> Note: this post will be kept up to date with the latest decorators and
> concurrency documentation as the decorators proposal and
> babel transform support changes / improves.

Packages Versions at the time of writing:

 - ember-cli-babel: 7.11.0
 - ember-concurrency: 1.0.0
 - ember-source: 3.14.0-canary

As a disclaimer: this post is not comprehensive, and there are likely additional use cases for both using and _not_ using ember-concurrency.

**Table Of Contents**

- [Submitting a Form](#submitting-a-form)
- [Examples](#examples)
    - [Async Button](#async-button)
    - [Text Search](#text-search)
- [Further Reading](#further-reading)

<h2 id='submitting-a-form'>Submitting a form</h2>

Forms can be used for creating and updating data. Given that we have the following form:

```handlebars
<form {{on 'submit' this.onSubmit}}>
  <input type='submit' value='Save' />
</form>
```
Every time the user triggers the form's submit, `this.onSubmit` will be invoked. That sounds exactly what we want right? Well, not necessarily. Maybe `onSubmit` is defined as:
```ts
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MyForm extends Component {
  @action
  async onSubmit() {
    await fetch('https://my.api/resource', { method: 'POST' });
  }
}
```
if the network is laggy, or if the user's browser hangs for whatever reason,
the user may get impatient and trigger the submit action again.
If this API endpoint is creating a new record on every request,
we now have duplicate data.
To protect against duplicating data,
we'll need to track state inside the submit action,
and represent that state on the form.
```ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyForm extends Component {
  @tracked isSubmitting = false;

  @action
  async onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    await fetch('https://my.api/resource', { method: 'POST' });

    this.isSubmitting = false;
  }
}
```

```handlebars
<form {{on 'submit' this.onSubmit}}>
  <input type='submit' value='Save' disabled={{this.isSubmitting}}/>
</form>
```
We've now doubled the amount of code in this example.

Unfortunately, assuming we're writing tests for our code, we may accidentally discover an error during our tests.

> Called set on destroyed object

To resolve this, after every `await`, we need to check to see if our component has been destroyed.
Our action now becomes:
```ts
  async onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    await fetch('https://my.api/resource', { method: 'POST' });

    if (this.isDestroyed || this.isDestroying) {
      this.isSubmitting = false;
    }
  }
```

This problem is exacerbated if our action has multiple `await`ed function calls. There is a possibility of our context becoming destroyed after every `await`!

If there are many forms for dealing with various resources,
this becomes _a lot_ of boilerplate --
which will grow in to a lot of difficult to maintain code as your project teams grow.
Inconsistencies will be introduced due to varying implementations or
people's perspectives on what state should be managed,
and what actions need to be protected. So what do we do?
How do we ensure a consistent implementation for all of this type of behavior?

_ember-concurrency_.

The above example, could be re-written as:
```ts
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class MyForm extends Component {
  @(task(function*() {
    yield fetch('https://my.api/resource', { method: 'POST' });
  }).drop())
  onSubmit;
}
```
```handlebars
<form {{on 'submit' (perform this.onSubmit)}}>
  <input type='submit' value='Save' disabled={{this.onSubmit.isRunning}}/>
</form>
```

We're back to having minimal code.
Not only do we no longer need to track the running state,
but _the destroyed state is handled for us_.

Notes on the new APIs introduced:

- `task`

  The `task` function handles all the "state" of the async behavior.
  This'll include running, not running, errored, how many concurrent task there are,
  what the last result or error was. For more information on `task`,
  [see the `task` documentation]().

- `yield`

  This is a keyword used in generators to _yield_ control back to the calling context.
  In this case, the calling context is more or less abstracted away from us.
  It enables the function passed to `task` to be cancelled, or restarted,
  which get to the importance of shortly.

- `drop`

  This is an ember-concurrency api on the [`Task`]().
  It signifies the type of behavior we want. In this example,
  we want subsequent requests to be dropped or ignored,
  as we want to wait for the first request to be completed before allowing a subsequent request.
  This is important, because maybe the form won't even be on the page when the task finishes.
  A common pattern for CRUD is to redirect to a newly created resource for viewing,
  and this would enable that behavior to safely be _performed_.

- `perform`

  A template helper that returns a function that invokes `perform` on the task.
  The value returned by `task` isn't a function itself,
  but a `Task` that has a `perform` method.
  The `Task` encapsulates the state of the async behavior,
  and `perform` is how an instance of that behavior is created / started.

<h2 id='when-not'>When wouldn't you use ember-concurrency?</h2>

`ember-concurrency` is not a replacement for `async`/`await` behaviors. It's a supplement. The rule of thumb is: 

> Use `async`/`await` when your function has no side-effects on the calling context.   
> Use `ember-concurrency` when there are side-effects, or limiting concurrent executions of a function.

Where a side-effect is:
 - the setting of a variable in the invocation context (such as a service or component)
 - the triggering of another task


For example, a side-effect-free function may look like this:
```ts
import Component from '@glimmer/component';
import ENV from 'app-name/config/environment';

export default class MyComponent extends Component {
  async getPosts() {
    let response = await fetch(`${ENV.host}/api/posts`);
    let json = await response.json();
    let data = JSON.parse(json);

    return data.posts;
  }
}

```
It does not set any properties on the class. If the component is destroyed while the `fetch` request is in-flight -- nothing will go wrong, as there is no `set` / assignment on a destroyed component. 

If we desire to trigger `getPosts` from a user interaction, there will need to be an `ember-concurrency` task somewhere.

```ts
@action 
async refresh() {
  let posts = await this.getPosts();

  this.posts = posts;
}
```
If we were to add an action invokes `getPosts`, we would run into two problems:

 1. An error will occur "called set on destroyed object", if the component is destroyed before `refresh` finishes.
 2. There is no way to prevent concurrent requests.

Both of these are solved with a Task

```ts
@(task(function*() {
  let posts = yield this.getPosts();

  this.posts = posts;
}).drop()) 
refresh;
```

It looks almost the same, except the task is cancelled when the component is destroyed, and all subsequent calls to `refresh` will be ignored, until the first running invocation finishes. But while `refresh` _must_ be a task. `getPosts` can remain a vanilla JavaScript `async`/`await` function.


<h2 id='examples'>Examples</h2>

<h3 id='async-button'>Async Button</h3>

Async buttons, or buttons that can be aware of the rejected or resolved states of a promise,
are a common pattern for one-click triggers of async behavior --
but that API calls, waiting for something processing-intensive, etc.

Going forward with this post, there will be minimal prose,
and mostly just before/after examples of pre/after ember-concurrency --
there *will* be some explanation of why someone wouldn't want to use ember-concurrency,
where appropriate.

Additionally, all examples will be using TypeScript to describe the API of the components.

**Before**

```ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracked';
import { action } from '@ember/object';

interface Args {
  promise: <ReturnType>() => Promise<ReturnType>;
  disabled?: boolean;
  label: string;
}

const SHOW_SUCCESS_FOR_MS = 2000;

export default class AsyncButton extends Component<Args> {
  @tracked isSuccess = false;
  @tracked isRunning = false;
  @tracked isError = false;

  @tracked error?: string;

  get isIdle() {
    return !this.isRunning;
  }

  @action
  async onClick() {
    if (this.isRunning) {
      return;
    }

    this.reset();

    try {
      await this.args.promise();

      if (!this.isDestroying && !this.isDestroyed) {

        this.isSuccess = true;

        await new Promise((resolve) => {
          setTimeout(
            () => this.reset(),
            SHOW_SUCCESS_FOR_MS
          );
        });
      }


      return;
    } catch (e) {
      if (!this.isDestroying && !this.isDestroyed) {
        this.error = e.message;
        this.isError = true;
      }
    }


    if (!this.isDestroying && !this.isDestroyed) {
      this.isRunning = false;
    }
  }

  reset() {
    this.isSuccess = false;
    this.isError = false;
    this.isRunning = true;
    this.error = undefined;
  }
}
```
```handlebars
<button
  {{on 'click' this.onClick}}
  ...attributes
  disabled={{or this.isRunning @disabled}}
>
  {{#if this.isIdle}}
    {{@label}}
  {{else if this.isRunning}}
    Running...
  {{else if this.isSuccess}}
    Success!
  {{else if this.isError}}
    Error: {{this.error}}
  {{/if}}
</button>
```


**After**

```ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

interface Args {
  promise: <ReturnType>() => Promise<ReturnType>;
  disabled?: boolean;
  label: string;
}

const SHOW_SUCCESS_FOR_MS = 2000;

export default class AsyncButton extends Component<Args> {
  @tracked isSuccess = false;

  @(task(function*() {
    await this.args.promise();
    this.isSuccess = true;

    await timeout(SHOW_SUCCESS_FOR_MS);

    this.isSuccess = false;
  }).drop())
  promiseRunner;
}
```
```handlebars
<button
  {{on 'click' (perform this.promiseRunner)}}
  ...attributes
  disabled={{or this.promiseRunner.isRunning @disabled}}
>
  {{#if this.promiseRunner.isIdle}}
    {{@label}}
  {{else if this.promiseRunner.isRunning}}
    Running...
  {{else if this.isSuccess}}
    Success!
  {{else if this.promiseRunner.isError}}
    Error: {{this.promiseRunner.error}}
  {{/if}}
</button>
```

<h3 id='text-search'>Text Search</h3>

**Before**
```ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const DEBOUNCE_MS = 250;

interface Args {
  onSearch: <ResultType>(text: string) => Promise<ResultType>
}

function waitMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default class TextSearch extends Component {
  @tracked text = '';

  lastInvocation = undefined;

  async search() {
    this.lastInvocation = new Date();

    await waitMs(DEBOUNCE_MS);

    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    let waitEndedAt = new Date();

    // did we search again while waiting?
    let didSearchAgain = this.lastInvocation - waitEndedAt < DEBOUNCE_MS;

    if (didSearchAgain) {
      return; /* do not invoke search */
    }

    await this.args.onSearch(text);
  }
  search;
}
```
```handlebars
<form {{on 'submit' this.search}}>
  <Input @value={{this.text}} />

  <!-- submit on press of enter key-->
  <input type='submit' value='Search'>
</form>
```

**After**
```ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_MS = 250;

interface Args {
  onSearch: <ResultType>(text: string) => Promise<ResultType>
}

export default class TextSearch extends Component {
  @tracked text = '';

  @(task(function*(){
    yield timeout(DEBOUNCE_MS);

    yield this.args.onSearch(text);
  }).keepLatest())
  search;
}
```
```handlebars
<form {{on 'submit' (perform this.search)}}>
  <Input @value={{this.text}} />

  <!-- submit on press of enter key-->
  <input type='submit' value='Search'>
</form>
```


<h2 id='further-reading'>Further Reading</h2>

The [ember-concurrency docs](http://ember-concurrency.com/docs/tutorial) have a very thorough explanation of a single example of before and after applying ember-concurrency to a problem.
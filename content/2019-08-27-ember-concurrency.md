---
title: Ember Concurrency
image:
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Tue Aug 27 2019 21:17:22 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
---

# Concurrency, the problems you don't know you have

// TODO: add live examples

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

**Table Of Contents**

- [Submitting a Form]
- [Async Button]
- [Websocket Connections]
- [API Service]
- Search / Debouncing
    - [Text Search]
    - [Multi-Field Search]

## Submitting a form

Forms can be used for creating and updating data. Given that we have the following form:

```hbs
<form {{on 'submit' this.onSubmit}}>
  <input type='submit' value='Save' />
</form>
```
Every time the user triggers the form's submit, `this.onSubmit` will be invoked. That sounds exactly what we want right? Well, not neccisarily. Maybe `onSubmit` is defined as:
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
```hbs
<form {{on 'submit' this.onSubmit}}>
  <input type='submit' value='Save' disabled={{this.isSubmitting}}/>
</form>
```
We've now doubled the amount of code in this example.

Unfortunately, assuming we're writing tests for our code, we may accidentally discover an error during our tests.

TODO: look up actual error:

> Tried to set value on destroyed object

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
```hbs
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

## Async Button

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
```hbs
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
```hbs
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


## Websocket Connections
## API Service
 - possible example of when not to use ember-concurrency???
## Text Search
## Multi-Field Search

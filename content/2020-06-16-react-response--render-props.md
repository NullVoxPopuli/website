---
title: "React Response: Render Props"
image: /images/ChangiAirport-Singapore.jpg
imageMeta:
  attribution:
  attributionLink: https://unsplash.com/photos/6BVinN0Y7Xk
featured: true
authors:
  - nullvoxpopuli
date: Wed Jun 16 2020 21:42:58 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
  - react
---

# React Response: Render Props

_Series Intro_ [feel free to skip](#render-props-begin)


Partially due to the fact that I find coming up with things to write about somewhat difficult, I've been seeking articles from the React community to rewrite for Ember (primarily [on twitter](https://twitter.com/nullvoxpopuli/status/1134602455088619521)). This'll help the searchability of common patterns people may be familiar with when coming from React, or any other ecosystem which also has a similar nomenclature.

My hope for this series is only two things:
 - Improve the perception of Ember with respect to modern features and behavior
 - Show how conventions and architectural patterns can make everyone's lives easier.

<span id='render-props-begin' />
Rather than a response to a particular blog featuring React, this is more of a demonstration of correlating design patterns between the two ecosystems. Thanks to [@vlascik](https://twitter.com/vlascik/status/1134686913875664898) for the suggestion to cover React's render props pattern.

First, let's clarify what a render prop is for those who may not be familiar with the term. According to the [React Documentation](https://reactjs.org/docs/render-props.html):

> The term [“render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) refers to a technique for sharing code between React components using a prop whose value is a function.

In React, components are _just functions_™, so any prop passed to a component whos value is a function that returns JSX is considered a "render prop".

Some examples:

```tsx
<Header
  {/* profileImage is the render prop */}
  profileImage={profileProps => {
    return (
      <LargeProfileImage {...profileProps} />
    )
  }
}>
  <AppNavigation />
</Header>
```
```tsx
<Header>
  <AppNavigation />
  {/* children, an implicit render prop passed to Header when there is block content */}
  <LargeProfileImage />
</Header>
```

where Header could be defined as:
```tsx
export function Header({ profileImage, children }) {
  return (
    <header>
      <HomeLink />

      {children}

      {profileImage &&
        profileImage({ className: 'header-image' })
      }
    </header>
  )
}
```

> When would someone want to use render props in React?

When a part of a component's template needs to be different between usages of that component. Rather than using conditionals in the component (in this case `Header`), render props allow yielding control to the calling context.

Ember has the exact same capabilities, but under a different name: _"Yieldable Named Blocks"_. Which we'll get to after we talk about the default / easy thing to do with both ecosystems.

### {children}

For `{children}`, however, there is an _exact_ corollary in Ember: `{{yield}}`.

Both words have **great** semantic meaning as well.

> A parent component _yields_ the rendering context to its _children_.

The default template generated for a component contains a single line: `{{yield}}`.
Let's change that to mimic the React example:
```handlebars
<header>
  <HomeLink />

  {{yield}}
</header>
```
aside from not having the profileImage render prop, these templates are the exact same, but with `{children}` replaced with `{{yield}}`

### Any other render prop

In Ember, we'd still use yield, but with a parameter to create named 'blocks' that the calling context can use. These yields with the `to` argument are "_Yieldable Named Blocks_" (available in Ember 3.20+)

Example using `Header`, from above:
```handlebars
<header>
  <HomeLink />

  {{yield}}

  {{yield to='image'}}
</header>
```
and then the calling context would look like:

```handlebars
<Header>
  <AppNavigation />

  <:image>
    <LargeProfileImage />
  </:image>
</Header>
```

### Passing Arguments

For both of these examples, assume there is a UI Library which provides a bunch of component primivites for constructing the common UI pattern / "Card".

in React:

```tsx
export function SomeComponent({ header, content, children, footer }) {
  return (
    <Card>
      {header && (
        <CardHeader>
          {header({
            Image: CardHeaderImage,
            Icon: CardHeaderIcon
          })}
      </CardHeader>
      )}

      <CardContent>
        {children}
        {content && content()}
      </CardContent>

      {footer && (
        <CardFooter>
          {footer()}
        </CardFooter>
      )}
    </Card>
  )
}
```
and then in the calling context
```tsx
export function App() {
  return (
    <SomeComponent
      header={({ Image }) => {
        return (
          <>
            <Image src='path/to-image.png' />

            My Header!
          </>
        );
      }}

      footer={() => {
        return (
          <button>Call to Action</button>
        );
      }}
    >
      freely yielded content
    </SomeComponent>
  );
}
```

in Ember:

```handlebars
{{!-- some-component --}}
<Card>
  {{#if (has-block 'header')}}
    <CardHeader>
      {{yield
        hash=(
          image=(component 'card-header-image')
          icon=(component 'card-header-icon')
        )
        to='header'
      }}
    </CardHeader>
  {{/if}}

  <CardContent>
    {{yield}}
    {{yield to='content'}}
  </CardContent>

  {{#if (has-block 'footer')}}
    <CardFooter>
      {{yield to='footer'}}
    </CardFooter>
  {{/if}}
</CardModal>
```

```handlebars
{{!-- the calling context --}}
<SomeComponent>
  <:header as |headerComponents|>
    <headerComponents.image src='path/to-image.png' />

    My Header!
  </:header>

  <:footer>
    <button>Call to Action</button>
  </:footer>

  freely yielded content
</SomeComponent>
```

What's cool about named blocks is that, as a component author, you are in control of the order the components are rendered.
So in the above example where header is first and footer is second, those _could_ be flipped, but still rendered in the same locations,
because the content is placed where the corresponding `{{yield to="name"}}` block is. I like that a lot, and it's something I always
wanted when I was writing React components.


## Want More Information?

- [The RFC for Yieldable Named Blocks](https://emberjs.github.io/rfcs/0460-yieldable-named-blocks.html)
- [The Ember Atlas](http://emberatlas.com)
  - [Ember for React Developers](https://www.notion.so/Ember-For-React-Developers-556a5d343cfb4f8dab1f4d631c05c95b)

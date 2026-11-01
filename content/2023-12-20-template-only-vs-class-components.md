---
title: Template Only vs Class Components
image: /images/daniels-joffe-PhQ4CpXLEX4-unsplash.jpg
imageMeta:
  attribution: Daniels Joffe 
  attributionLink: https://unsplash.com/photos/man-in-white-thobe-holding-microphone-PhQ4CpXLEX4
featured: true
authors:
  - nullvoxpopuli
date: Wed Dec 20 2023 14:00:38 GMT-0500 (Eastern Standard Time)
tags:
  - ember
---

Folks often hear that template-only components are faster than class-based components. But is it true?

Here is the setup,
- the [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark/tree/master/frameworks/keyed/ember) app.

    - this benchmark focuses on testing the rendering of large tables, measuring CPU, Memory, etc while also measuring time to first render as well as time to update across certain common behaviors of these large tables.
      Normally, Large tables aren't something you want in a real app -- almost always you want pagination, and/or virtualized content.
      However, this is a decent stress test for "large amount of data rendered at once".

- two copies of the code with the "row" content extracted to its own component.

    - the template-only version of the component looks like this

      ```js
       const Row =
         <template>
           <tr class={{if @isSelected 'danger'}}>
             <td class='col-md-1'>{{@item.id}}</td>
             <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
             <td class='col-md-1'><a {{on 'click' @remove}}><span
                   class='glyphicon glyphicon-remove'
                   aria-hidden='true'
                 ></span></a></td>
             <td class='col-md-6'></td>
           </tr>
         </template>;
      ```
    - the class-version of the component looks like this:

      ```js
       class Row extends Component {
         <template>
           <tr class={{if @isSelected 'danger'}}>
             <td class='col-md-1'>{{@item.id}}</td>
             <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
             <td class='col-md-1'><a {{on 'click' @remove}}><span
                   class='glyphicon glyphicon-remove'
                   aria-hidden='true'
                 ></span></a></td>
             <td class='col-md-6'></td>
           </tr>
         </template>
       }
      ```

The delta between the two components is this:
```diff
-  const Row =
+  class Row extends Component {
    <template>
      <tr class={{if @isSelected 'danger'}}>
        <td class='col-md-1'>{{@item.id}}</td>
        <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
        <td class='col-md-1'><a {{on 'click' @remove}}><span
              class='glyphicon glyphicon-remove'
              aria-hidden='true'
            ></span></a></td>
        <td class='col-md-6'></td>
      </tr>
-    </template>;
+    </template>
+  }
```

## Why?

When using TypeScript a question came up about the ergonomics of typing either of these components.

Here is what typing the template-only component looks like:

```ts
import { TOC } from '@ember/component/template-only';

interface Signature {
  Args: {
    item: { id: string; label: string };
    select: () => void;
    remove: () => void;
  }
}

const Row: TOC<Signature> = <template> ... </template>;
```

And here is what typing the class component looks like
```ts
interface Signature {
  Args: {
    item: { id: string; label: string };
    select: () => void;
    remove: () => void;
  }
}

// The Component was already imported from `@glimmer/component`
class Row extends Component<Signature> { ... };
```

This post isn't about the ergonomics of each of these, or which I prefer, but this is why I wanted to get actual hard data about the claims we've been hearing for years about template-only vs class-based.

_But!_ _having_ to make make a `const` for the default-export case, _is_ extra work, as you _must_ make a `const`. However, in a fully gjs/gts-using app, there does not need to be any default exports at as, as there would be no loose mode (classic, hbs files).
Using [gjs / gts in routes](https://github.com/discourse/ember-route-template), your regular component files with one export could look like:
```ts
// app/components/my-component.gts
export const MyComponent: TOC<Signature> = <template>...</template>;
```
and then imported:
```ts
import Route from 'ember-route-template';
import { MyComponent } from 'my-app/components/my-component';

export default Route(
  <template>
      <MyComponent>
          {{outlet}}
      </MyComponent>
  </template>
);
```


But anyway, getting back to answering the question I've yet to mention, 

> if someone prefers empty class components (which are linted against) for usage in TypeScript, is there anything they're missing out on by not using template-only components?

The tl;dr: is _yes_. But actual results will vary based on your actual app and use cases.

## _template-only components are 7-26% faster_

(for this particular benchmark and depending on which thing you're measuring).

As always, please test in your own apps. 
[Tracerbench](https://www.tracerbench.com/) is a statistically sound tool that uses [the built in performance.mark()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) apis.

This does **not** mean that this is always going to be the case. There has been increased activity in work happening in the VM to speed things up. For example, one such option that is being investigated is avoiding destruction callbacks on class components if the class didn't implement a destruction method (as well as removing the parent node before runnig destruction on child nodes (this would improve rendering brand new content or navigating to a new page)). Also at the time of writing, there already exists a good number of perf-related PRs, if anyone is interested: [on the glimmer-vm repo](https://github.com/glimmerjs/glimmer-vm/pulls?q=is%3Apr+perf+)

For the js-framework-benchmark, here are the actual results.

![Image of the results (table below)](/images/template-only-vs-class-js-framework-benchmark/results.png)


And the table of the results here:

<style>
  /* override blog styles */
  .results__table td {
    background-image: none !important;
  }
  .results__table h3 {
    font-size: 1rem;
  }
  .results__table th {
    line-height: 1.25rem;
    text-transform: initial !important;
    max-width: 200px;
    font-weight: normal !important;
  }
  .results__table .benchname {
  }
  .results__table button {
    padding: 0;
    border: none;
    color: var(--link);
    display: block;
    background-color: unset;
  }
  .results__table .rowCount {
    word-wrap: break-word;
    white-space: break-spaces;
    line-height: 1.15rem;
    max-width: 200px;
    font-weight: normal;
    text-transform: initial;
  }
</style>
<table class="results__table" inert>
	<thead>
		<tr>
			<td class="description">
				<h3>Duration in milliseconds ± 95% confidence interval (Slowdown = Duration / Fastest)</h3>
			</td>
		</tr>
	</thead>
	<thead>
		<tr>
			<th class="benchname"><button class="button button__text ">Name</button><br>Duration for...</th>
			<th><a target="_blank" rel="noreferrer" href="https://emberjs.com/">template-only</a></th>
			<th><a target="_blank" rel="noreferrer" href="https://emberjs.com/">with classes</a></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">create rows</button>
				<div class="rowCount">creating 1,000 rows (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">87.1</span><span class="deviation">3.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(117, 196, 125); color: rgb(0, 0, 0);"><span class="mean">97.2</span><span class="deviation">2.3</span><br><span class="factor">(1.12)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">replace all rows</button>
				<div class="rowCount">updating all 1,000 rows (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">107.9</span><span class="deviation">1.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(124, 198, 125); color: rgb(0, 0, 0);"><span class="mean">125.0</span><span class="deviation">2.0</span><br><span class="factor">(1.16)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">partial update</button>
				<div class="rowCount">updating every 10th row for 1,000 rows (3 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">27.2</span><span class="deviation">0.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">29.0</span><span class="deviation">1.3</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">select row</button>
				<div class="rowCount">highlighting a selected row. (5 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">26.4</span><span class="deviation">0.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(131, 200, 126); color: rgb(0, 0, 0);"><span class="mean">31.8</span><span class="deviation">1.1</span><br><span class="factor">(1.21)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">swap rows</button>
				<div class="rowCount">swap 2 rows for table with 1,000 rows. (5 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">34.9</span><span class="deviation">1.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(112, 195, 125); color: rgb(0, 0, 0);"><span class="mean">37.8</span><span class="deviation">2.4</span><br><span class="factor">(1.08)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">remove row</button>
				<div class="rowCount">removing one row. (5 warmup runs). 2 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">33.5</span><span class="deviation">1.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(116, 196, 125); color: rgb(0, 0, 0);"><span class="mean">37.2</span><span class="deviation">2.0</span><br><span class="factor">(1.11)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">create many rows</button>
				<div class="rowCount">creating 10,000 rows. (5 warmup runs with 1k rows).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">808.8</span><span class="deviation">6.6</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(105, 193, 124); color: rgb(0, 0, 0);"><span class="mean">840.7</span><span class="deviation">8.5</span><br><span class="factor">(1.04)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">append rows to large table</button>
				<div class="rowCount">appending 1,000 to a table of 1,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">107.2</span><span class="deviation">1.7</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(106, 193, 124); color: rgb(0, 0, 0);"><span class="mean">112.1</span><span class="deviation">1.9</span><br><span class="factor">(1.05)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">clear rows</button>
				<div class="rowCount">clearing a table with 1,000 rows. 4 x CPU slowdown. (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">38.5</span><span class="deviation">1.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(139, 203, 126); color: rgb(0, 0, 0);"><span class="mean">48.3</span><span class="deviation">2.0</span><br><span class="factor">(1.26)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text sort-key">weighted  geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(116, 196, 125); color: rgb(0, 0, 0);">1.11</th>
		</tr>
	</tbody>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">consistently interactive</button>
				<div class="rowCount">a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">4,285.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">4,279.7</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">total kilobyte weight</button>
				<div class="rowCount">network transfer cost (post-compression) of all the resources loaded into the page.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">573.1</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">573.1</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text "> geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
		</tr>
	</tbody>
	<thead>
		<tr>
			<td class="description">
				<h3>Memory allocation in MBs ± 95% confidence interval</h3>
			</td>
		</tr>
	</thead>
	<thead>
		<tr>
			<th class="benchname"><button class="button button__text ">Name</button></th>
			<th>template-only</th>
			<th>with classes</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">ready memory</button>
				<div class="rowCount">Memory usage after page load.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">6.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">6.8</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">run memory</button>
				<div class="rowCount">Memory usage after adding 1,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">13.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">14.7</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">update every 10th row for 1k rows (5 cycles)</button>
				<div class="rowCount">Memory usage after clicking update every 10th row 5 times</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">13.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">14.8</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">creating/clearing 1k rows (5 cycles)</button>
				<div class="rowCount">Memory usage after creating and clearing 1000 rows 5 times</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">8.1</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(107, 193, 124); color: rgb(0, 0, 0);"><span class="mean">8.6</span><br><span class="factor">(1.05)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">run memory 10k</button>
				<div class="rowCount">Memory usage after adding 10,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">70.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(118, 196, 125); color: rgb(0, 0, 0);"><span class="mean">79.5</span><br><span class="factor">(1.12)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text "> geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(109, 194, 125); color: rgb(0, 0, 0);">1.06</th>
		</tr>
	</tbody>
</table>


My system at the time of running the benchmark(s):
```bash
❯ google-chrome --version
Google Chrome 120.0.6099.109 

❯ uname -srp
Linux 6.2.0-39-generic x86_64


❯ lsb_release -csd
Ubuntu 23.04
lunar
```
info from `screenfetch`:
```
CPU: AMD Ryzen 9 7900X 12-Core @ 24x 4.7GHz
GPU: NVIDIA GeForce RTX 4080
RAM: <in use> / 63438MiB
```

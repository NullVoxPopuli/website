import { click, currentURL, visit } from "@ember/test-helpers";
import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";

module("Application | blog", function (hooks) {
  setupApplicationTest(hooks);

  test("the home page lists the newest post first", async function (assert) {
    await visit("/");

    assert.dom(".post-list h2").exists({ count: 26 });
    assert.dom(".post-list li:first-child h2").hasText("How to be Paranoid");
  });

  test("a post renders its Markdown", async function (assert) {
    await visit("/");
    await click(".post-list li:first-child h2 a");

    assert.strictEqual(currentURL(), "/2025-07-24-how-to-be-paranoid");
    assert.dom("article h1").hasText("How to be Paranoid");
    assert.dom(".prose p").exists();
  });

  test("code is highlighted at build time, and has a copy button", async function (assert) {
    await visit("/2024-04-24-signals");

    assert.dom(".prose pre.shiki").exists();
    assert.dom(".code-block button.copy").exists();
  });

  test("the cover image offers smaller sizes", async function (assert) {
    await visit("/2024-04-24-signals");

    assert.dom(".post-image picture source[type='image/webp']").hasAttribute("srcset", /480w/);
    assert.dom(".post-image img").hasAttribute("alt", "");
  });

  test("footnotes link to their definition", async function (assert) {
    await visit("/2024-04-24-signals");

    assert.dom(".prose .footnotes li").exists();
    assert.dom(".prose sup a[data-footnote-ref]").exists();
  });

  test("a tag lists its posts", async function (assert) {
    await visit("/tag/reactivity");

    assert.dom("h1").hasText("Reactivity");
    assert.dom(".post-list li").exists();
  });

  test("the navigation reaches a page", async function (assert) {
    await visit("/");
    await click("nav a[href='/page/links']");

    assert.strictEqual(currentURL(), "/page/links");
    assert.dom(".prose").exists();
  });

  test("the author page has links and posts", async function (assert) {
    await visit("/author/nullvoxpopuli");

    assert.dom(".author h1").hasText("NullVoxPopuli");
    assert.dom(".post-list li").exists({ count: 26 });
  });

  test("unknown addresses show not found", async function (assert) {
    await visit("/this-post-does-not-exist").catch(() => {});

    assert.dom("main h1").hasText("Not found");

    await visit("/a/deeper/address").catch(() => {});

    assert.dom("main h1").hasText("Not found");
  });
});

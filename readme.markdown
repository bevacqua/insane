# insane

> Lean and configurable whitelist-oriented HTML sanitizer

Works well in browsers, as its footprint size is very small _(around **~2kb** gzipped)_. API inspired by [`sanitize-html`][1] _(which is around **100kb** gzipped)_.

<sub>**You would be insane not to use this!**</sub>

# Install

```shell
npm install insane --save
```

# Usage

```js
insane('<div>foo<span>bar</span></div>', { allowedTags: ['div'] })
// <- '<div>foo</div>'
```

Contrary to similar sanitizers, `insane` drops the whole tree of descendants for elements that aren't allowed tags.

# API

# `insane(html, options?, strict?)`

- `html` can be an arbitrary HTML string
- `options` are detailed below
- `strict` means that `options` won't be based off of [insane.defaults](#defaults) if set to `true`

The parser takes into account that some elements can be self-closing. For safety reasons the sanitizer will only accept a valid URL for `background`, `base`, `cite`, `href`, `longdesc`, `src`, and `usemap` elements. **"Valid URL"** means that it begins with either `#`, `/`, or any of `options.allowedSchemes` _(followed by `:`)_.

## `options`

[Sensible defaults](#defaults) are provided, but you can change these options.

#### `allowedSchemes`

Defaults to `['http', 'https', 'mailto']`.

#### `allowedTags`

An array of tags that you'll allow in the resulting HTML.

###### Example

> Only allow spans, discarding the rest of elements.

```js
insane('<div>foo</div><span>bar</span>', {
  allowedTags: ['span']
});
// <- '<span>bar</span>'
```

#### `allowedAttributes`

An object describing the attributes you'll allow for each individual tag name.

###### Example

> Only allow spans, and only allow those spans to have an `id` _(discarding the rest of their attributes)_.

```js
insane('<span id="bar" class="super">bar</span>', {
  allowedTags: ['span'],
  allowedAttributes: { span: ['id'] }
});
// <- '<span id="bar">bar</span>'
```

#### `allowedClasses`

If `'class'` is listed as an allowed attribute, every single class will be allowed. If you don't list `'class'` as an allowed attribute, you can provide a class whitelist per tag name.

###### Example

> Only allow spans to have `super` or `bad` class names, discarding the rest of them.

```js
insane('<span class="super mean and bad">bar</span>', {
  allowedTags: ['span'],
  allowedClasses: { span: ['super', 'bad'] }
});
// <- '<span class="super bad">bar</span>'
```

#### `filter`

Takes a `function(token)` that allows you to do additional validation beyond exact tag name and attribute matching. The `token` object passed to your filter contains the following properties.

- `tag` is the lowercase tag name of the element
- `attrs` is an object containing _every_ attribute in the element, **including** those that may not be in the whitelist

If you return a falsy value the element and all of its descendants will not be included in the output. Note that you are allowed to change the `attrs`, and even add new ones, transforming the output.

###### Example

> Require that `<span>` elements have an `aria-label` value.

```js
function filter (token) {
  return token.tag !== 'span' || attrs['aria-label'];
}
insane('<span aria-label="a foo">foo</span><span>bar</span>', {
  allowedTags: ['span'],
  allowedAttributes: { span: ['aria-label'] },
  filter: filter
});
// <- '<span aria-label="a foo">foo</span>'
```

#### `transformText`

Takes a `function(text)` that allows you to modify text content in HTML elements. Runs for every piece of text content. The returned value is used instead of the original text contents.

## Defaults

The default configuration is used if you don't provide any. This object is available at `insane.defaults`. You are free to manipulate the defaults themselves.

```json
{
  "allowedAttributes": {
    "a": ["href", "name", "target"],
    "iframe": ["allowfullscreen", "frameborder", "src"],
    "img": ["src"]
  },
  "allowedClasses": {},
  "allowedSchemes": ["http", "https", "mailto"],
  "allowedTags": [
    "a", "article", "b", "blockquote", "br", "caption", "code", "del", "details", "div", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "main", "ol",
    "p", "pre", "section", "span", "strike", "strong", "sub", "summary", "sup", "table",
    "tbody", "td", "th", "thead", "tr", "ul"
  ],
  "filter": null,
  "transformText": null
}
```

# License

MIT

[1]: https://github.com/punkave/sanitize-html

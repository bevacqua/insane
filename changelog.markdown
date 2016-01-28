# 2.5.0 Transformers

- Added `transformText` option allowing to mangle or fork content of text nodes

# 2.4.3 Abbreviate!

- Added `abbr` tag name to defaults

# 2.4.2 Mark

- Added `mark` tag name to defaults

# 2.4.1 Encore

- Fix encoding issues in text nodes, which would become decoded and re-encoded for no reason

# 2.4.0 Thoughtseize

- Instead of throwing an exception, discards unclosed HTML tags at the end of the input stream

# 2.3.0 Implosion

- Attributes without a value are preserved as-is

# 2.2.0 Big Bang

- Attributes without a value, such as `<button disabled></button>` are translated into their better compatible counterparts `<button disabled="disabled"></button>`

# 2.1.1 Assignments

- Moved `assign()` into `assignment` npm module

# 2.1.0 Label Maker

- Added `title`, and `aria-label` to the `a` attribute whitelist
- Added `title`, `aria-label`, and `alt` to the `img` attribute whitelist

# 2.0.0 Sane Defaults

- Sanitizer options are now always based off of defaults
- Added `strict` parameter to revert to `1.0.0` behavior
- Removed `iframe` from default `allowedTags` collection
- Allow relative URLs such as `images/deep.png` in attributes
- Significantly sped up tag-intensive HTML parsing

# 1.0.0 IPO

- Initial Public Release

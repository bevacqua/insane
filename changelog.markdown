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

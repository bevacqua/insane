'use strict';

var test = require('tape');
var sinon = require('sinon');
var insane = require('..');

test('succeeds because of sensible defaults', function (t) {
  t.equal(insane('<div>bar<span>foo</span></div>'), '<div>bar<span>foo</span></div>');
  t.end();
});

test('succeeds because of whitelist approach', function (t) {
  t.equal(insane('<script>bar<span>foo</span></script>', { allowedTags: [] }), '');
  t.end();
});

test('deals with iframes and scripts by default', function (t) {
  t.equal(insane('<script>"foo"</script>'), '');
  t.equal(insane('<script src="http://google.com">"foo"</script>'), '');
  t.equal(insane('<iframe>"foo"</iframe>'), '');
  t.equal(insane('<iframe src="http://google.com">asd</iframe>'), '');
  t.end();
});

test('doesn\'t fail at basic parsing', function (t) {
  t.equal(insane('<div>\n  <span>\n    <span>/foo</span>\n  </span>\n</div>'), '<div>\n  <span>\n    <span>/foo</span>\n  </span>\n</div>');
  t.end();
});

test('only returns tags in the whitelist', function (t) {
  t.equal(insane('<p><span>foo</span>bar</p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.equal(insane('<p>bar<span>foo</span></p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.end();
});

test('only returns tags in the whitelist even if deeper content is allowed', function (t) {
  t.equal(insane('<div><p><span>foo</span></p>bar</div>', { allowedTags: ['span', 'div'] }, true), '<div>bar</div>');
  t.end();
});

test('only returns tags in the whitelist even if deeper content is allowed', function (t) {
  t.equal(insane('<p><span><div>foo</div></span>bar</p>', { allowedTags: ['p', 'div'] }, true), '<p>bar</p>');
  t.end();
});

test('only returns tags in the whitelist even if deeper content is mixed', function (t) {
  t.equal(insane('<p><span><span><p>foo</p></span></span>bar</p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.equal(insane('<p><div><span><div>foo</div></span></div>bar</p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.end();
});

test('only returns tags in the whitelist even if repeated', function (t) {
  t.equal(insane('<p><p>foo</p>bar</p>', { allowedTags: ['p'] }, true), '<p><p>foo</p>bar</p>');
  t.equal(insane('<p><p><span>foo</span></p>bar</p>', { allowedTags: ['p'] }, true), '<p><p></p>bar</p>');
  t.equal(insane('<p><span><p>foo</p></span>bar</p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.end();
});

test('only returns tags in the whitelist even if disallowed tag is nested', function (t) {
  t.equal(insane('<p><span><p><span>foo</span></p></span>bar</p>', { allowedTags: ['p'] }, true), '<p>bar</p>');
  t.end();
});

test('drops every attribute', function (t) {
  t.equal(insane('<div a="a" b="b" class="foo">foo</div>', { allowedTags: ['div'] }, true), '<div>foo</div>');
  t.end();
});

test('drops every attribute except the allowed ones', function (t) {
  t.equal(insane('<div a="a" b="b" class="foo">foo</div>', {
    allowedTags: ['div'],
    allowedAttributes: { div: ['b'] } },
    true
  ), '<div b="b">foo</div>');
  t.end();
});

test('drops every attribute except the allowed ones, even in case of class names', function (t) {
  t.equal(insane('<div a="a" b="b" class="foo">foo</div>', {
    allowedTags: ['div'],
    allowedAttributes: { div: ['class'] } },
    true
  ), '<div class="foo">foo</div>');
  t.end();
});

test('drops every class name if not whitelisted', function (t) {
  t.equal(insane('<div a="a" b="b" class="foo bar">foo</div>', {
    allowedTags: ['div'],
    allowedClasses: { div: ['bar'] } },
    true
  ), '<div class="bar">foo</div>');
  t.end();
});

test('ignores whitelist and just allows everything if "class" is an allowed attribute', function (t) {
  t.equal(insane('<div a="a" b="b" class="foo bar">foo</div>', {
    allowedTags: ['div'],
    allowedAttributes: { div: ['class'] },
    allowedClasses: { div: ['bar'] } },
    true
  ), '<div class="foo bar">foo</div>');
  t.end();
});

test('filter turns everything into ignores', function (t) {
  var filter = sinon.spy();
  t.equal(insane('<div a="a" b="b" class="foo bar">foo</div>', {
    filter: filter,
    allowedTags: ['div'] },
    true
  ), '');
  t.end();
});

test('filter works as expected for self-closing tags', function (t) {
  var filter = sinon.spy();
  t.equal(insane('foo <img a="a"/> bar', {
    filter: filter,
    allowedTags: ['div'] },
    true
  ), 'foo  bar');
  t.end();
});

test('calls filter', function (t) {
  var filter = sinon.stub().returns(true);
  t.equal(insane('<div a="a" b="b" class="foo bar">foo</div>', {
    filter: filter,
    allowedTags: ['div'] },
    true
  ), '<div>foo</div>');
  t.equal(filter.callCount, 1);
  t.deepEqual(filter.firstCall.args, [{ attrs: { a: 'a', b: 'b', class: 'foo bar' }, tag: 'div' }]);
  t.end();
});

test('uses filter wisely', function (t) {
  t.equal(insane('<span aria-label="a foo">foo</span><span>bar</span>', {
    allowedTags: ['span'],
    allowedAttributes: { span: ['aria-label'] },
    filter: filter },
    true
  ), '<span aria-label="a foo">foo</span>');
  t.end();

  function filter (token) {
    return !!token.attrs['aria-label'];
  }
});

test('succeeds to read urls that make sense', function (t) {
  t.equal(insane('<a href="#foo">bar</a>'), '<a href="#foo">bar</a>');
  t.equal(insane('<a href="/foo">bar</a>'), '<a href="/foo">bar</a>');
  t.equal(insane('<a href="http://google.com/foo">bar</a>'), '<a href="http://google.com/foo">bar</a>');
  t.equal(insane('<a href="https://google.com/foo">bar</a>'), '<a href="https://google.com/foo">bar</a>');
  t.equal(insane('<a href="mailto:nico@stompflow.com">bar</a>'), '<a href="mailto:nico@stompflow.com">bar</a>');
  t.end();
});

test('fails to read urls that don\'t make sense', function (t) {
  t.equal(insane('<a href="javascript:alert(1)">bar</a>'), '<a>bar</a>');
  t.equal(insane('<a href="magnet:?xt=urn:btih:E6462F43A9B7329961FADA1">bar</a>'), '<a>bar</a>');
  t.end();
});

test('doesn\'t care about quotes', function (t) {
  t.equal(insane('<span>"bar"</span>'), '<span>"bar"</span>');
  t.equal(insane('<span>"bar?"</span>'), '<span>"bar?"</span>');
  t.equal(insane('"bar"'), '"bar"');
  t.equal(insane('"bar?"'), '"bar?"');
  t.end();
});

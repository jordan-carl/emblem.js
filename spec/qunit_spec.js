// Generated by CoffeeScript 1.4.0
var CompilerContext, Emblem, Handlebars, assert, compileWithPartials, equal, equals, ok, shouldCompileTo, shouldCompileToWithPartials, shouldThrow, _equal;

if (!((typeof Handlebars !== "undefined" && Handlebars !== null) && (typeof Emblem !== "undefined" && Emblem !== null))) {
  Emblem = require('../lib/emblem');
  Handlebars = require('handlebars');
  assert = require("assert");
  equal = assert.equal;
  equals = assert.equal;
  ok = assert.ok;
} else {
  _equal = equal;
  equals = equal = function(a, b, msg) {
    return _equal(a, b, msg || '');
  };
}

if (typeof CompilerContext === "undefined" || CompilerContext === null) {
  CompilerContext = {
    compile: function(template, options) {
      var templateSpec;
      templateSpec = Emblem.precompile(template, options);
      return Handlebars.template(eval("(" + templateSpec + ")"));
    }
  };
}

shouldCompileTo = function(string, hashOrArray, expected, message) {
  if (hashOrArray.constructor === String) {
    return shouldCompileToWithPartials(string, {}, false, hashOrArray, message);
  } else {
    return shouldCompileToWithPartials(string, hashOrArray, false, expected, message);
  }
};

shouldCompileToWithPartials = function(string, hashOrArray, partials, expected, message) {
  var result;
  result = compileWithPartials(string, hashOrArray, partials);
  return equal(result, expected, "'" + expected + "' should === '" + result + "': " + message);
};

compileWithPartials = function(string, hashOrArray, partials) {
  var ary, helpers, prop, template;
  template = CompilerContext.compile(string);
  if (Object.prototype.toString.call(hashOrArray) === "[object Array]") {
    if (helpers = hashOrArray[1]) {
      for (prop in Handlebars.helpers) {
        helpers[prop] = helpers[prop] || Handlebars.helpers[prop];
      }
    }
    ary = [];
    ary.push(hashOrArray[0]);
    ary.push({
      helpers: hashOrArray[1],
      partials: hashOrArray[2]
    });
  } else {
    ary = [hashOrArray];
  }
  return template.apply(this, ary);
};

shouldThrow = function(fn, exception, message) {
  var caught, exMessage, exType;
  caught = false;
  if (exception instanceof Array) {
    exType = exception[0];
    exMessage = exception[1];
  } else if (typeof exception === 'string') {
    exType = Error;
    exMessage = exception;
  } else {
    exType = exception;
  }
  try {
    fn();
  } catch (e) {
    if (e instanceof exType) {
      if (!exMessage || e.message === exMessage) {
        caught = true;
      }
    }
  }
  return ok(caught, message || null);
};

suite("html one-liners");

test("element only", function() {
  return shouldCompileTo("p", "<p></p>");
});

test("with text", function() {
  return shouldCompileTo("p Hello", "<p>Hello</p>");
});

test("with more complex text", function() {
  return shouldCompileTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>");
});

test("with trailing space", function() {
  return shouldCompileTo("p Hello   ", "<p>Hello   </p>");
});

suite("text lines");

test("basic", function() {
  return shouldCompileTo("| What what", "What what");
});

test("with html", function() {
  return shouldCompileTo('| What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>!');
});

suite("preprocessor");

test("it strips out preceding whitespace", function() {
  var emblem;
  emblem = "\np Hello";
  return shouldCompileTo(emblem, "<p>Hello</p>");
});

test("it handles preceding indentation", function() {
  var emblem;
  emblem = "  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines", function() {
  var emblem;
  emblem = "\n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines pt 2", function() {
  var emblem;
  emblem = "  \n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it strips out single line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments without text on the first line", function() {
  var emblem;
  emblem = "p Hello\n\n/ \n  A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

suite("html more complex");

test("multiple lines", function() {
  var emblem;
  emblem = "p Hello\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});
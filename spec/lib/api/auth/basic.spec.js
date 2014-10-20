'use strict'

var basic = source('api/auth/basic');

var MockRequest = require('../../../support/mock_request'),
    MockResponse = require('../../../support/mock_response');

describe("Basic Auth", function() {
  var opts = { user: 'user', pass: 'pass' },
      req,
      res,
      next;

  basic = basic(opts);

  beforeEach(function() {
    req = new MockRequest();
    res = new MockResponse();
    next = spy();

    var auth = new Buffer("user:pass", "utf8").toString('base64');
    req.headers = { authorization: "Basic " + auth };
  });

  var checkUnauthorized = function() {
    var result;

    beforeEach(function() {
      result = basic(req, res, next);
    });

    it("returns false", function() {
      expect(result).to.be.falsy;
    });

    it("sends a 401 error", function() {
      expect(res.statusCode).to.be.eql(401);
      expect(res.end).to.be.calledWith("Unauthorized");
    });
  };

  var checkError = function() {
    var result;

    beforeEach(function() {
      result = basic(req, res, next);
    });

    it("triggers next with an error", function() {
      expect(next).to.be.called;
    });
  };

  context("with a valid request", function() {
    var result;

    beforeEach(function() {
      result = basic(req, res, next);
    });

    it("returns true", function() {
      expect(result).to.be.truthy;
    });

    it("doesn't modify the response", function() {
      expect(res.end).to.not.be.called;
    })
  });

  context("if the user/pass don't match", function() {
    beforeEach(function() {
      var auth = new Buffer("bad:wrong", "utf8").toString('base64');
      req.headers = { authorization: "Basic " + auth };
    });

    checkUnauthorized();
  });

  context("if there is already an authorized user", function() {
    var result;

    beforeEach(function() {
      req.user = 'user';
      result = basic(req, res, next);
    });

    it("returns true", function() {
      expect(result).to.be.truthy;
    });

    it("doesn't modify the response", function() {
      expect(res.end).to.not.be.called;
    })
  });

  context("if there are no authorization headers", function() {
    beforeEach(function() {
      delete req.headers.authorization;
    });

    checkUnauthorized();
  });

  context("the authorization type isn't Basic", function() {
    beforeEach(function() {
      var auth = new Buffer("user:pass", "utf8").toString('base64');
      req.headers = { authorization: "Digest " + auth };
    });

    checkError();
  });

  context("the authorization header is missing content", function() {
    beforeEach(function() {
      req.headers = { authorization: "Basic" };
    });

    checkError();
  });

  context("if the authorization header isn't formatted correctly", function() {
    beforeEach(function() {
      var auth = new Buffer("user-pass", "utf8").toString('base64');
      req.headers = { authorization: "Basic " + auth };
    });

    checkUnauthorized();
  });
});

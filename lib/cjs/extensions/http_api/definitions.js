"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var definitions_exports = {};
__export(definitions_exports, {
  install: () => install
});
module.exports = __toCommonJS(definitions_exports);
var import_cucumber = require("@cucumber/cucumber");
var import_node_util = require("node:util");
var import_chai = require("chai");
var import_http = require("http");
var Cast = __toESM(require("../../core/cast.js"), 1);
var import_assertions = require("../../core/assertions.js");
var import_utils = require("./utils.js");
var import_utils2 = require("../../utils/index.js");
const STATUS_MESSAGES = Object.values(import_http.STATUS_CODES).map((code) => code ? code.toLowerCase() : void 0).filter((code) => !!code);
const mustGetResponse = (client) => {
  const response = client.getResponse();
  (0, import_chai.expect)(response, "No response available").to.not.be.empty;
  return response;
};
const install = ({ baseUrl = "" } = {}) => {
  (0, import_cucumber.Given)(/^(?:I )?set request headers$/, function(step) {
    this.httpApiClient.setHeaders(Cast.object(this.state.populateObject(step.rowsHash())));
  });
  (0, import_cucumber.Given)(/^(?:I )?do not follow redirect$/, function() {
    this.httpApiClient.setFollowRedirect(false);
  });
  (0, import_cucumber.Given)(/^(?:I )?follow redirect$/, function() {
    this.httpApiClient.setFollowRedirect(true);
  });
  (0, import_cucumber.Given)(/^(?:I )?assign request headers$/, function(step) {
    const headers = Cast.object(this.state.populateObject(step.rowsHash()));
    Object.entries(headers).forEach(([key, value]) => {
      this.httpApiClient.setHeader(key, value);
    });
  });
  (0, import_cucumber.Given)(/^(?:I )?set ([a-zA-Z0-9-_]+) request header to (.+)$/, function(key, value) {
    this.httpApiClient.setHeader(key, Cast.getCastedValue(this.state.populate(value)));
  });
  (0, import_cucumber.Given)(/^(?:I )?clear request headers/, function() {
    this.httpApiClient.clearHeaders();
  });
  (0, import_cucumber.Given)(/^(?:I )?set request json body$/, function(step) {
    this.httpApiClient.setJsonBody(Cast.object(this.state.populateObject(step.rowsHash())));
  });
  (0, import_cucumber.Given)(/^(?:I )?set request json body from (.+)$/, function(fixture) {
    return this.fixtures.load(fixture).then((data) => {
      this.httpApiClient.setJsonBody(data);
    });
  });
  (0, import_cucumber.Given)(/^(?:I )?set request form body$/, function(step) {
    this.httpApiClient.setFormBody(Cast.object(this.state.populateObject(step.rowsHash())));
  });
  (0, import_cucumber.Given)(/^(?:I )?set request form body from (.+)$/, function(fixture) {
    return this.fixtures.load(fixture).then((data) => {
      this.httpApiClient.setFormBody(data);
    });
  });
  (0, import_cucumber.Given)(/^(?:I )?set request multipart body from (.+)$/, function(fixture) {
    return this.fixtures.load(fixture).then((data) => {
      this.httpApiClient.setMultipartBody(data);
    });
  });
  (0, import_cucumber.Given)(/^(?:I )?clear request body$/, function() {
    this.httpApiClient.clearBody();
  });
  (0, import_cucumber.Given)(/^(?:I )?set request query$/, function(step) {
    this.httpApiClient.setQuery(Cast.object(this.state.populateObject(step.rowsHash())));
  });
  (0, import_cucumber.Given)(/^(?:I )?pick response (json|header) (.+) as (.+)$/, function(dataSource, path, key) {
    const response = this.httpApiClient.getResponse();
    let data = dataSource !== "header" ? response.body : response.headers;
    this.state.set(key, (0, import_utils2.getValue)(data, path));
  });
  (0, import_cucumber.Given)(
    /^(?:I )?replace(?: placeholder)? (.+) in (.+) to ([^\s]+)(?: with regex options? (.+)?)?$/,
    function(search, key, replaceValue, option) {
      let newValue = this.state.get(key).replace(new RegExp(search, option || void 0), replaceValue);
      this.state.set(key, newValue);
    }
  );
  (0, import_cucumber.Given)(/^(?:I )?enable cookies$/, function() {
    this.httpApiClient.enableCookies();
  });
  (0, import_cucumber.Given)(/^(?:I )?disable cookies$/, function() {
    this.httpApiClient.disableCookies();
  });
  (0, import_cucumber.Given)(/^(?:I )?set cookie from (.+)$/, function(fixture) {
    return this.fixtures.load(fixture).then((cookie) => {
      this.httpApiClient.setCookie(cookie);
    });
  });
  (0, import_cucumber.Given)(/^(?:I )?clear request cookies$/, function() {
    this.httpApiClient.clearRequestCookies();
  });
  (0, import_cucumber.When)(/^(?:I )?reset http client$/, function() {
    this.httpApiClient.reset();
  });
  (0, import_cucumber.When)(/^(?:I )?(GET|POST|PUT|DELETE|PATCH) (.+)$/, function(method, path) {
    return this.httpApiClient.makeRequest(method, this.state.populate(path), baseUrl);
  });
  (0, import_cucumber.When)(/^(?:I )?dump response body$/, function() {
    const response = mustGetResponse(this.httpApiClient);
    console.log((0, import_node_util.inspect)(response.body, { colors: true, depth: null }));
  });
  (0, import_cucumber.When)(/^(?:I )?dump response headers$/, function() {
    const response = mustGetResponse(this.httpApiClient);
    console.log(response.headers);
  });
  (0, import_cucumber.When)(/^(?:I )?dump response cookies$/, function() {
    mustGetResponse(this.httpApiClient);
    console.log(this.httpApiClient.getCookies());
  });
  (0, import_cucumber.Then)(/^response status code should be ([1-5][0-9][0-9])$/, function(statusCode) {
    const response = mustGetResponse(this.httpApiClient);
    (0, import_chai.expect)(
      response.statusCode,
      `Expected status code to be: ${statusCode}, but found: ${response.statusCode}`
    ).to.equal(Number(statusCode));
  });
  (0, import_cucumber.Then)(/^response status should be (.+)$/, function(statusMessage) {
    if (!STATUS_MESSAGES.includes(statusMessage.toLowerCase())) {
      throw new TypeError(`'${statusMessage}' is not a valid status message`);
    }
    const response = mustGetResponse(this.httpApiClient);
    const statusCode = (0, import_utils2.findKey)(import_http.STATUS_CODES, (msg) => msg.toLowerCase() === statusMessage);
    const currentStatusMessage = import_http.STATUS_CODES[`${response.statusCode}`] || response.statusCode;
    (0, import_chai.expect)(
      response.statusCode,
      `Expected status to be: '${statusMessage}', but found: '${currentStatusMessage.toLowerCase()}'`
    ).to.equal(Number(statusCode));
  });
  (0, import_cucumber.Then)(/^response should (not )?have an? (.+) cookie$/, function(flag, key) {
    const cookie = this.httpApiClient.getCookie(key);
    if (flag == void 0) {
      (0, import_chai.expect)(cookie, `No cookie found for key '${key}'`).to.not.be.null;
    } else {
      (0, import_chai.expect)(cookie, `A cookie exists for key '${key}'`).to.be.null;
    }
  });
  (0, import_cucumber.Then)(/^response (.+) cookie should (not )?be secure$/, function(key, flag) {
    const cookie = this.httpApiClient.getCookie(key);
    (0, import_chai.expect)(cookie, `No cookie found for key '${key}'`).to.not.be.null;
    if (flag == void 0) {
      (0, import_chai.expect)(cookie.secure, `Cookie '${key}' is not secure`).to.be.true;
    } else {
      (0, import_chai.expect)(cookie.secure, `Cookie '${key}' is secure`).to.be.false;
    }
  });
  (0, import_cucumber.Then)(/^response (.+) cookie should (not )?be http only$/, function(key, flag) {
    const cookie = this.httpApiClient.getCookie(key);
    (0, import_chai.expect)(cookie, `No cookie found for key '${key}'`).to.not.be.null;
    if (flag == void 0) {
      (0, import_chai.expect)(cookie.httpOnly, `Cookie '${key}' is not http only`).to.be.true;
    } else {
      (0, import_chai.expect)(cookie.httpOnly, `Cookie '${key}' is http only`).to.be.false;
    }
  });
  (0, import_cucumber.Then)(/^response (.+) cookie domain should (not )?be (.+)$/, function(key, flag, domain) {
    const cookie = this.httpApiClient.getCookie(key);
    (0, import_chai.expect)(cookie, `No cookie found for key '${key}'`).to.not.be.null;
    if (flag == void 0) {
      (0, import_chai.expect)(
        cookie.domain,
        `Expected cookie '${key}' domain to be '${domain}', found '${cookie.domain}'`
      ).to.equal(domain);
    } else {
      (0, import_chai.expect)(cookie.domain, `Cookie '${key}' domain is '${domain}'`).to.not.equal(domain);
    }
  });
  (0, import_cucumber.Then)(/^(?:I )?json response should (fully )?match$/, function(fully, table) {
    const response = mustGetResponse(this.httpApiClient);
    const { body } = response;
    (0, import_chai.expect)(response.headers["content-type"]).to.contain("application/json");
    const specifications = table.hashes().map((fieldSpec) => {
      const spec = fieldSpec.expression ? (0, import_utils.parseMatchExpression)(fieldSpec.expression) : fieldSpec;
      return {
        ...spec,
        value: this.state.populate(spec.value)
      };
    });
    (0, import_assertions.assertObjectMatchSpec)(body, specifications, !!fully);
  });
  (0, import_cucumber.Then)(
    /^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/,
    function(size, path) {
      const response = mustGetResponse(this.httpApiClient);
      const { body } = response;
      const array = path != void 0 ? (0, import_utils2.getValue)(body, path) : body;
      (0, import_chai.expect)(array.length).to.be.equal(Number(size));
    }
  );
  (0, import_cucumber.Then)(/^response should match fixture (.+)$/, function(fixtureId) {
    const response = mustGetResponse(this.httpApiClient);
    return this.fixtures.load(fixtureId).then((snapshot) => {
      (0, import_chai.expect)(response.body).to.deep.equal(snapshot);
    });
  });
  (0, import_cucumber.Then)(
    /^response header (.+) should (not )?(equal|contain|match) (.+)$/,
    function(key, flag, comparator, expectedValue) {
      const response = mustGetResponse(this.httpApiClient);
      const header = response.headers[key.toLowerCase()];
      (0, import_chai.expect)(header, `Header '${key}' does not exist`).to.not.be.undefined;
      let expectFn = (0, import_chai.expect)(
        header,
        `Expected header '${key}' to ${flag ? flag : ""}${comparator} '${expectedValue}', but found '${header}' which does${flag ? "" : " not"}`
      ).to;
      if (flag != void 0) {
        expectFn = expectFn.not;
      }
      expectFn[comparator](comparator === "match" ? new RegExp(expectedValue) : expectedValue);
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});

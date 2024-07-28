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
var assertions_exports = {};
__export(assertions_exports, {
  assertObjectMatchSpec: () => assertObjectMatchSpec,
  countNestedProperties: () => countNestedProperties,
  getMatchingRule: () => getMatchingRule
});
module.exports = __toCommonJS(assertions_exports);
var import_chai = require("chai");
var import_moment_timezone = __toESM(require("moment-timezone"), 1);
var Cast = __toESM(require("./cast.js"), 1);
var import_custom_chai_assertions = require("./custom_chai_assertions.js");
var import_utils = require("../utils/index.js");
(0, import_chai.use)(import_custom_chai_assertions.registerChaiAssertion);
const negationRegex = `!|! |not |does not |doesn't |is not |isn't `;
const matchRegex = new RegExp(`^(${negationRegex})?(match|matches|~=)$`);
const containRegex = new RegExp(`^(${negationRegex})?(contains?|\\*=)$`);
const startWithRegex = new RegExp(`^(${negationRegex})?(starts? with|\\^=)$`);
const endWithRegex = new RegExp(`^(${negationRegex})?(ends? with|\\$=)$`);
const presentRegex = new RegExp(`^(${negationRegex})?(defined|present|\\?)$`);
const equalRegex = new RegExp(`^(${negationRegex})?(equals?|=)$`);
const typeRegex = new RegExp(`^(${negationRegex})?(type|#=)$`);
const relativeDateRegex = new RegExp(`^(${negationRegex})?(equalRelativeDate)$`);
const relativeDateValueRegex = /^(\+?\d|-?\d),([A-Za-z]+),([A-Za-z-]{2,5}),(.+)$/;
const RuleName = Object.freeze({
  Match: Symbol("match"),
  Contain: Symbol("contain"),
  StartWith: Symbol("startWith"),
  EndWith: Symbol("endWith"),
  Present: Symbol("present"),
  Equal: Symbol("equal"),
  Type: Symbol("type"),
  RelativeDate: Symbol("relativeDate")
});
const countNestedProperties = (object) => {
  let propertiesCount = 0;
  Object.keys(object).forEach((key) => {
    if (!(0, import_utils.isEmpty)(object[key]) && typeof object[key] === "object") {
      const count = countNestedProperties(object[key]);
      propertiesCount += count;
    } else {
      propertiesCount++;
    }
  });
  return propertiesCount;
};
const assertObjectMatchSpec = (object, spec, exact = false) => {
  spec.forEach(({ field, matcher, value }) => {
    const currentValue = (0, import_utils.getValue)(object, field);
    const expectedValue = Cast.getCastedValue(value);
    const rule = getMatchingRule(matcher);
    switch (rule.name) {
      case RuleName.Match: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' (${currentValue}) ${rule.isNegated ? "matches" : "does not match"} '${expectedValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.match(new RegExp(expectedValue));
        } else {
          baseExpect.to.match(new RegExp(expectedValue));
        }
        break;
      }
      case RuleName.Contain: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' (${currentValue}) ${rule.isNegated ? "contains" : "does not contain"} '${expectedValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.contain(expectedValue);
        } else {
          baseExpect.to.contain(expectedValue);
        }
        break;
      }
      case RuleName.StartWith: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' (${currentValue}) ${rule.isNegated ? "starts with" : "does not start with"} '${expectedValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.startWith(expectedValue);
        } else {
          baseExpect.to.startWith(expectedValue);
        }
        break;
      }
      case RuleName.EndWith: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' (${currentValue}) ${rule.isNegated ? "ends with" : "does not end with"} '${expectedValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.endWith(expectedValue);
        } else {
          baseExpect.to.endWith(expectedValue);
        }
        break;
      }
      case RuleName.Present: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' is ${rule.isNegated ? "defined" : "undefined"}`
        );
        if (rule.isNegated) {
          baseExpect.to.be.undefined;
        } else {
          baseExpect.to.not.be.undefined;
        }
        break;
      }
      case RuleName.RelativeDate: {
        const match = relativeDateValueRegex.exec(expectedValue);
        if (match === null) throw new Error("relative date arguments are invalid");
        const [, amount, unit, locale, format] = match;
        const normalizedLocale = Intl.getCanonicalLocales(locale)[0];
        const expectedDate = (0, import_moment_timezone.default)().add(amount, unit).locale(normalizedLocale).format(format);
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Expected property '${field}' to ${rule.isNegated ? "not " : ""}equal '${expectedDate}', but found '${currentValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.be.deep.equal(expectedDate);
        } else {
          baseExpect.to.be.deep.equal(expectedDate);
        }
        break;
      }
      case RuleName.Type: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Property '${field}' (${currentValue}) type is${rule.isNegated ? "" : " not"} '${expectedValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.be.a(expectedValue);
        } else {
          baseExpect.to.be.a(expectedValue);
        }
        break;
      }
      case RuleName.Equal: {
        const baseExpect = (0, import_chai.expect)(
          currentValue,
          `Expected property '${field}' to${rule.isNegated ? " not" : ""} equal '${value}', but found '${currentValue}'`
        );
        if (rule.isNegated) {
          baseExpect.to.not.be.deep.equal(expectedValue);
        } else {
          baseExpect.to.be.deep.equal(expectedValue);
        }
        break;
      }
    }
  });
  if (exact === true) {
    const propertiesCount = countNestedProperties(object);
    (0, import_chai.expect)(
      propertiesCount,
      "Expected json response to fully match spec, but it does not"
    ).to.be.equal(spec.length);
  }
};
const getMatchingRule = (matcher) => {
  const matchGroups = matchRegex.exec(matcher);
  if (matchGroups) {
    return { name: RuleName.Match, isNegated: !!matchGroups[1] };
  }
  const containGroups = containRegex.exec(matcher);
  if (containGroups) {
    return { name: RuleName.Contain, isNegated: !!containGroups[1] };
  }
  const startWithGroups = startWithRegex.exec(matcher);
  if (startWithGroups) {
    return { name: RuleName.StartWith, isNegated: !!startWithGroups[1] };
  }
  const endWithGroups = endWithRegex.exec(matcher);
  if (endWithGroups) {
    return { name: RuleName.EndWith, isNegated: !!endWithGroups[1] };
  }
  const presentGroups = presentRegex.exec(matcher);
  if (presentGroups) {
    return { name: RuleName.Present, isNegated: !!presentGroups[1] };
  }
  const equalGroups = equalRegex.exec(matcher);
  if (equalGroups) {
    return { name: RuleName.Equal, isNegated: !!equalGroups[1] };
  }
  const typeGroups = typeRegex.exec(matcher);
  if (typeGroups) {
    return { name: RuleName.Type, isNegated: !!typeGroups[1] };
  }
  const relativeDateGroups = relativeDateRegex.exec(matcher);
  if (relativeDateGroups) {
    return { name: RuleName.RelativeDate, isNegated: !!relativeDateGroups[1] };
  }
  import_chai.expect.fail(`Matcher "${matcher}" did not match any supported assertions`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertObjectMatchSpec,
  countNestedProperties,
  getMatchingRule
});
//# sourceMappingURL=assertions.js.map

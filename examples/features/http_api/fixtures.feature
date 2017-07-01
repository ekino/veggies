@http_api @fixtures
Feature: Using fixtures

  Scenario: Loading .yaml fixture file
    Given I set request json body from yaml_00
    And define http mock from test
    And I set request form body from yaml_00

  Scenario: Loading .yml fixture file
    Given I set request json body from yaml_01
    Given I set request form body from yaml_01

  Scenario: Loading .txt fixture file
    Given I set request json body from text_00
    And I set request json body from text_00

  Scenario: Loading .js fixture file
    Given I set request json body from module_00

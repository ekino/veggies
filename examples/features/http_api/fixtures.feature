@http_api @fixtures
Feature: Using fixtures

  Scenario: Loading .yaml fixture file
    Given I set request json body from yaml_00

  Scenario: Loading .yml fixture file
    Given I set request json body from yaml_01

  Scenario: Loading .txt fixture file
    Given I set request json body from text_00
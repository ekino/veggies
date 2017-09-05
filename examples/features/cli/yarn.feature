@cli @offline
Feature: yarn CLI

  Scenario: Running an invalid command
    When I run command yarn invalid
    Then exit code should be 1
    And stderr should contain Command "invalid" not found.

  Scenario: Getting info about installed yarn version
    When I run command yarn --version
    Then exit code should be 0
    And stdout should match ^[0-9]{1}.[0-9]{1,3}.[0-9]{1,3}
    And stderr should be empty

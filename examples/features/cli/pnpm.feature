@cli @offline
Feature: Pnpm CLI

  Scenario: Running an invalid command
    When I run command node -z
    Then exit code should be 9
    And stderr should contain node: bad option: -z

  Scenario: Getting info about installed yarn version
    When I run command pnpm --version
    Then exit code should be 0
    And stdout should match ^[0-9]{1}.[0-9]{1,3}.[0-9]{1,3}
    And stderr should be empty

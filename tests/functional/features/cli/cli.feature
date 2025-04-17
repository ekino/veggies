@cli
Feature: All basic step definitions for CLI

    Scenario: Set working directory
        When I set working directory to tests/functional/features/cli
        And I run command pwd
        Then exit code should be 0
        And stdout should contain tests/functional/features/cli
        When I set cwd to tests/unit
        And I run command pwd
        And stdout should contain tests/unit

    Scenario: Set environment
        When I set Accept environment variable to "application/json"
        When I set userId env var to 1234
        When I run command printenv Accept
        And stdout should contain "application/json"
        And I run command printenv userId
        And stdout should contain 1234
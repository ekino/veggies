@cleanSnapshots
Feature: Dummy test for --cleanSnapshots

    Scenario: Should echo salut
        When I run command echo salut
        Then exit code should be 0
        And stdout output should match snapshot

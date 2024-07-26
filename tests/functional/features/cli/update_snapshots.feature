@updateSnapshots
Feature: Dummy test for --updateSnapshots

    @long
    Scenario: Should echo salut1
        When I run command echo salut1
        Then exit code should be 0
        And stdout output should match snapshot

    @short
    Scenario: Should echo salut2
        When I run command echo salut2
        Then exit code should be 0
        And stdout output should match snapshot

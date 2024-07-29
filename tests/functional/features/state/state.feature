@state
Feature: All basic step definitions for state

    Scenario: Set state
        When I set state URLPage variable to "https://fake.io/users"
        And I dump state
        And I clear state
        And I dump state
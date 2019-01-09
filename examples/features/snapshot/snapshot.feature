@snapshot
Feature: Using snapshot definitions

    Scenario: Snapshot testing on an api
        Given I mock http call to forward request body for path /users/yaml
        And set request json body from file
        When I POST http://fake.io/users/yaml
        Then response body should match snapshot

    Scenario: Snapshot testing on cli
        When I run command echo test
        Then exit code should be 0
        And stdout output should match snapshot

    Scenario: Snapshot testing on files
        Given I set cwd to examples/features/snapshot/fixtures
        Then file file.yaml should match snapshot

    Scenario: Snapshot testing on a json api
        Given I mock http call to forward request body for path /users/yaml
        And set request json body from file
        When I POST http://fake.io/users/yaml
        Then response json body should match snapshot
            | field           | matcher | value    |
            | gender          | type    | string   |

    Scenario: Snapshot testing on a cli with json output
        When I run command echo {"gender": "male", "name": "john"}
        Then exit code should be 0
        And stdout json output should match snapshot
            | field           | matcher | value    |
            | gender          | equal   | male     |

    Scenario: Snapshot testing on a json file
        Given I set cwd to examples/features/snapshot/fixtures
        Then json file file2.json content should match snapshot
            | field           | matcher | value      |
            | gender          | type    | string     |
            | id              | type    | number     |

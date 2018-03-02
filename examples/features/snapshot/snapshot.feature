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

    Scenario Outline: I get all posts filtered using '<filter>=<value>' directive
        Given I mock http call to forward request body for path /users/yaml
        When I POST http://fake.io/users/yaml
        Then response status code should be 200
        And response body should match snapshot

        Examples:
            | filter       | value          |

            | title        | car industry   |

            | anotherTitle | antother value |
            # this comment and the empty lines above and below shouldn't be taken into account


            | tester       | tesfdkngjsfk   |
    Scenario: Snapshot testing on files
        Given I set cwd to examples/features/snapshot/fixtures
        Then file file.yaml should match snapshot

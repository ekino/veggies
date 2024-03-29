Feature: Validate the usage of the Veggies CLI

    Scenario: Should prevent snapshots creation
        When I run command yarn veggies --require tests/cli/support tests/cli/dummy_features --tags @preventSnapshotsCreation --preventSnapshotsCreation
        Then exit code should be 1
        And stdout should contain Error: The snapshot does not exist and won't be created.

    Scenario: Should clean snapshots
        When I run command yarn veggies --require tests/cli/support tests/cli/dummy_features --tags @cleanSnapshots --cleanSnapshots
        Then exit code should be 0
        And stdout should contain Snapshots:   1 removed, 1 total

    Scenario: Should update snapshots (long option)
        When I run command yarn veggies --require tests/cli/support tests/cli/dummy_features --tags @updateSnapshots --tags @long --updateSnapshots
        Then exit code should be 0
        And stdout should contain Snapshots:   1 updated, 1 total

    Scenario: Should update snapshots (short option)
        When I run command yarn veggies --require tests/cli/support tests/cli/dummy_features --tags @updateSnapshots --tags @short -u
        Then exit code should be 0
        And stdout should contain Snapshots:   1 updated, 1 total

    Scenario: Should print help message
        When I run command yarn veggies --help
        Then exit code should be 0
        And stdout should contain veggies help
        And stdout should contain Options:
        And stdout should contain --cleanSnapshots            removes unused snapshots (not recommended while matching tags)
        And stdout should contain -u, --updateSnapshots       updates current snapshots if required
        And stdout should contain --preventSnapshotsCreation  a snapshot related step that would create one will fail instead (useful on CI environment)
        And stdout should contain For more details please visit https://github.com/ekino/veggies/blob/master/README.md
        And stdout should contain cucumber-js help

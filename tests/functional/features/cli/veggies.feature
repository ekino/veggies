Feature: Validate the usage of the Veggies CLI
    
    Scenario: Should prevent snapshots creation
        When I run command yarn veggies --import tests/functional/support tests/functional/features/cli --tags @preventSnapshotsCreation --preventSnapshotsCreation
        Then exit code should be 0

    Scenario: Should clean snapshots
        When I run command yarn veggies --import tests/functional/support tests/functional/features/cli --tags @cleanSnapshots --cleanSnapshots
        Then exit code should be 0
        
    Scenario: Should update snapshots (long option)
        When I run command yarn veggies --import tests/functional/support tests/functional/features/cli --tags @updateSnapshots --tags @long --updateSnapshots
        Then exit code should be 0
        And stdout should contain updated

    Scenario: Should update snapshots (short option)
        When I run command yarn veggies --import tests/functional/support tests/functional/features/cli --tags @updateSnapshots --tags @short -u
        Then exit code should be 0
        And stdout should match updated

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

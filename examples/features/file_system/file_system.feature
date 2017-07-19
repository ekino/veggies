@file_system @offline
Feature: File system extension

  Scenario: Checking file content equals something
    Given I set cwd to examples/features/file_system/files
    Then file test_dir/content.txt content should equal content.txt content

  Scenario: Checking file content does not equal something
    Given I set cwd to examples/features/file_system/files
    Then file test_dir/content.txt content should not equal crap

  Scenario: Checking file contains something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should contain "testing": "for sure!"

  Scenario: Checking file does not contains something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should not contain does not contain

  Scenario: Checking file content matches something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should match "testing": "for .*\!"

  Scenario: Checking file content does not match something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should not match "testing": "for .*\?"

  Scenario: Checking file exists
    Given I set cwd to examples/features/file_system/files
    Then file test.json should exist

  Scenario: Checking file does not exist
    Given I set cwd to examples/features/file_system/files
    Then file crap.json should not exist

  Scenario: Checking directory exists
    Given I set cwd to examples/features/file_system/files
    Then directory test_dir should exist

  Scenario: Checking directory does not exist
    Given I set cwd to examples/features/file_system/files
    Then directory crap_dir should not exist

  Scenario: Creating a directory
    Given I set cwd to examples/features/file_system/files
    And I create directory generated
    Then directory generated should exist

  Scenario: Creating nested directory
    Given I set cwd to examples/features/file_system/files
    And I create directory deeply/nested/directory
    Then directory deeply/nested/directory should exist

  Scenario: Creating and removing directory
    Given I set cwd to examples/features/file_system/files
    And I create directory deeply/nested/directory
    Then directory deeply/nested/directory should exist
    Given I remove directory deeply/nested/directory
    Then directory deeply/nested/directory should not exist
@file_system @offline
Feature: File system extension

  Scenario: Checking file contains something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should contain "testing": "for sure!"

  Scenario: Checking file does not contains something
    Given I set cwd to examples/features/file_system/files
    Then file test.json content should not contain does not contain
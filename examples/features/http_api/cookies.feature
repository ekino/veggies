@http_api @cookies
Feature: GitHub API

  Scenario: Using GitHub API
    Given enable cookies
    When I GET https://twitter.com/
    Then I should receive a 200 HTTP status code
    And response should have a guest_id cookie
    And response guest_id cookie should not be secure
    And response guest_id cookie should not be http only
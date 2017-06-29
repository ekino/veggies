@http_api
Feature: GitHub API

  Scenario: Using GitHub API
    Given I set User-Agent request header to veggies/1.0
    When I GET https://api.github.com/
    Then I should receive a 200 HTTP status code
    When I pick response json emojis_url as emojisUrl
    And I GET {{emojisUrl}}
    Then I should receive a 200 HTTP status code

  Scenario Outline: Fetching <key> API endpoint from root endpoint
    Given I set User-Agent request header to veggies/1.0
    When I GET https://api.github.com/
    Then I should receive a 200 HTTP status code
    When I pick response json <key> as <key>
    And I GET {{<key>}}
    Then I should receive a 200 HTTP status code

    Examples:
      | key              |
      | emojis_url       |
      | feeds_url        |
      | public_gists_url |
@http_api
Feature: GitHub API

  Scenario: Using GitHub API
    Given I set User-Agent request header to veggies/1.0
    When I GET https://api.github.com/
    Then response status code should be 200
    When I pick response json emojis_url as emojisUrl
    And I GET {{emojisUrl}}
    Then response status code should be 200

  Scenario Outline: Fetching <key> API endpoint from root endpoint
    Given I set User-Agent request header to veggies/1.0
    When I GET https://api.github.com/
    Then response status code should be 200
    When I pick response json <key> as <key>
    And I GET {{<key>}}
    Then response status code should be 200

    Examples:
      | key              |
      | emojis_url       |
      | feeds_url        |
      | public_gists_url |
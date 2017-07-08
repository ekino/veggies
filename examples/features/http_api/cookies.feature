@http_api @cookies
Feature: Using cookies

  Scenario: Visiting twitter home
    Given enable cookies
    When I GET https://twitter.com/
    Then response status should be ok
    And response should have a guest_id cookie
    And response guest_id cookie should not be secure
    And response guest_id cookie should not be http only

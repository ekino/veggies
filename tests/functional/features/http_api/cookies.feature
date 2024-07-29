@http_api @cookies
Feature: Using cookies

  Scenario: Visiting x home
    Given enable cookies
    When I GET https://x.com/
    Then response status should be ok
    And response should have a guest_id cookie
    And response guest_id cookie should be secure
    And response guest_id cookie should not be http only
    And response guest_id cookie domain should be x.com

    Scenario: Visiting x home without cookies
        Given disable cookies
        When I GET https://x.com/
        Then response status should be ok
        And response should not have a guest_id cookie
        And I clear request cookies
        And I set cookie from cookies
       


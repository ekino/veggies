@http_api @cookies
Feature: GitHub API

#  Scenario: Using GitHub API
#    Given enable cookies
#    When I GET https://twitter.com/
#    Then I should receive a 200 HTTP status code
#    And response should have a guest_id cookie
#    And response guest_id cookie should not be secure
#    And response guest_id cookie should not be http only

  Scenario: test
    Given I enable cookies
    And set request headers
      | Content-Type | application/x-www-form-urlencoded; charset=utf-8 |
      | Accept       | application/json                                 |
    And I set request form body
      | grant_type                | whatever |
      | google_authorization_code | whatever |
      | client_id                 | whatever |
    When I POST http://localhost:8070/api/v1/proxy/auth
    And I dump response body
    Given I clear request body
    Then response status should be ok
    When I GET http://localhost:8070/api/v1/proxy/verify
    And I dump response body
    Then response status should be ok
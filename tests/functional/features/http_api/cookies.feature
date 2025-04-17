@http_api @cookies
Feature: Using cookies

  Scenario: Visit Wikipedia API with cookies
    Given enable cookies
    When I GET https://en.wikipedia.org/w/api.php
    Then response status should be ok
    And response should have a WMF-Last-Access cookie
    And response WMF-Last-Access cookie should be secure
    And response WMF-Last-Access cookie domain should be en.wikipedia.org

  Scenario: Visit Wikipedia without cookies
    Given disable cookies
    When I GET https://en.wikipedia.org/w/api.php
    Then response status should be ok
    And response should not have a WMF-Last-Access cookie


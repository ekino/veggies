@http_api
Feature: Using fixtures with http API extension

    @yaml
    Scenario: Setting json body from .yaml fixture file
        Given I mock http call to forward request body for path /users/yaml
        And set request json body from yaml_00
        When I POST https://fake.io/users/yaml
        Then response status code should be 200
        And response status should be ok
        And response body should match snapshot

    @yaml
    Scenario: Setting form body from .yaml fixture file
        Given I mock http call to forward request body for path /users/yaml
        And set request form body from yaml_00
        When I POST https://fake.io/users/yaml
        Then response status code should be 200


    Scenario: Setting form body directly
        Given I mock http call to forward request body for path /users/yaml
        And set request form body
            | id         | 1       |
            | first_name | Raphaël |
            | last_name  | Benitte |
            | gender     | male    |
        When I POST https://fake.io/users/yaml
        Then response status code should be 200

    @yaml
    Scenario: Setting json body from .yml fixture file
        Given I mock http call to forward request body for path /users/yml
        And set request json body from yaml_01
        When I POST https://fake.io/users/yml
        Then response status code should be 200

    @yaml
    Scenario: Setting form body from .yml fixture file
        Given I mock http call to forward request body for path /users/yml
        And set request form body from yaml_01
        When I POST https://fake.io/users/yml
        Then response status code should be 200
        And response should match fixture check

    @text
    Scenario: Setting json body from .txt fixture file
        Given I mock http call to forward request body for path /users/txt
        And set request json body from text_00
        When I POST https://fake.io/users/txt
        Then response status code should be 200

    @text
    Scenario: Setting form body from .txt fixture file
        Given I mock http call to forward request body for path /users/txt
        And set request form body from text_00
        When I POST https://fake.io/users/txt
        Then response status code should be 200

    @js
    Scenario: Setting json body from .js fixture file
        Given I mock http call to forward request body for path /users/js
        And set request json body from module_00
        When I POST https://fake.io/users/js
        Then response status code should be 200

    @js
    Scenario: Setting form body from .js fixture file
        Given I mock http call to forward request body for path /users/js
        And set request form body from module_00
        When I POST https://fake.io/users/js
        Then response status code should be 200

    @json
    Scenario: Setting json body from .json fixture file
        Given I mock http call to forward request body for path /users/json
        And set request json body from json_00
        When I POST https://fake.io/users/json
        Then response status code should be 200
        And json response should fully match
            | field       | matcher | value             |
            | data        | equal   | fixture from JSON |
            | testing     | equal   | true((boolean))   |
            | awesomeness | equal   | 100((number))     |

    Scenario: Setting json body directly
        Given I mock http call to forward request body for path /users/json
        And set request json body
            | id         | 1       |
            | first_name | Raphaël |
            | last_name  | Benitte |
            | gender     | male    |
        When I POST https://fake.io/users/json
        Then response status code should be 200
        Then response body should match snapshot

    @json
    Scenario: Setting form body from .json fixture file
        Given I mock http call to forward request body for path /users/json
        And set request form body from json_00
        When I POST https://fake.io/users/json
        Then response status code should be 200

    @json @header
    Scenario: Setting json body from .json fixture file
        Given I mock http call to forward request body for path /users
        And set request json body from json_00
        And I set request headers
            | key             | value            |
            | content-type    | application/json |
            | accept-language | fr               |
            | User-Agent      | veggies/2.0      |
        When I POST https://fake.io/users
        Then response status code should be 200
        And I pick response header location as location
        And I clear request body
        And I clear request headers
        Given I assign request headers
            | params          | value |
            | accept-language | en    |
        And I set User-Agent request header to veggies/2.1
        And I mock GET http call to forward request body for path /users/1
        And I GET {{location}}
        Then response status code should be 200

    Scenario: Setting request query
        Given I mock http call to forward request body for path /users/json?query=1
        And set request form body from json_00
        And I set request query
            | query | 1 |
        When I POST https://fake.io/users/json
        Then response status code should be 200

    Scenario: Get posts from http_api/fixtures/posts.json
        Given I mock GET http call from http_api/fixtures/posts.json to forward request json body for path /posts
        When I GET http://mysite.com/api/v1/posts
        Then response status code should be 200
        And response header Connection should equal keep-alive
        And response body should match snapshot
        And I should receive a collection of 32 items for path posts

    Scenario: Follow redirect
        Given I mock GET http call from http_api/fixtures/redirect.json to forward request json body for path /posts?redirect=true
        Given I do not follow redirect
        When I GET http://mysite.com/api/v1/posts?redirect=true
        Then response status code should be 301
        And I pick response json redirect.url as url
        And I GET {{url}}
        Then response status code should be 301

    Scenario: I can create a new post from json file
        Given I mock POST http call to forward request json body for path /posts
        And set request json body from create_post
        When I POST http://mysite.com/api/v1/posts
        Then response status code should be 200
        And response json body should match snapshot
            | field       | matcher | value        |
            | post.userId | equal   | 10((number)) |
            | post.id     | equals  | 1((number))  |

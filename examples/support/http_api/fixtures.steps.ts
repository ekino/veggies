import { Given } from "@cucumber/cucumber"
import nock from "nock"

Given(
    /^I mock http call to forward request body for path (.+)$/,
    function (path) {
        nock("http://fake.io")
            .post(path)
            .reply(200, (uri, requestBody) => requestBody)
    }
)

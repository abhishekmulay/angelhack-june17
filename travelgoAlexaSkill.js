/**
 * Created by abhishek on 6/17/17.
 */
var https = require('https');

exports.handler = (event, context) => {

    try {

        if (event.session.new) {
            console.log("New Session");
        }

        switch (event.request.type) {
            case "LaunchRequest":
                console.log("LAUNCH REQUEST");
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to Travelgo Alexa Skill", true),
                        {}
                    )
                )
                break;

            case "IntentRequest":
                console.log("INTENT REQUEST");
                switch (event.request.intent.name) {
                    case "getFlightsLeavingFrom":
                        var endpoint = getSampleRequest();
                        var body = ""
                        https.get(endpoint, (response) => {
                            response.on('data', (chunk) => {
                                body += chunk
                            })
                            response.on('end', () => {
                                var data = JSON.parse(body)
                                var numberOfFlights = data.results.length;
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(`Number of Flights found ${numberOfFlights}`, true),
                                        {}
                                    )
                                )
                            })
                        })
                }

                break;

            case "SessionEndedRequest":
                console.log("SESSION ENDED REQUEST");
                break;

            default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)
        }

    } catch (error) {
        context.fail(`Exception: ${error}`)
    }
}

/////////////////////////

buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }

}

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

}


function getSampleRequest() {
    var FLIGHT_ENDPOINT = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search";
    var API_KEY = "?apikey=" + "2Xki9s14ZR3GxGPnxtYT23IUkDWNyNQP";
    var params = "&origin=BOS&one-way=true&max_price=800";
    return FLIGHT_ENDPOINT + API_KEY + params;
}

function getInspirationRequest(origin,price){
    var FLIGHT_ENDPOINT = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search";
    var API_KEY = "?apikey=" + "2Xki9s14ZR3GxGPnxtYT23IUkDWNyNQP";
    var params = "&origin="+ origin +"&one-way=true&max_price="+ price;
    return FLIGHT_ENDPOINT + API_KEY + params;

}

function getLowFareSearch(origin,destination,departureDate,numOfResults){
    var FLIGHT_ENDPOINT = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search";
    var API_KEY = "?apikey=" + "2Xki9s14ZR3GxGPnxtYT23IUkDWNyNQP";
    var params = "&origin="+origin+"&destination="+destination+"&departure_date="+departureDate+"&number_of_results=" + numOfResults;
    return FLIGHT_ENDPOINT + API_KEY + params;

}

function postSMS(body, toNumber){

    var accountSid = 'ACd616e4df368fe04b619acdb9a3766d0f';
    var authToken = '7783759da9c50a5e97bd4ca9798ef059';

    //require the Twilio module and create a REST client
    var client = require('twilio')(accountSid, authToken);

    client.messages.create({
        to: toNumber,
        from: "+18572069138",
        body: body,
    }, function(err, message) {
        console.log(message.sid);
    });


}

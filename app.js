//noinspection JSUnresolvedFunction
/**
 * Created by abhishek on 6/17/17.
 */

var alexa = require('alexa-app');

var app = new alexa.app('travelgo');

app.launch(function(req, res) {
    res.say('Hello AngelHack Boston');
});

module.exports = app;
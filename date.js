//jshint esversion:6

//no parenthesis, if added parenthesis, it is called/activated, it should be allowed in app.js 
exports.getDate = function () {
    const today = new Date()

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {
    const today = new Date()

    const options = {
        weekday: "long",
    }
    return today.toLocaleDateString("en-US", options);
}

console.log(module.exports)
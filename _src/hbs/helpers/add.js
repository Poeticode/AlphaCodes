module.exports.register = function (handlebars) {
    handlebars.registerHelper('add', function (first, second, block) {
        var accum = '';
        accum = first + second;
        return accum;
    });
};
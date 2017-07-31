module.exports.register = function (handlebars) {
    handlebars.registerHelper('for', function (start, to, block) {
        var accum = '';
        for(var i = start; i < to; i++) {
            accum += block.fn(i);
        }
        return accum;
    });
};
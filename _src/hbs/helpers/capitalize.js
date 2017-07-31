module.exports.register = function (handlebars) {
    handlebars.registerHelper('capitalize', function(str){
        // str is the argument passed to the helper when called
        str = str || ''; 
        return str.slice(0,1).toUpperCase() + str.slice(1);
    });
}; 
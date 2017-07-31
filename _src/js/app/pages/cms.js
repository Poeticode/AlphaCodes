module.exports = function() {
    var element = document.getElementById('chapters_editor');
    var chapterSchema = require('../schema/poetry.json');
    var chapterValues = require('../../../hbs/data/dynamic/poetry.json');
    var editor = new JSONEditor(element, { 
        schema: chapterSchema,
        startval: chapterValues
    }); 
    $('#console_btn').bind('click', () => {
        var output = editor.getValue();
        $("#output_container").val(JSON.stringify(output[0]));
        console.log(editor.getValue().toString());
    });

} 
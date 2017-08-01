module.exports = function(history) {
    $('a').each(function(index, link) {
        let $link = $(link);
        let urlToGet = $link.attr('href');
        let elementToReplace = $link.data('replace');
        if ($link.data('no-replace')) return;
        if (!elementToReplace) elementToReplace = 'body';

        $link.unbind('click');
        $link.click(function () {
            require('./goto.js')(history, urlToGet, elementToReplace);
            return false;
        });

    });
}
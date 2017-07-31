module.exports = function(history, elementToReplace, $receivedElement) {
    $(elementToReplace).empty().html($receivedElement.children());
    componentHandler.upgradeDom();
    if (elementToReplace === 'body') {
        // this means it's a page load
        var $body = $('body');
        var newBodyClasses = $receivedElement.attr('class');
        $body.attr('class', newBodyClasses);
        $body.attr('data-body', newBodyClasses);
        require('./linkreplacer.js')(history);
        require('./initializer.js')($receivedElement.data('body'));
    }
}
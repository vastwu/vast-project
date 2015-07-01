define(function (require) {
    var util = {
        '$': function (query, context) {
            return (context || document).querySelector(query);
        }
    }
    return util;
});

const fs = require('fs');

module.exports.logger = function(file_path) {

    const FILE_PATH = file_path;
    const STATES = {info : "INFO", debug : "DEBUG", warning: "WARNING", error : "ERROR", fatal : "FATAL"};
    const STATES_KEYS = Object.keys(STATES);

    Object.freeze(STATES);

    var create_log_file = function(state, message) {

        var date = Date();
        var formatted_log = `${state} [${date}] ${message}\n`;

        return formatted_log; 
    };

    var log = function(state, args) {

        if (! STATES_KEYS.includes(state.toLowerCase())) throw new Error(`State ${state} not an option of ${STATES_KEYS.toString()}`);
        args_as_string = args.join(" ");

        fs.appendFile(FILE_PATH, create_log_file(state, args_as_string), function(error) {

            if (error) throw new Error(error.message);
        });
    };

    return {

        STATES : STATES,
        log : function(state) {
            
            var args = Object.values(arguments);
            args.splice(0, 1);
            log(state, args);
        }
    }

};
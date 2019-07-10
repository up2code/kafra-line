const config = require('./config'); 

module.exports = () => {
    return {
        "command_not_found": config().message.command_not_found,
        "item_not_found": config().message.item_not_found
    }
}
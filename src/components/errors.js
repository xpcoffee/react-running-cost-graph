/**
 * @param {string} message 
 */
export function InvalidParameterException(message) {
    this.message = message;
    this.name = "InvalidParameterException"
}
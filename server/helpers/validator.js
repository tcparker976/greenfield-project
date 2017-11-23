module.exports.username = new RegExp(/^[a-zA-Z0-9]{8,20}$/);
module.exports.password = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/);
module.exports.email = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
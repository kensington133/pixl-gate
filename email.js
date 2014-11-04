var email = require('emailjs');

var mailServer  = email.server.connect({
   user:    "pixl.gate.game@gmail.com",
   password:"adventure123",
   host:    "smtp.gmail.com",
   ssl:     true
});

module.exports = mailServer;
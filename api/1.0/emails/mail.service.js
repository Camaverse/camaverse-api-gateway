const nodemailer = require('nodemailer');
const sprintf = require('sprintf-js').sprintf;

const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '9b5c8236956a18',
        pass: 'cef86e390c56d4'
    }
});

const messages = {
  accountCreated: {
      from: 'us@camaverse.com', // Sender address
      to: '%1$s',         // List of recipients
      subject: 'Your Account Has Been Created', // Subject line
      text: 'Welcome to Camaverse!!!' // Plain text body
  },
  loginLink: {
      from: 'us@camaverse.com', // Sender address
      to: '%1$s',        // List of recipients
      subject: 'Your login link', // Subject line
      text: 'login with this link here: %2$s'// Plain text body
  },
};

const sendMail = ( message, vars ) => {

    console.log('SENDMAIL: ', {message}, {vars});

    const msg = messages[message];
    const keys = Object.keys(msg);
    keys.forEach( key => {
        msg[key] = sprintf(msg[key], vars.email, vars.token)
    });

   transport.sendMail(msg, function(err, info) {
       if (err) {
           console.log(err)
       } else {
           console.log(info);
       }
   });
};

module.exports = sendMail;
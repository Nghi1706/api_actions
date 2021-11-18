const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();
// middleware
app.use(express.json());
app.use(cors());

var CLIENT_ID = '637751409271-laqmbs66jtl6tcnknp20j15jsikggbs8.apps.googleusercontent.com';
var CLIENT_SECRET = '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';
var REDIRECT_URI = 'https://developers.google.com/oauthplayground';
var REFRESH_TOKEN = '1//045eVheYxi1dDCgYIARAAGAQSNwF-L9Irtv4sN-ZxoNU1qoqiniqVyXukj76S_07xg8bIRu9S1N5XVgQxo562hb76gpIqxCam3gk';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = oAuth2Client.getAccessToken();
const transport = nodemailer.createTransport({ // config mail server
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: "nguyenvannghi17062000@gmail.com",
        //pass: "nguyenvannghi17062000",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
    }
});
//------

transport.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});
app.post("/sendmail", function (req, res) {
    let mailOptions = {
        from: '"NhaKhoaN&Q" <nguyenvannghi17062000@gmail.com>', // sender address
        // to: `${mail}`, // list of receivers
        to: `${req.body.mail.mail}`,
        subject: "Nha khoa N&Q thông báo !", // Subject line
        text: "Kính chào quý khách, nha khoa N&Q hẹn gặp quý khách tại phòng khám để kiểm tra sức khoẻ răng miệng như lịch hẹn của mình đặt ra nhé! Kính chúc quý khách một ngày tốt lành! Trân trọng", // plain text body
        html: "<b>Kính chào quý khách! <br>Nha khoa N&Q hẹn gặp quý khách tại phòng khám để kiểm tra sức khoẻ răng miệng như lịch hẹn của mình đăng kí nhé!<br> Kính chúc quý khách một ngày tốt lành!<br> Trân trọng</b>", // html body
    };
    transport.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({ status: "fail" });
        } else {
            res.json({ status: "success" });
        }
    });
});
const port = process.env.PORT || 8080;;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
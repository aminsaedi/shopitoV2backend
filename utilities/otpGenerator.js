const numberOfDigits = 4;
const digits = "0123456789";

const generateOtp = () => {
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log("Send this to user : ", OTP);
  return OTP;
};

module.exports = generateOtp;

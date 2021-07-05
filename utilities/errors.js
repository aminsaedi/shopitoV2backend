const errors = {
  faMobileOrUsernameIsRequierd: [
    "لطفا شماره موبایل و یا نام کاربری خود را وارد کنید.",
  ],
  faUnhandledError: ["خطای ناشناخته در سمت سرور رخ داد."],
  faCustomerNotFound: ["کاربری با این مشخصات یافت نشد"],
  faMobileIsrequired: ["شماره موبایل اجباری استس"],
  faFailedRegisterCustomer: ["خطایی در ثبت نام کاربر رخ داد"],
  faToomanyOtpRequest: (reminingTime) => [
    `پس از ${reminingTime} ثانیه مجدادا تلاش کنید`,
  ],
  faOtpIsRequired: ["لطفا کد رمز را وارد کنید"],
  faWrongOtp: ["کد یک بار رمز اشتباه وارد شد."],
  faPassWordIsRequired: ["رمز عبور وارد نشده است."],
  faWrongPassword: ["کلمه عبور معتبر نمیباشد"],
  faOtpIsExpired: ["کد یک بار رمز منقضی شده است"],
};

module.exports = errors;

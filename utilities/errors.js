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
  faIncompeleteFieldsForCreateNewStore: [
    "اطلاعات داده شده برای ساخت فروشگاه کامل نیست",
  ],
  faErrorWhileCreatingStore: ["خطا در ایجاد فروشگاه"],
  faPriceAndNameAndNumberInStockAndBarcodeAndPurchasePriceAreRequired: [
    "قیمت کالا وارد نشده",
    "نام کالا وارد نشده",
    "موجودی محصول وارد نشده است",
    "بارکد محصول وارد نشده است",
    "قیمت خرید محصول وارد نشده است",
  ],
  faAddNewProductFailed: ["ایجاد محصول جدید شکست خورد"],
  faStoreIdIsRequired: ["آیدی فروشگاه داده نشده است."],
  faCategoryNameIsRequired: ["نام دسته بندی ارسال نشده است"],
  faAddNewCategoryFailed: ["ایجاد دسته بندی شکست خورد"],
  faEnterProductState: ["وضعیت محصول را مشخص کنید"],
  faEnterProductId: ["آیدی محصول را وارد کنید"],
  faProductNotFound: ["محصول یافت نشد"],
  faUpdateProductFailed: ["آپدیت محصول شکست خورد"],
  faEnterProductNewPrice: ["قیمت جدید محصول را وارد کنید"],
  faEnterDiscountState: ["وضعیت تخفیف را مشخص کنید"],
  faOutOfRangeDiscountPrice: ["قیمت تخفیف خارج از محدوده مجاز میباشد"],
  faEnterCategoryParentId: ["آیدی پرنت این شاخه را وارد کنید"],
  faInvalidCategoryParentId: ["پرنت ایدی در دسته بندی ها وجود ندارد"],
  faEnterCategoryId: ["آیدی دسته بندی را وارد کنید"],
  faDeleteCategotyFailed: ["حذف دسته بندی شکست خورد"],
  faCategoryNotFound: ["شاخه پیدا نشد"],
  faCAtegoryUpdated: ["دسته بندی به روز شد"],
  faUpdateCategoryFailed: ["حدف دسته بندی شکست خورد"],
  faRootCategoryNotFound: ["شاخه روت پیدا نشد"]
};

module.exports = errors;

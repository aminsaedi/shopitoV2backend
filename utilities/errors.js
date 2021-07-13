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
  faPriceAndNameAndNumberInStockAndBarcodeAndPurchasePriceAndSoreIdAndCategoryAreRequired:
    [
      "قیمت کالا وارد نشده",
      "نام کالا وارد نشده",
      "موجودی محصول وارد نشده است",
      "بارکد محصول وارد نشده است",
      "قیمت خرید محصول وارد نشده است",
      "آیدی فروشکاه وارد نشده است",
      "آیدی دسته بندی وارد نشده است",
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
  faRootCategoryNotFound: ["شاخه روت پیدا نشد"],
  faDeleteProductFailed: ["حدف محصول شکست خورد"],
  enNoTokenProvided: ["Token not provided"],
  enInvalidToken: ["Invalid token"],
  faCustomerHasActiveShopping: ["شما در حال خرید در یکی از فروشگاه ها میباشید"],
  faEnterStoreBarcode: ["بارکد فروشگاه را ارسال کنید"],
  faStoreNotFoundByBarcode: ["فروشگاهی با این بارکد پیدا نشد"],
  faStartShoppingFailed: ["شروع خرید شکست خورد"],
  customerDoesntHaveActiveShopping: {
    fa: "شما خرید در حال انجامی از هیچ یک از فروشگاه ها ندارید",
    en: "you do not have active shopping in any stores",
  },
  enterCartId: {
    fa: "آیدی سبد خرید ارسال نشده است",
    en: "please send cartId",
  },
  cartNotFound: {
    fa: "سبد خریدی با این آیدی پیدا نشد",
    en: "cart not found with this id",
  },
  addItemToCartFailed: {
    fa: "افزوت محصول به سبد خرید شکست خورد",
    en: "add item to cart failed",
  },
  quantityMustBeGraterThanZero: {
    fa: "کوانتیتی باید بیشتر از صفر باشد(حداقل یک)",
    en: "quantity must be greter than zero",
  },
  couldNotFoundItemInCart: {
    fa: "کالا در سبد خرید مشاهده نشد",
    en: "could Not Found Item In Cart",
  },
  inOrderToDecrementQuantityShouldBeGreaterThanTwo: {
    fa: "آیتم موجود است ولی برای کاهش باید حداقل تعداد ۲ عدد باشد (برای حذف از متود مناسب استفاده کنید)",
    en: "Item exists but quantity should be greater than two (in otder to delete use another method)",
  },
  reduceQuantityFaild: {
    fa: "کاهش تعداد محصول از سبد خرید شکست خورد",
    en: "failed to reduce cart item",
  },
  enterProductBarcode: {
    fa: "بارکد محصول را ارسال کنید",
    en: "enter product barcode",
  },
  deleteItemFromCartFailed: {
    fa: "حذف آیتم از سبد خرید شکست خورد",
    en: "delete item from cart failed",
  },
  storeNotFound: {
    fa: "فروشگاه پیدا نشد",
    en: "store not found",
  },
  cartIsLock: {
    fa: "کارت از قبل قفل شده است",
    en: "cart has been locked",
  },
  walletBalanceIsLow: {
    fa: "موجودی کیف پول شما برای خرید کافی نیست",
    en: "your wallet balance is less than price of total items in your cart.",
  },
  usernameAndPasswordIsRequired: {
    fa: "نام کاربری و رمز عبور را وارد کنید",
    en: "enter username and/or password",
  },
  usernameAndOrPasswordIsWrong: {
    fa: "نام کاربری و یا رمز عبور اشتباه است",
    en: "username and or password is wrong",
  },
  enterAccessLevel: {
    fa: "سطح دسترسی را وارد کنید",
    en: "enter access level",
  },
  enterOtpOnStoreAdminMobile: {
    fa: "کد ارسال شده به مدیر فروشگاه را وارد کنید",
    en: "enter code is sent on store managers mobile",
  },
  enterAdminMobileNumber: {
    fa: "شماره موبایل مدیر فروشگاه را ارسال کنید",
    en: "Enter sotore manager mobile number",
  },
  createStaffFailed: {
    fa: "ایجاد کاربر شکست خورد",
    en: "create user failed",
  },
  staffNotFound: {
    fa: "کاربری پیدا نشد",
    en: "staff not found",
  },
  invalidAccessLevel: {
    fa: "سطح دسترسی معتبر نیست",
    en: "Invalid access level name.",
  },
};

module.exports = errors;

export type Language = 'uz' | 'ru';

export const translations = {
  uz: {
    // Navigation
    nav: {
      home: "Bosh sahifa",
      catalog: "Katalog",
      about: "Biz haqimizda",
      contact: "Aloqa",
      faq: "FAQ",
      cart: "Savat",
      admin: "Admin",
    },
    // Hero
    hero: {
      title: "Uyingiz uchun mukammal mebel",
      subtitle: "Yuqori sifatli mebel ishlab chiqarish va sotish. Sizning orzuingizdagi uyni yaratamiz.",
      cta: "Katalogni ko'rish",
      consultation: "Bepul konsultatsiya",
    },
    // Benefits
    benefits: {
      title: "Nega bizni tanlashadi",
      custom: "Buyurtma asosida",
      customDesc: "Sizning o'lchovingiz va dizayningizga mos mebel",
      delivery: "Tez yetkazib berish",
      deliveryDesc: "Toshkent bo'ylab 3 kun ichida",
      warranty: "3 yil kafolat",
      warrantyDesc: "Barcha mahsulotlarimizga kafolat",
      quality: "Sifatli materiallar",
      qualityDesc: "Faqat tabiiy yog'och va ekologik toza materiallar",
      consultation: "Bepul konsultatsiya",
      consultationDesc: "Mutaxassislarimiz sizga yordam beradi",
    },
    // Products
    products: {
      featured: "Mashhur mahsulotlar",
      viewAll: "Barchasini ko'rish",
      addToCart: "Savatga qo'shish",
      orderWhatsApp: "WhatsApp orqali buyurtma",
      requestConsultation: "Konsultatsiya olish",
      from: "dan",
      currency: "so'm",
      inStock: "Mavjud",
      outOfStock: "Mavjud emas",
      materials: "Materiallar",
      sizes: "O'lchamlar",
      colors: "Ranglar",
      description: "Tavsif",
      details: "Batafsil",
      relatedProducts: "O'xshash mahsulotlar",
    },
    // Categories
    categories: {
      title: "Toifalar",
      kitchen: "Oshxona mebeli",
      bedroom: "Yotoqxona mebeli",
      living: "Yashash xonasi",
      office: "Ofis mebeli",
      dining: "Ovqatlanish xonasi",
      kids: "Bolalar xonasi",
      bathroom: "Hammom mebeli",
      outdoor: "Bog' mebeli",
    },
    // Promo
    promo: {
      title: "Maxsus taklif!",
      subtitle: "Barcha mebellarga 20% chegirma",
      description: "Faqat shu oy davomida. Shoshiling!",
      cta: "Batafsil",
    },
    // Reviews
    reviews: {
      title: "Mijozlar fikrlari",
    },
    // Footer
    footer: {
      description: "Yuqori sifatli mebel ishlab chiqarish va sotish. 10 yildan ortiq tajriba.",
      quickLinks: "Tez havolalar",
      contact: "Aloqa",
      workingHours: "Ish vaqti",
      weekdays: "Du-Ju: 9:00 - 18:00",
      saturday: "Sha: 10:00 - 16:00",
      sunday: "Ya: Dam olish",
      rights: "Barcha huquqlar himoyalangan.",
    },
    // Catalog
    catalog: {
      title: "Mahsulotlar katalogi",
      search: "Qidirish...",
      filters: "Filtrlar",
      category: "Toifa",
      priceRange: "Narx oralig'i",
      material: "Material",
      allCategories: "Barcha toifalar",
      allMaterials: "Barcha materiallar",
      clearFilters: "Filtrlarni tozalash",
      noProducts: "Mahsulotlar topilmadi",
      showing: "Ko'rsatilmoqda",
      of: "dan",
      products: "mahsulot",
    },
    // About
    about: {
      title: "Biz haqimizda",
      story: "Bizning tarix",
      storyText: "2013 yildan beri biz Toshkentda eng yaxshi mebel ishlab chiqaruvchilardan birimiz. Bizning missiyamiz - har bir uyga sifatli va chiroyli mebel yetkazish.",
      mission: "Missiyamiz",
      missionText: "Mijozlarimizga eng yaxshi sifat va xizmatni taqdim etish. Biz har bir buyurtmani alohida e'tibor bilan bajaramiz.",
      values: "Qadriyatlarimiz",
      valuesText: "Sifat, halollik va mijoz mamnuniyati - bu bizning asosiy qadriyatlarimiz.",
      stats: {
        years: "Yillik tajriba",
        products: "Ishlab chiqarilgan mebel",
        customers: "Mamnun mijozlar",
        cities: "Xizmat ko'rsatadigan shaharlar",
      },
    },
    // Contact
    contact: {
      title: "Biz bilan bog'laning",
      subtitle: "Savollaringiz bormi? Biz yordam berishga tayyormiz!",
      form: {
        name: "Ismingiz",
        phone: "Telefon raqamingiz",
        email: "Email",
        message: "Xabaringiz",
        submit: "Yuborish",
        success: "Xabaringiz yuborildi!",
      },
      info: {
        address: "Manzil",
        addressValue: "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi, 15-uy",
        phone: "Telefon",
        email: "Email",
        workingHours: "Ish vaqti",
      },
    },
    // FAQ
    faq: {
      title: "Ko'p so'raladigan savollar",
      subtitle: "Eng ko'p beriladigan savollarga javoblar",
      categories: {
        ordering: "Buyurtma berish",
        delivery: "Yetkazib berish",
        warranty: "Kafolat",
        custom: "Buyurtma asosida",
        payment: "To'lov",
      },
    },
    // Cart
    cart: {
      title: "Savatingiz",
      empty: "Savat bo'sh",
      emptyDesc: "Mahsulotlarni qo'shing va bu yerda ko'ring",
      continueShopping: "Xarid qilishni davom ettirish",
      total: "Jami",
      sendWhatsApp: "WhatsApp orqali yuborish",
      quantity: "Miqdor",
      remove: "O'chirish",
    },
    // Common
    common: {
      loading: "Yuklanmoqda...",
      error: "Xatolik yuz berdi",
      retry: "Qayta urinish",
      back: "Orqaga",
      close: "Yopish",
      save: "Saqlash",
      cancel: "Bekor qilish",
      delete: "O'chirish",
      edit: "Tahrirlash",
      add: "Qo'shish",
      search: "Qidirish",
    },
  },
  ru: {
    // Navigation
    nav: {
      home: "Главная",
      catalog: "Каталог",
      about: "О нас",
      contact: "Контакты",
      faq: "FAQ",
      cart: "Корзина",
      admin: "Админ",
    },
    // Hero
    hero: {
      title: "Идеальная мебель для вашего дома",
      subtitle: "Производство и продажа высококачественной мебели. Создаем дом вашей мечты.",
      cta: "Смотреть каталог",
      consultation: "Бесплатная консультация",
    },
    // Benefits
    benefits: {
      title: "Почему выбирают нас",
      custom: "На заказ",
      customDesc: "Мебель по вашим размерам и дизайну",
      delivery: "Быстрая доставка",
      deliveryDesc: "По Ташкенту за 3 дня",
      warranty: "Гарантия 3 года",
      warrantyDesc: "Гарантия на всю продукцию",
      quality: "Качественные материалы",
      qualityDesc: "Только натуральное дерево и экологичные материалы",
      consultation: "Бесплатная консультация",
      consultationDesc: "Наши специалисты помогут вам",
    },
    // Products
    products: {
      featured: "Популярные товары",
      viewAll: "Смотреть все",
      addToCart: "В корзину",
      orderWhatsApp: "Заказать через WhatsApp",
      requestConsultation: "Получить консультацию",
      from: "от",
      currency: "сум",
      inStock: "В наличии",
      outOfStock: "Нет в наличии",
      materials: "Материалы",
      sizes: "Размеры",
      colors: "Цвета",
      description: "Описание",
      details: "Подробнее",
      relatedProducts: "Похожие товары",
    },
    // Categories
    categories: {
      title: "Категории",
      kitchen: "Кухонная мебель",
      bedroom: "Спальная мебель",
      living: "Гостиная",
      office: "Офисная мебель",
      dining: "Столовая",
      kids: "Детская комната",
      bathroom: "Ванная мебель",
      outdoor: "Садовая мебель",
    },
    // Promo
    promo: {
      title: "Специальное предложение!",
      subtitle: "Скидка 20% на всю мебель",
      description: "Только в этом месяце. Спешите!",
      cta: "Подробнее",
    },
    // Reviews
    reviews: {
      title: "Отзывы клиентов",
    },
    // Footer
    footer: {
      description: "Производство и продажа высококачественной мебели. Более 10 лет опыта.",
      quickLinks: "Быстрые ссылки",
      contact: "Контакты",
      workingHours: "Время работы",
      weekdays: "Пн-Пт: 9:00 - 18:00",
      saturday: "Сб: 10:00 - 16:00",
      sunday: "Вс: Выходной",
      rights: "Все права защищены.",
    },
    // Catalog
    catalog: {
      title: "Каталог товаров",
      search: "Поиск...",
      filters: "Фильтры",
      category: "Категория",
      priceRange: "Диапазон цен",
      material: "Материал",
      allCategories: "Все категории",
      allMaterials: "Все материалы",
      clearFilters: "Сбросить фильтры",
      noProducts: "Товары не найдены",
      showing: "Показано",
      of: "из",
      products: "товаров",
    },
    // About
    about: {
      title: "О нас",
      story: "Наша история",
      storyText: "С 2013 года мы являемся одним из лучших производителей мебели в Ташкенте. Наша миссия - доставить качественную и красивую мебель в каждый дом.",
      mission: "Наша миссия",
      missionText: "Предоставить нашим клиентам лучшее качество и сервис. Мы выполняем каждый заказ с особым вниманием.",
      values: "Наши ценности",
      valuesText: "Качество, честность и удовлетворенность клиентов - наши основные ценности.",
      stats: {
        years: "Лет опыта",
        products: "Произведено мебели",
        customers: "Довольных клиентов",
        cities: "Городов обслуживания",
      },
    },
    // Contact
    contact: {
      title: "Свяжитесь с нами",
      subtitle: "Есть вопросы? Мы готовы помочь!",
      form: {
        name: "Ваше имя",
        phone: "Номер телефона",
        email: "Email",
        message: "Сообщение",
        submit: "Отправить",
        success: "Сообщение отправлено!",
      },
      info: {
        address: "Адрес",
        addressValue: "г. Ташкент, Чиланзарский район, ул. Бунёдкор, дом 15",
        phone: "Телефон",
        email: "Email",
        workingHours: "Время работы",
      },
    },
    // FAQ
    faq: {
      title: "Часто задаваемые вопросы",
      subtitle: "Ответы на самые популярные вопросы",
      categories: {
        ordering: "Оформление заказа",
        delivery: "Доставка",
        warranty: "Гарантия",
        custom: "На заказ",
        payment: "Оплата",
      },
    },
    // Cart
    cart: {
      title: "Ваша корзина",
      empty: "Корзина пуста",
      emptyDesc: "Добавьте товары и увидите их здесь",
      continueShopping: "Продолжить покупки",
      total: "Итого",
      sendWhatsApp: "Отправить через WhatsApp",
      quantity: "Количество",
      remove: "Удалить",
    },
    // Common
    common: {
      loading: "Загрузка...",
      error: "Произошла ошибка",
      retry: "Повторить",
      back: "Назад",
      close: "Закрыть",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      add: "Добавить",
      search: "Поиск",
    },
  },
};

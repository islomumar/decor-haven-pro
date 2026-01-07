export interface Product {
  id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  fullDescription_uz: string;
  fullDescription_ru: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  materials: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  active: boolean;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text_uz: string;
  text_ru: string;
  date: string;
  productId?: string;
}

export interface FAQ {
  id: string;
  question_uz: string;
  question_ru: string;
  answer_uz: string;
  answer_ru: string;
  category: 'ordering' | 'delivery' | 'warranty' | 'custom' | 'payment';
}

export const categories: Category[] = [
  {
    id: 'kitchen',
    name_uz: "Oshxona mebeli",
    name_ru: "Кухонная мебель",
    slug: 'kitchen',
    icon: 'ChefHat',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    productCount: 24,
  },
  {
    id: 'bedroom',
    name_uz: "Yotoqxona mebeli",
    name_ru: "Спальная мебель",
    slug: 'bedroom',
    icon: 'Bed',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
    productCount: 32,
  },
  {
    id: 'living',
    name_uz: "Yashash xonasi",
    name_ru: "Гостиная",
    slug: 'living',
    icon: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    productCount: 45,
  },
  {
    id: 'office',
    name_uz: "Ofis mebeli",
    name_ru: "Офисная мебель",
    slug: 'office',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
    productCount: 18,
  },
  {
    id: 'dining',
    name_uz: "Ovqatlanish xonasi",
    name_ru: "Столовая",
    slug: 'dining',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
    productCount: 15,
  },
  {
    id: 'kids',
    name_uz: "Bolalar xonasi",
    name_ru: "Детская комната",
    slug: 'kids',
    icon: 'Baby',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600',
    productCount: 28,
  },
  {
    id: 'bathroom',
    name_uz: "Hammom mebeli",
    name_ru: "Ванная мебель",
    slug: 'bathroom',
    icon: 'Bath',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
    productCount: 12,
  },
  {
    id: 'outdoor',
    name_uz: "Bog' mebeli",
    name_ru: "Садовая мебель",
    slug: 'outdoor',
    icon: 'TreeDeciduous',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
    productCount: 20,
  },
];

export const products: Product[] = [
  {
    id: '1',
    name_uz: "Zamonaviy divan to'plami",
    name_ru: "Современный диванный комплект",
    description_uz: "Yumshoq va qulay zamonaviy divan to'plami",
    description_ru: "Мягкий и удобный современный диванный комплект",
    fullDescription_uz: "Premium sifatli to'qimadan tayyorlangan zamonaviy divan to'plami. Ergonomik dizayn va yuqori sifatli materiallar. Oila uchun ideal tanlov.",
    fullDescription_ru: "Современный диванный комплект из премиальной ткани. Эргономичный дизайн и высококачественные материалы. Идеальный выбор для семьи.",
    price: 8500000,
    originalPrice: 10000000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    ],
    categoryId: 'living',
    materials: ['Velvet', 'Yog\'och', 'Metall'],
    sizes: ['3 o\'rinli', '2 o\'rinli', 'L shaklli'],
    colors: ['Kulrang', 'Ko\'k', 'Jigarrang'],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '2',
    name_uz: "Premium yotoq to'plami",
    name_ru: "Премиум кровать",
    description_uz: "Yuqori sifatli yog'ochdan yasalgan yotoq",
    description_ru: "Кровать из высококачественного дерева",
    fullDescription_uz: "Tabiiy eman yog'ochidan yasalgan hashamatli yotoq. Ortopedik poydevor bilan. 10 yil kafolat.",
    fullDescription_ru: "Роскошная кровать из натурального дуба. С ортопедическим основанием. 10 лет гарантии.",
    price: 12000000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    ],
    categoryId: 'bedroom',
    materials: ['Eman yog\'och', 'MDF'],
    sizes: ['160x200', '180x200', '200x200'],
    colors: ['Tabiiy', 'Jigarrang', 'Oq'],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '3',
    name_uz: "Oshxona garnituri",
    name_ru: "Кухонный гарнитур",
    description_uz: "Zamonaviy oshxona mebel to'plami",
    description_ru: "Современный кухонный гарнитур",
    fullDescription_uz: "To'liq jihozlangan zamonaviy oshxona garnituri. Suv va issiqlikka chidamli materiallar. Buyurtma asosida o'lcham.",
    fullDescription_ru: "Полностью оборудованный современный кухонный гарнитур. Водо- и термостойкие материалы. Размеры на заказ.",
    price: 15000000,
    originalPrice: 18000000,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
    ],
    categoryId: 'kitchen',
    materials: ['MDF', 'Granit', 'Metall'],
    sizes: ['2.5m', '3m', '3.5m', '4m'],
    colors: ['Oq', 'Kulrang', 'Yog\'och rang'],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '4',
    name_uz: "Ofis stoli",
    name_ru: "Офисный стол",
    description_uz: "Ergonomik ofis stoli",
    description_ru: "Эргономичный офисный стол",
    fullDescription_uz: "Balandligi sozlanadigan zamonaviy ofis stoli. Kabel boshqaruvi va qo'shimcha tortmalar bilan.",
    fullDescription_ru: "Современный офисный стол с регулируемой высотой. С управлением кабелями и дополнительными ящиками.",
    price: 3500000,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    ],
    categoryId: 'office',
    materials: ['MDF', 'Metall'],
    sizes: ['120x60', '140x70', '160x80'],
    colors: ['Oq', 'Qora', 'Yog\'och rang'],
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '5',
    name_uz: "Ovqatlanish stoli va stullar",
    name_ru: "Обеденный стол со стульями",
    description_uz: "6 kishilik ovqatlanish to'plami",
    description_ru: "Обеденный комплект на 6 человек",
    fullDescription_uz: "Oilaviy ovqatlanish uchun ideal to'plam. Tabiiy yog'ochdan yasalgan. 6 ta stul bilan.",
    fullDescription_ru: "Идеальный комплект для семейных обедов. Изготовлен из натурального дерева. С 6 стульями.",
    price: 7500000,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
    ],
    categoryId: 'dining',
    materials: ['Yog\'och', 'Mato'],
    sizes: ['6 kishilik', '8 kishilik'],
    colors: ['Tabiiy', 'Qora', 'Oq'],
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '6',
    name_uz: "Bolalar uchun mebel to'plami",
    name_ru: "Детский мебельный комплект",
    description_uz: "Ikki qavatli karavot va shkaf",
    description_ru: "Двухъярусная кровать со шкафом",
    fullDescription_uz: "Bolalar xonasi uchun to'liq mebel to'plami. Xavfsiz va ekologik toza materiallar. Yosh bolalar uchun ideal.",
    fullDescription_ru: "Полный мебельный комплект для детской. Безопасные и экологичные материалы. Идеально для маленьких детей.",
    price: 6000000,
    originalPrice: 7200000,
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    ],
    categoryId: 'kids',
    materials: ['Yog\'och', 'MDF'],
    sizes: ['90x190', '90x200'],
    colors: ['Ko\'k', 'Pushti', 'Yashil', 'Oq'],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '7',
    name_uz: "Hammom shkafi",
    name_ru: "Шкаф для ванной",
    description_uz: "Suv o'tkazmaydigan hammom mebeli",
    description_ru: "Водонепроницаемая мебель для ванной",
    fullDescription_uz: "Suv va namlikka chidamli maxsus qoplama. Ko'zgu va LED yoritish bilan.",
    fullDescription_ru: "Специальное покрытие, устойчивое к воде и влаге. С зеркалом и LED освещением.",
    price: 2800000,
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    ],
    categoryId: 'bathroom',
    materials: ['Suv o\'tkazmas MDF', 'Oyna'],
    sizes: ['60cm', '80cm', '100cm'],
    colors: ['Oq', 'Kulrang'],
    rating: 4.5,
    reviewCount: 45,
    inStock: true,
    featured: false,
    active: true,
  },
  {
    id: '8',
    name_uz: "Bog' mebel to'plami",
    name_ru: "Комплект садовой мебели",
    description_uz: "Tashqi havoda foydalanish uchun",
    description_ru: "Для использования на открытом воздухе",
    fullDescription_uz: "Ob-havoga chidamli materiallardan yasalgan bog' mebeli. Divan, 2 kreslo va stol.",
    fullDescription_ru: "Садовая мебель из погодоустойчивых материалов. Диван, 2 кресла и стол.",
    price: 5500000,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ],
    categoryId: 'outdoor',
    materials: ['Ratan', 'Alyuminiy'],
    sizes: ['4 kishilik', '6 kishilik'],
    colors: ['Jigarrang', 'Kulrang', 'Qora'],
    rating: 4.7,
    reviewCount: 38,
    inStock: true,
    featured: true,
    active: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    name: "Aziz Karimov",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 5,
    text_uz: "Juda ajoyib sifat! Divanimiz uch yildan beri mukammal holatda. Oilam juda mamnun. Rahmat!",
    text_ru: "Отличное качество! Наш диван в идеальном состоянии уже три года. Семья очень довольна. Спасибо!",
    date: "2024-01-15",
  },
  {
    id: '2',
    name: "Dilnoza Rahimova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    text_uz: "Oshxona garnituri buyurtma berdik. Sifati va xizmati a'lo darajada. Hammaga tavsiya qilaman!",
    text_ru: "Заказали кухонный гарнитур. Качество и сервис на высшем уровне. Рекомендую всем!",
    date: "2024-02-20",
  },
  {
    id: '3',
    name: "Sardor Aliyev",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rating: 5,
    text_uz: "Professional yondashuv va tez yetkazib berish. Ofis uchun mebel olgan edik, hammasi mukammal.",
    text_ru: "Профессиональный подход и быстрая доставка. Заказывали мебель для офиса, все идеально.",
    date: "2024-03-10",
  },
  {
    id: '4',
    name: "Gulnora Usmanova",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    text_uz: "Yotoq to'plami juda chiroyli chiqdi. Faqat yetkazib berish biroz kechikdi, lekin sifat zo'r!",
    text_ru: "Спальный комплект получился очень красивый. Только доставка немного задержалась, но качество отличное!",
    date: "2024-03-25",
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question_uz: "Buyurtma qanday beriladi?",
    question_ru: "Как оформить заказ?",
    answer_uz: "Buyurtma berish uchun saytdan mahsulotni tanlang va 'Savatga qo'shish' tugmasini bosing. So'ngra savatga o'ting va 'WhatsApp orqali yuborish' tugmasini bosing. Bizning menejerimiz siz bilan bog'lanadi.",
    answer_ru: "Для оформления заказа выберите товар на сайте и нажмите 'В корзину'. Затем перейдите в корзину и нажмите 'Отправить через WhatsApp'. Наш менеджер свяжется с вами.",
    category: 'ordering',
  },
  {
    id: '2',
    question_uz: "Yetkazib berish qancha vaqt oladi?",
    question_ru: "Сколько времени занимает доставка?",
    answer_uz: "Toshkent shahri bo'ylab tayyor mahsulotlar 3 kun ichida yetkazib beriladi. Buyurtma asosida ishlab chiqarilgan mahsulotlar 2-4 hafta vaqt oladi.",
    answer_ru: "По Ташкенту готовые товары доставляются в течение 3 дней. Товары на заказ занимают 2-4 недели.",
    category: 'delivery',
  },
  {
    id: '3',
    question_uz: "Kafolat muddati qancha?",
    question_ru: "Какой срок гарантии?",
    answer_uz: "Barcha mahsulotlarimizga 3 yil kafolat beramiz. Premium mahsulotlarga 5 yilgacha kafolat mavjud.",
    answer_ru: "На всю нашу продукцию предоставляется гарантия 3 года. На премиум продукцию гарантия до 5 лет.",
    category: 'warranty',
  },
  {
    id: '4',
    question_uz: "Buyurtma asosida mebel yasash mumkinmi?",
    question_ru: "Можно ли заказать мебель по индивидуальным размерам?",
    answer_uz: "Ha, albatta! Biz sizning o'lchamlaringiz va dizayningizga mos mebel yasab beramiz. Bepul konsultatsiya uchun bog'laning.",
    answer_ru: "Да, конечно! Мы изготовим мебель по вашим размерам и дизайну. Свяжитесь с нами для бесплатной консультации.",
    category: 'custom',
  },
  {
    id: '5',
    question_uz: "To'lov qanday amalga oshiriladi?",
    question_ru: "Как производится оплата?",
    answer_uz: "Naqd pul, bank kartasi, Click, Payme orqali to'lash mumkin. Shuningdek, bo'lib to'lash imkoniyati ham mavjud.",
    answer_ru: "Можно оплатить наличными, банковской картой, через Click, Payme. Также доступна рассрочка.",
    category: 'payment',
  },
  {
    id: '6',
    question_uz: "Yetkazib berish pullikmi?",
    question_ru: "Доставка платная?",
    answer_uz: "Toshkent shahri bo'ylab 500 000 so'mdan ortiq buyurtmalar uchun yetkazib berish bepul. Viloyatlarga yetkazib berish alohida kelishiladi.",
    answer_ru: "Доставка по Ташкенту бесплатна для заказов от 500 000 сум. Доставка в регионы обсуждается отдельно.",
    category: 'delivery',
  },
];

export const materials = [
  { id: 'wood', name_uz: "Yog'och", name_ru: "Дерево" },
  { id: 'mdf', name_uz: "MDF", name_ru: "МДФ" },
  { id: 'metal', name_uz: "Metall", name_ru: "Металл" },
  { id: 'fabric', name_uz: "Mato", name_ru: "Ткань" },
  { id: 'leather', name_uz: "Teri", name_ru: "Кожа" },
  { id: 'glass', name_uz: "Oyna", name_ru: "Стекло" },
];

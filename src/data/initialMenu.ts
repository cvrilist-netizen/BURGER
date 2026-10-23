import { Product, ProductCategory, CategoryInfo, RestaurantSettings } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'burger', name: 'Burgerlar', iconName: 'Beef' },
  { id: 'hotdog', name: 'Hot-doglar', iconName: 'Utensils' },
  { id: 'lavash', name: 'Lavashlar', iconName: 'Sandwich' },
  { id: 'kfc', name: 'KFC Tovuq', iconName: 'Flame' },
  { id: 'garnir', name: 'Garnirlar', iconName: 'Sparkles' },
  { id: 'sous', name: 'Souslar', iconName: 'Soup' },
  { id: 'ichimlik', name: 'Ichimliklar', iconName: 'CupSoda' },
  { id: 'kofe', name: 'Kofe', iconName: 'Coffee' },
  { id: 'choy', name: 'Choylar', iconName: 'Teapot' },
  { id: 'kokteyl', name: 'Kokteyllar', iconName: 'GlassWater' },
];

export const INITIAL_SETTINGS: RestaurantSettings = {
  name: 'CHORSU BURGER',
  slogan: 'O‘zgacha ta’m — har bir luqmada!',
  address: 'Namangan shahri, Chorsu dehqon bozori ichida',
  phone: '+998 91 811 33 44',
  workingHours: '09:00 - 23:00 (Har kuni)',
  deliveryFee: 10000,
  minOrderAmount: 20000,
  isOrderingActive: true,
  enabledPaymentMethods: ['cash', 'card'],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chorsu+dehqon+bozori+Namangan'
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- BURGERLAR ---
  {
    id: 'prod_burger_gamburger',
    name: 'Gamburger',
    category: 'burger',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Yumshoq bulochka, mayin mol go‘shti kotleti, yangi bodring, pomidor va maxsus Chorsu sousi.',
    available: true,
    sortOrder: 1,
    isPriceConfirmed: true,
    badge: 'Klassik'
  },
  {
    id: 'prod_burger_chizburger',
    name: 'Chizburger',
    category: 'burger',
    price: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    description: 'Eritilgan erak Cheddar pishlog‘i, shirali mol go‘shti, marinadlangan bodring va xushta’m sous.',
    available: true,
    sortOrder: 2,
    isPriceConfirmed: true,
    badge: 'Xit'
  },
  {
    id: 'prod_burger_achchiq',
    name: 'Achchiq burger',
    category: 'burger',
    price: 24000,
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    description: 'Olovli ta’mni xush ko‘ruvchilar uchun: jalapeño qalampiri, maxsus o‘tkir sous va qovurilgan piyoz.',
    available: true,
    sortOrder: 3,
    isPriceConfirmed: true,
    badge: 'Achchiq'
  },
  {
    id: 'prod_burger_kfc',
    name: 'KFC burger',
    category: 'burger',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    description: 'Qirsillagan oltinrang tovuq filesi, aysberg salat bargi va nozik mayonezli sous.',
    available: true,
    sortOrder: 4,
    isPriceConfirmed: true,
    badge: 'Ommabop'
  },

  // --- HOT-DOGLAR ---
  {
    id: 'prod_hotdog_oddiy',
    name: 'Oddiy hot-dog',
    category: 'hotdog',
    price: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    description: 'Klassik sosiska, yangi bodring, pomidor, xantal va pomidor sousi bilan yangi pishgan nonda.',
    available: true,
    sortOrder: 5,
    isPriceConfirmed: true
  },
  {
    id: 'prod_hotdog_kanada',
    name: 'Kanada hot-dog',
    category: 'hotdog',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1627054234035-7cfa8e714156?auto=format&fit=crop&w=800&q=80',
    description: 'Kanadacha uslubda marinadlangan sabzavotlar, qarsildoq piyoz fri va xushbo‘y sosiska.',
    available: true,
    sortOrder: 6,
    isPriceConfirmed: true,
    badge: 'Maxsus'
  },
  {
    id: 'prod_hotdog_mangal',
    name: 'Mangal hot-dog',
    category: 'hotdog',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=800&q=80',
    description: 'Mangalda dudlangan haqiqiy go‘shtli sosiska, qarsildoq non va dudlangan sous.',
    available: true,
    sortOrder: 7,
    isPriceConfirmed: true,
    badge: 'Mangal'
  },
  {
    id: 'prod_hotdog_dvoynoy',
    name: 'Dvoynoy hot-dog',
    category: 'hotdog',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
    description: 'Ikki barobar ko‘p sosiska, mo‘l sabzavot va boyitilgan maxsus sous.',
    available: true,
    sortOrder: 8,
    isPriceConfirmed: true
  },
  {
    id: 'prod_hotdog_longer',
    name: 'Longer hot-dog',
    category: 'hotdog',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    description: 'Uzun qovurilgan bulochka ichida tovuqli strips va salat bargi.',
    available: true,
    sortOrder: 9,
    isPriceConfirmed: true
  },

  // --- LAVASHLAR ---
  {
    id: 'prod_lavash_oddiy',
    name: 'Oddiy lavash',
    category: 'lavash',
    price: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    description: 'Yupqa xamirdagi mayin go‘sht bo‘laklari, qarsildoq chips, pomidor, bodring va sarimsoqli sous.',
    available: true,
    sortOrder: 10,
    isPriceConfirmed: true,
    badge: 'Ommabop'
  },
  {
    id: 'prod_lavash_zakaz',
    name: 'Zakaz lavash',
    category: 'lavash',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    description: 'Qo‘shimcha porsiya tandir go‘shti bilan tayyorlangan to‘yimli zakaz lavash.',
    available: true,
    sortOrder: 11,
    isPriceConfirmed: true,
    badge: 'Katta'
  },
  {
    id: 'prod_lavash_sirli',
    name: 'Sirli lavash',
    category: 'lavash',
    price: 37000,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    description: 'Mozzarella va Golland pishlog‘i bilan qovurilgan, uzilib ketadigan cho‘ziluvchan pishloqli lazzat.',
    available: true,
    sortOrder: 12,
    isPriceConfirmed: true,
    badge: 'Pishloqli'
  },
  {
    id: 'prod_lavash_achchiq',
    name: 'Achchiq lavash',
    category: 'lavash',
    price: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80',
    description: 'Achchiq qizil sous va marinadlangan achchiq qalampir bilan tayyorlangan olovli lavash.',
    available: true,
    sortOrder: 13,
    isPriceConfirmed: true,
    badge: 'Achchiq'
  },
  {
    id: 'prod_lavash_kfc',
    name: 'KFC lavash',
    category: 'lavash',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    description: 'Qirsillagan qovurilgan tovuq go‘shti, barra sabzavotlar va mayonezli lavash.',
    available: true,
    sortOrder: 14,
    isPriceConfirmed: true
  },

  // --- KFC TOVUQ ---
  {
    id: 'prod_kfc_shirin_05',
    name: 'KFC shirin (0.5 porsiya)',
    category: 'kfc',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    description: 'Shirin-nordon qizil sous bilan qoplangan qarsildoq tovuq bo‘laklari (kichik porsiya).',
    available: true,
    sortOrder: 15,
    isPriceConfirmed: true
  },
  {
    id: 'prod_kfc_shirin_1',
    name: 'KFC shirin (1 porsiya)',
    category: 'kfc',
    price: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    description: 'Shirin-nordon maxsus sousli to‘liq porsiya qarsildoq tovuq.',
    available: true,
    sortOrder: 16,
    isPriceConfirmed: true,
    badge: 'Xit'
  },
  {
    id: 'prod_kfc_achchiq_05',
    name: 'KFC achchiq (0.5 porsiya)',
    category: 'kfc',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
    description: 'Achchiq o‘tkir ziravorlar bilan qovurilgan shirin-achchiq tovuq qanotlari va oyoqchalari.',
    available: true,
    sortOrder: 17,
    isPriceConfirmed: true,
    badge: 'Achchiq'
  },
  {
    id: 'prod_kfc_achchiq_1',
    name: 'KFC achchiq (1 porsiya)',
    category: 'kfc',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1527477321005-4d01d75ba878?auto=format&fit=crop&w=800&q=80',
    description: 'To‘liq 1 porsiya qovurilgan o‘tkir ziravorli qarsildoq KFC tovuq.',
    available: true,
    sortOrder: 18,
    isPriceConfirmed: true,
    badge: 'Achchiq'
  },
  {
    id: 'prod_kfc_1kg',
    name: 'KFC (1 kg tovuq)',
    category: 'kfc',
    price: 90000,
    imageUrl: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=800&q=80',
    description: 'Katta oila yoki do‘stlar davrasi uchun butun boshli 1 kg oltinrang qovurilgan tovuq savatchasi.',
    available: true,
    sortOrder: 19,
    isPriceConfirmed: true,
    badge: 'Katta oila'
  },

  // --- GARNIRLAR ---
  {
    id: 'prod_garnir_fri',
    name: 'Kartoshka fri',
    category: 'garnir',
    price: 7000,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    description: 'Oltinrang, qarsillagan va issiq kartoshka tayoqchalari. Tuzlangan.',
    available: true,
    sortOrder: 20,
    isPriceConfirmed: true,
    badge: 'Qarsildoq'
  },

  // --- SOUSLAR ---
  {
    id: 'prod_sous_sirniy',
    name: 'Sirniy sous',
    category: 'sous',
    price: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    description: 'Kremdek yumshoq, boyitilgan pishloqli sous fri va burgerlar uchun.',
    available: true,
    sortOrder: 21,
    isPriceConfirmed: true
  },
  {
    id: 'prod_sous_chesnochniy',
    name: 'Chesnochniy sous',
    category: 'sous',
    price: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=80',
    description: 'Xushbo‘y sarimsoq va ko‘katlar qo‘shilgan mayin oq sous.',
    available: true,
    sortOrder: 22,
    isPriceConfirmed: true
  },
  {
    id: 'prod_sous_barbeque',
    name: 'Barbeque sous',
    category: 'sous',
    price: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    description: 'Dudlangan, qora shirin-nordon barbekyu sousi.',
    available: true,
    sortOrder: 23,
    isPriceConfirmed: true
  },

  // --- ICHIMLIKLAR ---
  {
    id: 'prod_ichimlik_pepsi',
    name: 'Pepsi 0,5 L',
    category: 'ichimlik',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80',
    description: 'Muzdek gazlangan klassik Pepsi ichimligi 0.5 litr.',
    available: true,
    sortOrder: 24,
    isPriceConfirmed: true
  },
  {
    id: 'prod_ichimlik_mirinda',
    name: 'Mirinda 0,5 L',
    category: 'ichimlik',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80',
    description: 'Apelsin ta’mli yorqin va tetiklantiruvchi Mirinda 0.5 litr.',
    available: true,
    sortOrder: 25,
    isPriceConfirmed: true
  },
  {
    id: 'prod_ichimlik_7up',
    name: '7 Up 0,5 L',
    category: 'ichimlik',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'Limon va laym ta’mli tiniq gazlangan 7 Up ichimligi.',
    available: true,
    sortOrder: 26,
    isPriceConfirmed: true
  },

  // --- KOFE ---
  {
    id: 'prod_kofe_sutli',
    name: 'Sutli kofe',
    category: 'kofe',
    price: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Yangi qaynatilgan kofe donachalari va qaynoq sut ko‘pigi bilan tayyorlangan xushbo‘y ichimlik.',
    available: true,
    sortOrder: 27,
    isPriceConfirmed: true,
    badge: 'Issiq'
  },
  {
    id: 'prod_kofe_qora',
    name: 'Qora kofe',
    category: 'kofe',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    description: 'Klassik to‘q qora espresso kofesi. Narxi tez orada admin tomonidan tasdiqlanadi.',
    available: false,
    sortOrder: 28,
    isPriceConfirmed: false,
    badge: 'Tez kunda'
  },

  // --- CHOYLAR ---
  {
    id: 'prod_choy_limon',
    name: 'Limon choy',
    category: 'choy',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Tabiiy yangi limon tilimlari va asal bilan damlangan tetiklantiruvchi choy.',
    available: true,
    sortOrder: 29,
    isPriceConfirmed: true,
    badge: 'Foydali'
  },
  {
    id: 'prod_choy_malina',
    name: 'Malina choy',
    category: 'choy',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    description: 'Xushbo‘y malina mevasi va yalpiz barglari bilan damlangan xushbo‘y mevali choy.',
    available: true,
    sortOrder: 30,
    isPriceConfirmed: true
  },
  {
    id: 'prod_choy_olma',
    name: 'Olma choy',
    category: 'choy',
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'Dolchin va olma bo‘laklari bilan tayyorlangan isituvchi mevali choy.',
    available: true,
    sortOrder: 31,
    isPriceConfirmed: true
  },
  {
    id: 'prod_choy_qora',
    name: 'Qora choy',
    category: 'choy',
    price: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
    description: 'An’anaviy choynakda damlangan o‘zbekcha qora choy.',
    available: true,
    sortOrder: 32,
    isPriceConfirmed: true
  },

  // --- KOKTEYLLAR ---
  {
    id: 'prod_kokteyl_oddiy',
    name: 'Oddiy kokteyl',
    category: 'kokteyl',
    price: 23000,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    description: 'Muzqaymoq va sovuq sutdan tayyorlangan klassik vanilli sutli kokteyl (milkshake).',
    available: true,
    sortOrder: 33,
    isPriceConfirmed: true
  },
  {
    id: 'prod_kokteyl_shokolad',
    name: 'Shokoladli kokteyl',
    category: 'kokteyl',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    description: 'Belgiya shokoladi, muzqaymoq va shokolad qirindilari bilan boyitilgan kokteyl.',
    available: true,
    sortOrder: 34,
    isPriceConfirmed: true,
    badge: 'Xit'
  },
  {
    id: 'prod_kokteyl_malina',
    name: 'Malinali kokteyl',
    category: 'kokteyl',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80',
    description: 'Yangi malina pyuresi va kremdek sutli muzqaymoq uyg‘unligi.',
    available: true,
    sortOrder: 35,
    isPriceConfirmed: true
  },
  {
    id: 'prod_kokteyl_banan',
    name: 'Bananli kokteyl',
    category: 'kokteyl',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    description: 'Pishgan shirin banan va sutli muzqaymoqdan tayyorlangan to‘yimli ichimlik.',
    available: true,
    sortOrder: 36,
    isPriceConfirmed: true
  },
  {
    id: 'prod_kokteyl_moxito',
    name: 'Moxito',
    category: 'kokteyl',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    description: 'Muz, yangi yalpiz, shakar qiyomi va nordon laym sharbatidan tetiklantiruvchi muzdek moxito.',
    available: true,
    sortOrder: 37,
    isPriceConfirmed: true,
    badge: 'Muzdek'
  },
  {
    id: 'prod_kokteyl_okean',
    name: 'Okean',
    category: 'kokteyl',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    description: 'Ko‘m-ko‘k okean rangi, tsitrusli nordon-shirinlik va muzli yangilanish.',
    available: true,
    sortOrder: 38,
    isPriceConfirmed: true,
    badge: 'Maxsus'
  }
];

# CHORSU BURGER — Fast-Food Onlayn Buyurtma Tizimi

Namangan shahri Chorsu dehqon bozori ichidagi **CHORSU BURGER** fast-food restorani uchun professional, real vaqtda ishlaydigan online buyurtma, oshpaz oshxona paneli va administrator boshqaruvi tizimi.

> **Shior:** “O‘zgacha ta’m — har bir luqmada!”  
> **Manzil:** Namangan shahri, Chorsu dehqon bozori ichida  
> **Telefon:** [+998 91 811 33 44](tel:+998918113344)

---

## 🚀 Texnologiyalar

- **Frontend:** React 19, TypeScript, Vite
- **Dizayn:** Tailwind CSS (v4), Lucide Icons, Canvas Confetti
- **Backend & Baza:** Google Firebase Cloud Firestore (Enterprise), Firebase Authentication (Google Auth)
- **Audio:** Web Audio API synth audio generator (oshxona bildirishnomalari uchun)
- **Xavfsizlik:** Firestore Security Rules (ABAC), Role-Based Access Control (`customer`, `cook`, `admin`)

---

## 📱 Asosiy Imkoniyatlar

1. **Mijozlar Portali:**
   - 10 ta toifadagi 38 ta mashhur taom (Burgerlar, Hot-doglar, Lavashlar, KFC, Garnirlar, Souslar, Ichimliklar, Kofe, Choylar, Kokteyllar).
   - Real vaqtda qidiruv va kategoriyalar bo‘yicha filtr.
   - Savatcha boshqaruvi (mahsulot qo‘shish, sonini o‘zgartirish, olib ketish yoki yetkazib berish turi).
   - Tasdiqlanmagan narxdagi mahsulotlarni (masalan: Qora kofe) himoyalash.
   - Narxlarni Firestore bazasi orqali qayta hisoblash va tasdiqlash.

2. **Real-Vaqt Buyurtmani Kuzatish (Tracking):**
   - Unikal buyurtma raqami (masalan: `#CB-4892`) orqali buyurtma jarayonini kuzatish.
   - Bosqichlar: *Buyurtma yuborildi* ➔ *Qabul qilindi* ➔ *Oshpaz tayyorlamoqda* ➔ *Buyurtma tayyor* ➔ *Yakunlandi*.
   - `onSnapshot` orqali oshpaz tugmani bosishi bilan mijoz sahifasida sahifani yangilamasdan avtomatik aks etadi.

3. **Oshpaz / Oshxona Paneli (`/kitchen` yoki Oshxona bo‘limi):**
   - Yangi buyurtmalar kelganda ekranda bildirishnoma va yoqimli ovozli signal.
   - Katta, qulay shriftlardagi buyurtma kartochkalari va mijoz izohlari.
   - Tezkor holat tugmalari: "Qabul qilish", "Tayyorlanmoqda", "Tayyor", "Yakunlandi", "Bekor qilish".
   - Sana, holat va raqam bo‘yicha filtrlar.

4. **Administrator Paneli (`/admin`):**
   - Boshlang‘ich 38 ta mahsulotni 1 ta tugma bilan Firestore’ga kiritish (**Seed Database**).
   - Mahsulot qo‘shish, narxni o‘zgartirish, sotuvdan vaqtincha olish (availability toggle).
   - Restoran ish vaqti, telefon raqami, yetkazib berish narxlarini sozlash.
   - Xodimlarga oshpaz (`cook`) yoki administrator (`admin`) rollarini biriktirish.
   - Buyurtmalar tarixi, umumiy tushum va tahliliy hisobotlar.

---

## 🛠️ O‘rnatish va Ishga Tushirish

### 1. Bog‘liqliklarni o‘rnatish
```bash
npm install
```

### 2. Loyihani dev rejimida ishga tushirish
```bash
npm run dev
```
Sayt odatda `http://localhost:3000` manzilida ishga tushadi.

### 3. Firebase loyihasini ulash
Loyiha Firebase Cloud Firestore va Authentication bilan ishlaydi.
`firebase-applet-config.json` faylida loyiha konfiguratsiyasi mavjud:
```json
{
  "projectId": "...",
  "appId": "...",
  "apiKey": "...",
  "authDomain": "...",
  "firestoreDatabaseId": "..."
}
```

### 4. Firestore Xavfsizlik Qoidalarini Deploy qilish
`firestore.rules` faylida barcha ruxsatlar to‘liq himoyalangan:
```bash
firebase deploy --only firestore:rules
```

---

## 🧪 Sinovdan O‘tkazish Ro‘yxati (Testing Checklist)

1. [x] **Menyuni ko‘rish:** Bosh sahifada 10 ta kategoriya va mahsulotlar to‘g‘ri chiqishi.
2. [x] **Savatchaga qo‘shish:** Bir nechta mahsulot tanlash, miqdorini `+` va `-` orqali o‘zgartirish, jami summa to‘g‘ri hisoblanishi.
3. [x] **Buyurtma berish:** Ism, telefon raqam va yetkazib berish manzilini kiritib buyurtmani tasdiqlash.
4. [x] **Muvaffaqiyatli buyurtma:** Unikal buyurtma raqami (#CB-xxxx) yaratilishi va bayramona confetti chiqishi.
5. [x] **Oshxona paneli:** Buyurtma oshxona panelida avtomatik real vaqtda paydo bo‘lishi va ovozli signal berilishi.
6. [x] **Holatni yangilash:** Oshpaz "Tayyorlashga kirishish" yoki "Tayyor" tugmasini bosganda, mijoz tracking sahifasida holat soniyalar ichida yangilanishi.
7. [x] **Admin boshqaruvi:** Mahsulot narxini o‘zgartirish va "Vaqtincha sotuvda yo‘q" holatiga o‘tkazish.

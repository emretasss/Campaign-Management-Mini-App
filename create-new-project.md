# Yeni Supabase Projesi Oluşturma

## 🔧 **Adım 1: Supabase Dashboard'a Git**
- https://supabase.com/dashboard
- **Sign In** yap

## 🔧 **Adım 2: Yeni Proje Oluştur**
- **"New Project"** butonuna tıkla
- **Organization**: Kendi hesabını seç
- **Project Name**: `campaign-management-app`
- **Database Password**: `Emretas.1459` (veya istediğin şifre)
- **Region**: `West Europe (N. Virginia)` seç
- **Pricing Plan**: **Free** seç
- **"Create new project"** butonuna tıkla

## 🔧 **Adım 3: Proje Bilgilerini Al**
Proje oluşturulduktan sonra:
- **Settings** → **API** bölümüne git
- **Project URL** kopyala
- **anon public** key kopyala
- **service_role** key kopyala

## 🔧 **Adım 4: Database URL'i Al**
- **Settings** → **Database** bölümüne git
- **Connection string** kopyala
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

## 🔧 **Adım 5: Environment Variables Güncelle**
`.env.local` dosyasını yeni bilgilerle güncelle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YENI_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YENI_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YENI_SERVICE_ROLE_KEY]
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[YENI_PROJECT_ID].supabase.co:5432/postgres
```

## 🔧 **Adım 6: Tabloları Oluştur**
- **SQL Editor** → **New Query**
- `create-tables.sql` dosyasındaki SQL'i çalıştır

## 🔧 **Adım 7: Uygulamayı Test Et**
```bash
npm run dev
```

**🚀 Yeni proje oluşturduktan sonra her şey çalışacak!**

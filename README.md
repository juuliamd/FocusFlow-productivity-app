# FocusFlow-productivity-app

Aplikacja desktopowa dla Windows wspomagająca zarządzanie czasem, projektami i zadaniami, z integracją kalendarza oraz modułem rekomendacji bloków czasowych.

---

## 🔧 Wymagania

- Windows 10 lub nowszy  
- Node.js ≥ 16.x  
- npm ≥ 8.x  

---

## 📥 Instalacja

1. Sklonuj repozytorium:  
   ```bash
   git clone https://github.com/juuliamd/FocusFlow-productivity-app.git  
   cd FocusFlow
   ```
2. Zainstaluj zależności:  
   ```bash
   npm install
   ```

---

## ⚙️ Tryb deweloperski

Uruchom frontend na serwerze Vite oraz aplikację Electron z hot-reload:  
```bash
npm run dev
npm run start
```
- Frontend dostępny pod http://localhost:5173  
- Okno Electron automatycznie odświeża się przy zmianach w kodzie

---

## 🚀 Tryb produkcyjny (bez pakowania)

1. Zbuduj frontend:  
   ```bash
   npm run build:frontend
   ```
2. Uruchom aplikację:  
   ```bash
   npm run start
   ```
Aplikacja wczyta skompilowane pliki z folderu `dist/`

---

## 🗂️ Struktura katalogu

```
FocusFlow/
├── dist/               # Skompilowany frontend (po build-frontend)
├── src/
│   ├── main/           # Pliki Electron (main.js, preload.js)
│   └── renderer/       # Kod React/Vite
├── public/             # Zasoby statyczne (ikonki itp.)
├── package.json
├── vite.config.js
└── README.md
```

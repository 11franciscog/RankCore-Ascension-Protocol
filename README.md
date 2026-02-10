# RankCore: Ascension Protocol

This repository contains everything you need to run your app locally on your PC.

---

## Prerequisites

Make sure you have installed:

- **Node.js (LTS)**  
- **npm**

Check versions:

```bash
node -v
npm -v
```

---

### Run the App Locally

Follow these steps to set up the project on your machine.

- winget install OpenJS.NodeJS.LTS
- git clone https://github.com/11franciscog/RankCore-Ascension-Protocol.git
- open RankCore-Ascension-Protocol dir (cd ...)
- install dependencies:
  ```npm install```
- create .env.local:
  ```
  VITE_APP_ID=cbef744a8545c389ef439ea6
  VITE_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
   ```
- run cmd as admin and run: ```npm run dev```
- will output this ```Local: http://localhost:5173/```, just copy and open in browser



---


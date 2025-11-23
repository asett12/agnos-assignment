# 🩺 Real-Time Patient Intake

A clean and responsive real-time patient intake system built with **Next.js**, **Tailwind CSS**, and **Supabase Realtime**.  
Patients fill out a form on mobile/tablet, and staff see updates instantly on a live dashboard.

---

## 🔗 Live Demo & Repository

- **Live App:** https://real-time-patient-intake.vercel.app/  
- **GitHub Repo:** https://github.com/asett12/agnos-assignment  

---

## 📸 Screenshots

### Home

| Desktop | Mobile |
| --- | --- |
| ![Home – Desktop](./public/screenshots/home-desktop.png) | ![Home – Mobile](./public/screenshots/home-mobile.png) |

### Patient Form

| Desktop | Mobile |
| --- | --- |
| ![Patient Form – Desktop](./public/screenshots/patient-form-desktop.png) | ![Patient Form – Mobile](./public/screenshots/patient-form-mobile.png) |

### Staff View

| Desktop | Mobile |
| --- | --- |
| ![Staff View – Desktop](./public/screenshots/staff-desktop.png) | ![Staff View – Mobile](./public/screenshots/staff-mobile.png) |

### Submit Success

| Desktop | Mobile |
| --- | --- |
| ![Submit Success – Desktop](./public/screenshots/submit-sucess.png) | ![Submit Success – Mobile](./public/screenshots/submit-sucess-mobile.png) |


## 🧩 Core Features

- **Patient Intake Form**  
  Mobile-first, multi-field form with validation and clean UI.

- **Real-Time Staff Dashboard**  
  Staff instantly see new or updated patient entries without refreshing.

- **Supabase Realtime Sync**  
  Every keystroke or submission is broadcast live to all staff dashboards.

- **Search by Name or Patient ID (Bonus Feature)**  
  Staff can quickly filter and locate patients using a built-in search bar, supports searching by first name, last name, or patient ID.

- **Fully Responsive**  
  Optimized layouts for mobile, tablet, and desktop using TailwindCSS.

---

## 🛠 Tech Stack

- **Next.js** – frontend framework  
- **TailwindCSS** – styling  
- **Supabase Realtime** – WebSocket-style live updates  
- **Vercel** – hosting & deployment  

---

## 📁 Project Structure

```bash
.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ patient/page.tsx
│  └─ staff/page.tsx
│
├─ components/
│  ├─ patient/
│  │  ├─ PatientForm.tsx
│  │  ├─ Field.tsx
│  │  └─ SuccessModal.tsx
│  └─ staff/
│     ├─ StaffView.tsx
│     └─ PatientCard.tsx
│
├─ lib/
│  ├─ types.ts
│  ├─ realtime.ts
│  └─ supabaseClient.ts
│
├─ public/screenshots/
├─ styles/globals.css
└─ README.md
```
## ⚙️ **Setup Instructions**

### **1. Clone the project**
```bash
git clone https://github.com/asett12/agnos-assignment.git
cd agnos-assignment
```
### **2. Install dependencies**
```bash
npm install
```
### **3. Add environment variables**
```bash
Create a .env.local file in the project root:
NEXT_PUBLIC_SUPABASE_URL="https://jsvornqtkspkgldtsyag.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzdm9ybnF0a3Nwa2dsZHRzeWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTEwOTcsImV4cCI6MjA3OTM4NzA5N30.wQI6rLz8AVAjaFuLeucxiRRXoYxHuV8pnWicqkaUHow"
```
### **4. Start the development server**
```bash
npm run dev
```
Open: http://localhost:3000

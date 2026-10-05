# St. Joseph International School, Narinda (SJIS)
### Premier Full-Stack Institutional Web Platform & Pro Admin Control Center

A modern, highly optimized school website and administration platform built for **St. Joseph International School, Narinda**, engineered with **Next.js 16 (App Router)** and **Django 6 (Django REST Framework)**.

---

## 🏛️ System Architecture

- **Frontend**: [Next.js 16 (Turbopack, TypeScript, Tailwind CSS, Lucide Icons, App Router)](file:///Volumes/Drive%20A/Narinda%20Campus/Website-Narinda-new/frontend)
- **Backend**: [Django 6.1 + Django REST Framework + CORS Headers + dj-database-url](file:///Volumes/Drive%20A/Narinda%20Campus/Website-Narinda-new/backend)
- **Database**:
  - **Development**: SQLite (`db.sqlite3`)
  - **Production**: PostgreSQL (via `DATABASE_URL` or `POSTGRES_*` environment variables)
- **Authentication**: Token Authentication & Session Authentication with Protected REST Endpoints

---

## 🌟 Key Features

### Public Portal
1. **Hero Slider Studio**: Fullscreen dynamic banner with autoplay, pause-on-hover, navigation indicators, and primary/secondary CTAs.
2. **About Us**: Comprehensive Holy Cross heritage, mission, vision, principal's message, core character pillars, and campus infrastructure.
3. **Notice Board & Circulars**: Official circulars with category filters (Academic, Admission, Exams, Events, Holidays, General), keyword search, pinned notices, and PDF attachment download modal.
4. **Clubs & Co-Curricular Societies**: Interactive guild cards featuring STEM & Robotics, Debating Society, Cultural Arts, ICT, Sports, and Social Welfare with meeting schedules, moderator info, and achievements.
5. **Admission Portal**: Step-by-step 5-stage admission roadmap, age eligibility criteria, transparent fee breakdown table, and live interactive online inquiry/application form.
6. **Media Gallery**: Responsive masonry photo grid with filterable category tabs and fullscreen Lightbox viewer.

### Pro-Level Admin Control Center (`/admin`)
- **Dedicated SaaS Sidebar Layout**: Zero header duplication; isolated from the public layout.
- **Full CRUD for All Models**:
  - **Hero Slider**: Create, edit, toggle active, reorder, delete slides.
  - **Notice Board**: Create circulars, categorize, set publish date, pin to top, attach PDF, delete.
  - **Student Clubs**: Register guilds, assign moderators, set schedules, list achievements, edit, delete.
  - **Media Gallery**: Upload photo/video entries, set captions, toggle homepage feature, delete.
  - **Admissions Pipeline Tracker**: View incoming parent applications, filter by status (`Pending Review`, `Contacted`, `Admitted`, `Archived`), view candidate details, and **Export to CSV**.
  - **Institutional Settings**: Dynamically update school tagline, history, headmaster message, and live student/faculty stats.
- **Custom Modals**: No native browser alerts/confirms; uses elegant animated dialogs and toast notifications.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Django + SQLite)
```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py seed_data      # Seeds SJIS Narinda initial data
python manage.py runserver 127.0.0.1:8000
```
- **API Root**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- **Public Website**: `http://localhost:3000`
- **Admin Control Center**: `http://localhost:3000/admin`

---

## 🔑 Default Administrator Credentials
- **Username**: `admin`
- **Password**: `sjisadmin2026`
*(Pre-filled demo credentials link is also available on `/admin` for rapid access)*

---

## 🚀 One-Command Production Deployment (`narinda.sjis.edu.bd`)

The application is completely configured and automated for instant one-command production deployment using **Docker Compose** or **Native VPS (systemd + Nginx)**.

### Method A: Docker Compose (Recommended)

To deploy the entire stack (PostgreSQL 16, Django 6 Gunicorn API, Next.js 16 Standalone frontend, and Nginx reverse proxy with SSL automation) in **one single command**:

```bash
./deploy.sh
```

**What `./deploy.sh` automatically performs:**
1. Validates or initializes `.env` from `.env.production` with secure keys.
2. Builds and starts `db`, `backend`, `frontend`, and `nginx` containers.
3. Automatically runs all database migrations (`python manage.py migrate`).
4. Automatically initializes or verifies the superuser administrator credentials.
5. Seeds baseline institutional data and faculty directory if empty.
6. Gathers all static assets into production storage (`collectstatic`).
7. Configures Nginx with reverse proxy routing, SSL bootstrap, 50MB upload limits, and HTTP/2.

#### Optional: Automatic Let's Encrypt SSL Provisioning
To issue free trusted Let's Encrypt SSL certificates for `narinda.sjis.edu.bd`:
```bash
./deploy.sh --ssl
```

---

### Method B: Native VPS Deployment (Ubuntu/Debian)

If deploying directly to a cloud VPS without Docker:
```bash
sudo ./setup_production.sh
```
This automatically configures the Python virtualenv, runs migrations, creates the admin, seeds data, builds Next.js standalone, and provisions `sjis-backend.service`, `sjis-frontend.service`, and `/etc/nginx/sites-available/narinda.sjis.edu.bd`.

---

## 🌐 Production URLs & Endpoints
- **Public Portal**: `https://narinda.sjis.edu.bd`
- **Pro Admin Control Center**: `https://narinda.sjis.edu.bd/admin`
- **Django Admin Console**: `https://narinda.sjis.edu.bd/django-admin/`
- **REST API Diagnostics**: `https://narinda.sjis.edu.bd/api/system-diagnostics/`

## 🔑 Default Administrator Credentials
- **Username**: `admin` (configurable via `DJANGO_SUPERUSER_USERNAME`)
- **Password**: `sjisadmin2026` (configurable via `DJANGO_SUPERUSER_PASSWORD`)
- **Email**: `admin@sjis-narinda.edu.bd`


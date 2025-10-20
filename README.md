# Todo App

Eine moderne Todo-Anwendung. Erstelle, bearbeite und verwalte deine Aufgaben mit Fälligkeitsdaten und Beschreibungen.

## Tech Stack

**Frontend:**

- React 19 + TypeScript
- Tailwind CSS für das Design
- Vite als Build-Tool

**Backend:**

- Node.js + Express + TypeScript
- Prisma ORM mit SQLite Datenbank
- Zod für Validierung

## Schnellstart mit Docker

```bash
# Repository klonen
git clone https://github.com/AlysonRTY/Todoapp-task
cd todo-app

# Mit Docker Compose starten
docker-compose up
```

Das war's! Die App läuft dann auf:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Manueller Start

### Backend

```bash
cd backend
npm install
npm run setup    # Installiert Dependencies, erstellt DB und fügt Beispieldaten hinzu
npm run dev      # Startet den Development Server
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # Startet den Development Server
```

## Projektstruktur

```
├── backend/           # Express API Server
│   ├── src/
│   │   ├── controllers/   # API Controller mit Geschäftslogik
│   │   ├── routes/        # Express Routes
│   │   ├── schemas/       # Zod Validierungsschemas
│   │   └── lib/           # Prisma Client
│   └── prisma/            # Datenbankschema und Migrations
├── frontend/          # React Frontend
│   └── src/
│       ├── components/    # React Komponenten (TaskCard)
│       ├── hooks/         # Custom Hooks (useTasks)
│       └── pages/         # Seiten (Tasks)
└── docker-compose.yml # Docker Setup für beide Services
```

## Features

- Tasks erstellen, bearbeiten und löschen
- Fälligkeitsdaten setzen
- Beschreibungen hinzufügen
- Tasks als erledigt markieren
- Schönes Notizzettel-Design
- Mobile-optimiert
- Inline-Bearbeitung

## Datenbank

Die App nutzt SQLite mit Prisma. Die Datenbank wird automatisch erstellt und mit Beispieldaten gefüllt.

Prisma Studio öffnen (optional):

```bash
cd backend
npm run db:studio
```

# ProjectPedia

Demo site where final-year CS/IT students browse projects and contact us on WhatsApp.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Where to edit

- `lib/config.ts` – brand name, WhatsApp number, email, phone
- `data/projects.ts` – all project data (add/edit projects here)
- `components/demos/` – one interactive demo per project (sample data, no backend).
  When you add a project, add its demo component and an entry in `components/demos/index.ts`.

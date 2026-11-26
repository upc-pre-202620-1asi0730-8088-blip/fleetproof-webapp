# FleetProof Web Application

Aplicaciones Web · 1ASI0730 · NRC 8088 · BLIP.

Aplicacion Vue / Vite, PrimeVue, Pinia e i18n con seis bounded contexts integrados. La versión AV2 usa la API real en C# y PostgreSQL del repositorio `fleetproof-platform`. La API simulada de TB1 se conserva en `fleetproof-mock-platform`. Se conserva el historial original de contribuciones.

## Ejecución

`npm ci`, `npm run dev`, `npm run build`.

## Ramas

- `main`: base estable.
- `develop`: integración mediante PR.
- `feature/fleet-and-report-management`: Sebastian Reyes; Fleet y Report.
- `feature/user-management`: Daniel Palomino; IAM.
- `feature/vehicle-information`: Sebastian Becerra.
- `feature/vehicle-monitoring`: Rodrigo Gómez.
- `feature/subscription-management`: Harrison Payesa.

`develop` integra los modulos del equipo, las rutas y los componentes compartidos. Cada integrante conserva su identidad real en sus commits.

Las versiones se integran en `main` mediante ramas `release/*` (Gitflow). Netlify debe publicar `main`, con `npm run build` y directorio `dist`. Configurar `VITE_FLEETPROOF_API_URL=https://fleetproof-platform.onrender.com/api/v1`, `VITE_AUTH_MODE=real` y la licencia mediante `VITE_PRIME_UI_LICENSE_KEY`, nunca en Git. En local, copiar `.env.example` a `.env.local` y completar los valores allí. Ver `docs/deployment.md`. Pagos, fuentes y notificaciones siguen siendo simulados; las cuentas y los recursos de la aplicación se persisten en PostgreSQL.

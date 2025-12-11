# SecureCommerceApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
make start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build and run the application using Docker:

```bash
make docker-up
```

To stop the Docker containers:

```bash
make docker-down
```

To build the project locally, run:

```bash
make build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
make test
```

## Linting

To run linting checks:

```bash
make lint
```

## Cleaning

To clean the distribution directory:

```bash
make clean
```

## Running in SSR mode

To run the application in Server-Side Rendering (SSR) mode, use the following command:

```bash
npm run serve:ssr:Assessment-Indu
```

This will build the application and start the Node.js server to serve the SSR version.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

### Architecture Decisions

- **Standalone Components:** Fully adopted Angular's standalone component architecture for reduced boilerplate and better tree-shaking.
- **Reactive State with Signals:** Utilized Angular Signals for granular state management (loading, error, data) instead of `NgRx` or `BehaviorSubjects` for simplicity and performance.
- **Server-Side Rendering (SSR):** Configured with `@angular/ssr` and Express. SSR is enabled specifically for the **Product List** page (`/products`) to improve initial load performance. Other routes (Login, Product Detail) use Client-Side Rendering (CSR). The strategy uses **Optimistic SSR**, allowing the server to render the initial HTML structure while the client verifies authentication immediately upon hydration.
- **Containerization:** Added `Dockerfile` and `docker-compose` for consistent deployment environments.
- **Testing:** Migrated to **Vitest** for faster unit test execution and better DX compared to Karma/Jasmine.
- **Tab Synchronization:** Implemented `BroadcastChannel` API in `AuthService` to synchronize authentication state across multiple tabs. If a user logs out in one tab, all other open tabs immediately clear their session and redirect to the login page, preventing security risks from stale sessions.

### Token Handling Approach

Since the backend uses an external mock API (DummyJSON) that does not support issuing secure HttpOnly cookies for this domain, the app uses a simplified token model:

- **User logs in** → token stored in client-side `document.cookie`
- **AuthService** reads the token from the cookie to determine auth status
- **AuthGuard** uses the service to allow or block routes
- **Future calls** from `HttpClient` attach the token from the cookie via an Interceptor

#### What would happen in a real secure implementation?

In production, the recommended approach is:

- Server returns a secure `HttpOnly` cookie
- Frontend cannot read the cookie (by design)
- Frontend calls `/auth/me` on startup to verify the session
- `AuthGuard` relies on server verification rather than local state

This was not implemented because the backend did not support cookie issuance so it remains a noted trade-off.

### External Snippets & Adaptations

- **Cookie Utilities:** `getCookie`, `setCookie`, `deleteCookie` functions are standard implementations adapted from MDN/StackOverflow for TypeScript.
- **Tailwind Setup:** Standard configuration from Tailwind CSS documentation for Angular.
- **Docker Config:** Standard multi-stage build pattern for Angular SSR applications.

### Lighthouse Performance Scores

| Category           | Score  |
| :----------------- | :----- |
| **Performance**    | 🟢 90  |
| **Accessibility**  | 🟢 100 |
| **Best Practices** | 🟢 96  |
| **SEO**            | 🟢 100 |

### Environment Configuration

The application uses environment variables for configuration.

- **.env**: This file is used for local development and contains sensitive or environment-specific variables. It is **ignored by git** for security.
- **.env.example**: This file serves as a template. It contains all the required environment variables with placeholder or default values.

**Setup:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the values in `.env` as needed for your local environment.

**Variables:**

- `API_URL`: The base URL for the backend API.
- `PAGE_SIZE`: Number of items to display per page in lists.
- `LOW_STOCK_THRESHOLD`: Threshold for displaying low stock warnings.

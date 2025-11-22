# SecureCommerceApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
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

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Assessment Notes

### Architecture Decisions

- **Standalone Components:** Fully adopted Angular's standalone component architecture for reduced boilerplate and better tree-shaking.
- **Reactive State with Signals:** Utilized Angular Signals for granular state management (loading, error, data) instead of `NgRx` or `BehaviorSubjects` for simplicity and performance.
- **Server-Side Rendering (SSR):** Configured with `@angular/ssr` and Express. SSR is enabled specifically for the **Product List** page (`/products`) to improve initial load performance. Other routes (Login, Product Detail) use Client-Side Rendering (CSR). The strategy uses **Optimistic SSR**, allowing the server to render the initial HTML structure while the client verifies authentication immediately upon hydration.
- **Containerization:** Added `Dockerfile` and `docker-compose` for consistent deployment environments.
- **Testing:** Migrated to **Vitest** for faster unit test execution and better DX compared to Karma/Jasmine.

### Trade-offs due to timebox

To meet delivery timelines, several architectural simplifications were made:

- **HttpOnly Cookie Flow:** HttpOnly cookie authentication flow was not fully implemented, even though it is the most secure choice for production. The backend would ideally set a secure `HttpOnly`, `SameSite=Strict`, `Secure` cookie for the session token. Because the challenge/project used a dummy JSON API without real server cookie issuance, the implementation fell back to client-side cookie handling.
- **Access Limitations:** Because `HttpOnly` cookies cannot be accessed directly in JavaScript, a proper flow (server-set cookie + `/auth/me` endpoint on page load) was not implemented.
- **Logic Minimization:** Retry, refresh-token, and expiration logic were minimized to keep the initial implementation focused.
- **State Management:** No global state management (signals store / NgRx) was included to avoid unnecessary complexity.
- **Validation:** Input validation and robust API error handling were kept lightweight.

These decisions were made to keep the project within the timebox while still delivering clean, maintainable structure.

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

![Lighthouse Score](image.png)

# **AS Watson – Front-End Technical Assessment**

Build a Secure Mini Commerce Dashboard

## Goal

Create a production-like, maintainable frontend application that demonstrates your ability to work with:

- **Authentication & secure access**
- **Reactive data flows**
- **Architecture & code scalability**
- **User experience & accessibility**
- **Testing mindset**
- **Progressive commit-based development (not big-bang delivery)**

This assignment intentionally simulates real-world frontend challenges in enterprise environments (e.g. Angular + SAP Spartacus style applications).

---

## **Scenario Overview**

You are building a core slice of a commerce dashboard used by authenticated users.

There are two major features:

1. **Authentication & Session Management**
2. **Product Browsing Experience** (only available after login)

You are free to choose how you structure your application; but your architecture should reflect your engineering thinking.

---

# **Functional Requirements**

## **Feature 1: Authentication & Secure Access**

### **User Stories**

- **As a user**, I can sign in with my username and password.
- **As a user who is not signed in**, if I try to access any protected area, I am redirected to the sign-in page.
- **As a signed-in user**, I remain signed in while navigating the application.
- **As a user whose session is no longer valid**, my next request should either recover the session automatically _or_ clearly log me out and bring me back to the sign-in screen.

### **Acceptance Criteria**

| ID            | Criteria                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AC-AUTH-1** | Successful sign-in navigates the user to a protected area. Failed sign-in shows an accessible error.                                                 |
| **AC-AUTH-2** | Attempting to access protected pages without being signed in must not show content. User must be redirected to login.                                |
| **AC-AUTH-3** | All requests to protected APIs must be authenticated **without requiring each call site to manually add credentials**.                               |
| **AC-AUTH-4** | If a protected request fails due to expired session, the app attempts a recovery flow once. If recovery fails, the user is logged out automatically. |
| **AC-AUTH-5** | No sensitive data is exposed in the UI or logs.                                                                                                      |

---

## **Feature 2: Product Listing & Details (Protected)**

### **User Stories**

- **As a signed-in user**, I can browse products.
- **As a user**, I can search, sort, and filter products interactively without page reloads.
- **As a user**, When I type quickly in the search field, I should always see results that match my latest input, even if earlier requests return slower. I should never see outdated results.
- **As a user**, I can click a product and see its details in a new page.
- **As a user**, I see proper loading states and helpful messages if there are no results or an error.

### **Acceptance Criteria**

| ID            | Criteria                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **AC-PROD-1** | Products page is **not accessible** (should be protected) unless logged in.                                                         |
| **AC-PROD-2** | Search requests are not fired for every keystroke. UI must use intelligent request management (debounce, cancel outdated requests). |
| **AC-PROD-3** | Filtering, sorting, and pagination work together and reflect correct results.                                                       |
| **AC-PROD-4** | A product detail page is accessible via route param and displays item data.                                                         |
| **AC-PROD-5** | UI must show loading, empty, and error states cleanly.                                                                              |

---

## **API Documentation**

You are required to use the following documentation as the source of truth:

👉 API Documentation: https://dummyjson.com/

Please read the documentation carefully to understand:

- how authentication works
- how to retrieve products
- how tokens must be passed to protected endpoints
- how search, filtering, and pagination are supported

All behavior described in the User Stories and Acceptance Criteria must be implemented according to how this API behaves.

## **Non-Functional Requirements**

### 🔷 Code Structure & Maintainability

- Code is modular, maintainable, and future-proof. Reusable patterns are preferred over one-off implementations.
- Use reactive patterns for UI state (avoid manual refresh or nested subscriptions).

### 🔷 Performance & UX

- Avoid unnecessary re-renders or redundant API calls. Search functionality must be cancellable.

### 🔷 Accessibility

- Only the login page is enough to be fully accessible (WCAG).

### 🔷 Type Safety

- Use strong typing throughout the application. Avoid 'any' unless clearly justified.

### 🔷 Testing

Include **at least** two meaningful tests:

- One pure function or utility test
- One component or behavioral test validating UI logic

### 🔷 Commit & Delivery Expectations

- You are expected to **commit and push progressively**.
- Show your **thinking process** through meaningful commit messages.
- Avoid a single “final commit.”

---

# **Suggested App Structure (Optional)**

```
src/
  app/
    auth/        (login + session handling)
    products/    (list, detail, state)
    shared/      (common utilities, models, helpers)
    core/        (API client, session handling, global behavior)
```

_This is only illustrative. Use your own structure if it reflects good architectural choices._

---

# What We Will Evaluate

| Area                  | What We're Looking For                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Architecture**      | Clear separation of concerns, scalable layout                                                                                                |
| **Security**          | Professional handling of tokens & session errors                                                                                             |
| **Reactive Thinking** | Proper RxJS usage with cancellation and composition                                                                                          |
| **Code Quality**      | Strict typing, readability, maintainability                                                                                                  |
| **Commit Hygiene**    | Progressive development, meaningful messages                                                                                                 |
| **Testing Mindset**   | Tests that reflect behavior and intention                                                                                                    |
| **Ownership**         | Decisions justified in README (token storage, UI flow, trade-offs)                                                                           |
| **UI/Styling**        | This is not a visual design challenge. However, the application should reflect professional engineering standards in frontend implementation |

---

# Submission Instructions

- Work directly in this repository.
- Commit and push regularly with clear messages.
- When finished, include a short note in your final commit:

  - What works
  - Known limitations
  - What you’d do next with more time

# README Expectations

Add a short section to your own README (Don't modify this README):

- Architecture decisions
- Trade-offs due to timebox
- Token handling approach
- If you used external snippets, credit the source and explain your adaptation

If you have any issues or questions, feel free to reach out to me: a.razavi@nl.aswatson.com

# Secure Commerce App

This repository contains the source code and infrastructure configuration for the Secure Commerce App.

## Project Structure

- **[frontend/](./frontend/)**: The Angular application source code, including Docker configuration and CI/CD workflows.
- **[infrastructure/](./infrastructure/)**: Infrastructure as Code (IaC) using Terraform and Ansible to deploy the application to AWS.
- **[scripts/](./scripts/)**: Contains all the setup scripts used from the Makefile

## Getting Started

### Frontend

Navigate to the `frontend` directory to work on the frontend application code:

#### Development server

To start a local development server, run:

```bash
make start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

#### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

#### Building

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

#### Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
make test
```

#### Linting

To run linting checks:

```bash
make lint
```

#### Cleaning

To clean the distribution directory:

```bash
make clean
```

#### Running in SSR mode

To run the application in Server-Side Rendering (SSR) mode, use the following command:

```bash
npm run serve:ssr:Assessment-Indu
```

This will build the application and start the Node.js server to serve the SSR version.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

#### Architecture Decisions

- **Standalone Components:** Fully adopted Angular's standalone component architecture for reduced boilerplate and better tree-shaking.
- **Reactive State with Signals:** Utilized Angular Signals for granular state management (loading, error, data) instead of `NgRx` or `BehaviorSubjects` for simplicity and performance.
- **Server-Side Rendering (SSR):** Configured with `@angular/ssr` and Express. SSR is enabled specifically for the **Product List** page (`/products`) to improve initial load performance. Other routes (Login, Product Detail) use Client-Side Rendering (CSR). The strategy uses **Optimistic SSR**, allowing the server to render the initial HTML structure while the client verifies authentication immediately upon hydration.
- **Containerization:** Added `Dockerfile` and `docker-compose` for consistent deployment environments.
- **Testing:** Migrated to **Vitest** for faster unit test execution and better DX compared to Karma/Jasmine.
- **Tab Synchronization:** Implemented `BroadcastChannel` API in `AuthService` to synchronize authentication state across multiple tabs. If a user logs out in one tab, all other open tabs immediately clear their session and redirect to the login page, preventing security risks from stale sessions.

#### Trade-offs due to timebox

To meet delivery timelines, several architectural simplifications were made:

- **HttpOnly Cookie Flow:** HttpOnly cookie authentication flow was not fully implemented, even though it is the most secure choice for production. The backend would ideally set a secure `HttpOnly`, `SameSite=Strict`, `Secure` cookie for the session token. Because the challenge/project used a dummy JSON API without real server cookie issuance, the implementation fell back to client-side cookie handling.
- **Access Limitations:** Because `HttpOnly` cookies cannot be accessed directly in JavaScript, a proper flow (server-set cookie + `/auth/me` endpoint on page load) was not implemented.
- **Logic Minimization:** Retry, refresh-token, and expiration logic were minimized to keep the initial implementation focused.
  - _Improvement:_ Implement silent refresh (pre-emptive token renewal), exponential backoff for retries, and request queueing during refresh cycles.
- **State Management:** No global state management (signals store / NgRx) was included to avoid unnecessary complexity.
- **Validation:** Input validation and robust API error handling were kept lightweight.

These decisions were made to keep the project within the timebox while still delivering clean, maintainable structure.

#### Token Handling Approach

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

#### External Snippets & Adaptations

- **Cookie Utilities:** `getCookie`, `setCookie`, `deleteCookie` functions are standard implementations adapted from MDN/StackOverflow for TypeScript.
- **Tailwind Setup:** Standard configuration from Tailwind CSS documentation for Angular.
- **Docker Config:** Standard multi-stage build pattern for Angular SSR applications.

#### Environment Configuration

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

#### CI/CD Pipeline

A Continuous Integration (CI) pipeline is configured using GitHub Actions. It runs automatically on every push to the `main` and `feature/*` branches, as well as on pull requests.

The pipeline performs the following checks:

1.  **Install Dependencies:** Installs project dependencies using `npm ci`.
2.  **Linting:** Runs `npm run lint` to ensure code quality and adherence to coding standards.
3.  **Unit Tests:** Runs `npm run test` (using Vitest) to verify application logic.

This ensures that all code changes are validated before being merged, maintaining the stability and quality of the codebase.

#### Lighthouse Performance Scores

| Category           | Score  |
| :----------------- | :----- |
| **Performance**    | 🟢 90  |
| **Accessibility**  | 🟢 100 |
| **Best Practices** | 🟢 96  |
| **SEO**            | 🟢 100 |

### Infrastructure

created the basic infrastructure creation process to deploy this app in AWS using the basic VPC and other network security, EC2, ALB, CLOUDFRONT.

- To automate the dev infra creation, I used the terraform as IAC(Infrastructure as a code) and used Ansible as configuration management tool.

- Navigate to the `infrastructure` directory to manage AWS resources:

- To create infra in AWS, do the aws configure(To setup the AWS credentials) and run

```bash
make deploy
```

- To delete infra in AWS, do the aws configure(To setup the AWS credentials) and run

```bash
make destroy
```

### scripts

The scripts directory is to make users/developers life easy to perform the code setup on local machine.

- To setup the local machine run

```bash
make setup-local
```

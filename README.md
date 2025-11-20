# **AS Watson – Front-End Technical Assessment**

Build a Secure Mini Commerce Dashboard

## Goal

Create a production-like, maintainable frontend application that demonstrates your ability to work with:

* **Authentication & secure access**
* **Reactive data flows**
* **Architecture & code scalability**
* **User experience & accessibility**
* **Testing mindset**
* **Progressive commit-based development (not big-bang delivery)**

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

* **As a user**, I can sign in with my username and password.
* **As a user who is not signed in**, if I try to access any protected area, I am redirected to the sign-in page.
* **As a signed-in user**, I remain signed in while navigating the application.
* **As a user whose session is no longer valid**, my next request should either recover the session automatically *or* clearly log me out and bring me back to the sign-in screen.

### **Acceptance Criteria**

| ID            | Criteria                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AC-AUTH-1** | Successful sign-in navigates the user to a protected area. Failed sign-in shows an accessible error.                                                 |
| **AC-AUTH-2** | Attempting to access protected pages without being signed in must not show content. User must be redirected to login.                                |
| **AC-AUTH-3** | All requests to protected APIs must be authenticated **without requiring each call site to manually add credentials**.                               |
| **AC-AUTH-4** | If a protected request fails due to expired session, the app attempts a recovery flow once. If recovery fails, the user is logged out automatically. |
| **AC-AUTH-5** | No sensitive data is exposed in the UI or logs.                                              |

---

## **Feature 2: Product Listing & Details (Protected)**

### **User Stories**

* **As a signed-in user**, I can browse products.
* **As a user**, I can search, sort, and filter products interactively without page reloads.
* **As a user**, When I type quickly in the search field, I should always see results that match my latest input, even if earlier requests return slower. I should never see outdated results.
* **As a user**, I can click a product and see its details in a new page.
* **As a user**, I see proper loading states and helpful messages if there are no results or an error.

### **Acceptance Criteria**

| ID            | Criteria                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **AC-PROD-1** | Products page is **not accessible** (should be protected) unless logged in.                                                                               |
| **AC-PROD-2** | Search requests are not fired for every keystroke. UI must use intelligent request management (debounce, cancel outdated requests). |
| **AC-PROD-3** | Filtering, sorting, and pagination work together and reflect correct results.                                                       |
| **AC-PROD-4** | A product detail page is accessible via route param and displays item data.                                                         |
| **AC-PROD-5** | UI must show loading, empty, and error states cleanly.                                                                              |

---


## **API Documentation**

You are required to use the following documentation as the source of truth:

👉 API Documentation: https://dummyjson.com/

Please read the documentation carefully to understand:

* how authentication works
* how to retrieve products
* how tokens must be passed to protected endpoints
* how search, filtering, and pagination are supported

All behavior described in the User Stories and Acceptance Criteria must be implemented according to how this API behaves.

## **Non-Functional Requirements**

### 🔷 Code Structure & Maintainability

* Code is modular, maintainable, and future-proof. Reusable patterns are preferred over one-off implementations.
* Use reactive patterns for UI state (avoid manual refresh or nested subscriptions).

### 🔷 Performance & UX

* Avoid unnecessary re-renders or redundant API calls. Search functionality must be cancellable.

### 🔷 Accessibility

* Only the login page is enough to be fully accessible (WCAG).
  
### 🔷 Type Safety

* Use strong typing throughout the application. Avoid 'any' unless clearly justified.

### 🔷 Testing

Include **at least** two meaningful tests:

* One pure function or utility test
* One component or behavioral test validating UI logic

### 🔷 Commit & Delivery Expectations

* You are expected to **commit and push progressively**.
* Show your **thinking process** through meaningful commit messages.
* Avoid a single “final commit.”

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

*This is only illustrative. Use your own structure if it reflects good architectural choices.*

---

# What We Will Evaluate

| Area                  | What We're Looking For                                             |
| --------------------- | ------------------------------------------------------------------ |
| **Architecture**      | Clear separation of concerns, scalable layout                      |
| **Security**          | Professional handling of tokens & session errors                   |
| **Reactive Thinking** | Proper RxJS usage with cancellation and composition                |
| **Code Quality**      | Strict typing, readability, maintainability                        |
| **Commit Hygiene**    | Progressive development, meaningful messages                       |
| **Testing Mindset**   | Tests that reflect behavior and intention                          |
| **Ownership**         | Decisions justified in README (token storage, UI flow, trade-offs) |
| **UI/Styling**        | This is not a visual design challenge. However, the application should reflect professional engineering standards in frontend implementation |

---

# Submission Instructions

* Work directly in this repository.
* Commit and push regularly with clear messages.
* When finished, include a short note in your final commit:

  * What works
  * Known limitations
  * What you’d do next with more time

 # README Expectations

Add a short section to your own README (Don't modify this README):

* Architecture decisions
* Trade-offs due to timebox
* Token handling approach
* If you used external snippets, credit the source and explain your adaptation

If you have any issues or questions, feel free to reach out to me: a.razavi@nl.aswatson.com

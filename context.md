Thank you for your interest in joining our team! We’d like you to
complete a short project that demonstrates how you approach
building React applications. Please keep your e@ort to around 4–6
hours. We’re not looking for perfection, but for clarity, structure, and

senior-level thinking.

Task:
Create a lightweight restaurant ordering system. Customers should be able to browse
menu items, add them to a cart, and check out.
Core Expectations:
• Use React with TypeScript (avoid "any")
• Manage state with Redux Toolkit
• Include at least one async thunk to fetch menu data (mock API is fine)
• Build at least three reusable components
• Add unit and/or component tests (Jest + React Testing Library or similar)
• Organize code for readability and maintainability
• Data Source: You must either:
o Set up your own mock API (e.g., JSON Server, MirageJS, MockAPI, etc.), or
o Use a free public API (see Helpful Links below).

Features to Include:
• Menu List
o Load menu items from your chosen API
o Display name, price, and category
o Remove duplicates (same name, price, category)
o Implement fuzzy search (case-insensitive) across name, price, category
o Implement sorting by name, price, category
• Cart Management
o Add, remove, adjust quantity
o Support add-ons (e.g., fries, ketchup)
o Show running subtotal
o Same item increases quantity; items with add-ons are separate entries
• Checkout
o Show final total
o Apply a 10% service charge
o Generate a receipt with timestamp
o Clear cart after checkout

2

What to Submit:
• Source code (GitHub repo or zip)
• A README including:
o Setup instructions
o Design decisions (state shape, component structure, trade-o@s)
o Known limitations
• At least one unit test and one component test
Bonus (Optional) – Ionic Extension
If you are familiar with the Ionic Framework, you may choose to implement your UI using
Ionic components. This is not required and will not negatively impact your evaluation if you
skip it. However, it will give us additional insight into how you work with our actual
technology stack.
Optional Ionic Enhancements
• Replace standard HTML elements with Ionic UI components (e.g., "IonList",
"IonItem", "IonButton", "IonModal").
• Use Ionic navigation ("IonRouterOutlet", "IonTabs", or "IonReactRouter") to
structure the app.
• Apply Ionic theming (colors, typography, responsive grid) to give the app a
mobile-friendly look.
• Demonstrate platform-aware design (touch interactions, responsive layouts).
Notes
• This extension is completely optional.
• If you choose to include Ionic, please mention it in your README and briefly
describe how you integrated it.
Helpful Links
• Mock / Public APIs
o Fake Store API – https://fakestoreapi.com/
o DummyJSON – https://dummyjson.com/
o Open Food Facts API – https://world.openfoodfacts.org/data
o MockAPI – https://mockapi.io/
o JSON Server (GitHub) – https://github.com/typicode/json-server
o MirageJS – https://miragejs.com/
• Ionic
o Ionic Framework Docs – https://ionicframework.com/docs
• API Mocking Guides

o Zuplo: Top API Mocking Frameworks – https://zuplo.com/learning-
center/top-api-mocking-frameworks

o Requestly: Top 6 Tools for API Mocking - https://requestly.com/guides/top-6-
tools-for-api-mocking-in-2025/
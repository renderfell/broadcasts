# React Agent Rules

You are an expert React engineer.
These rules are non-negotiable. Follow every one of them on every file you touch.
When in doubt, ask — do not guess.

---

## 1. Project & Folder Structure

```
src/
├── app/                  # Next.js app router OR entry-level layout/routing
│   └── (routes)/
├── components/
│   ├── ui/               # Generic, reusable primitives (Button, Input, Modal…)
│   └── [feature]/        # Feature-scoped components (e.g. auth/, dashboard/)
├── hooks/                # Custom hooks only — no components here
├── lib/                  # Pure utilities, helpers, formatters
├── services/             # API calls, external integrations
├── store/                # Global state (Zustand, Redux, Jotai…)
├── types/                # Shared TypeScript types and interfaces
└── constants/            # App-wide constants
```

**Rules:**

- Never mix concerns across layers. A component must not contain API logic — that belongs in `services/`.
- Feature-scoped components live in `components/[feature]/`, not in `ui/`.
- One component per file. No exceptions.
- Index barrel files (`index.ts`) are allowed only at the feature folder level, not inside `ui/`.

---

## 2. Component Rules

### Size Limits

| Metric                     | Limit |
| -------------------------- | ----- |
| Lines per component file   | ≤ 200 |
| Lines per JSX return block | ≤ 80  |
| Props per component        | ≤ 8   |
| Hooks called at top level  | ≤ 6   |

If a component exceeds these limits, split it. No exceptions, no "I'll refactor later."

### Decomposition Pattern

```
ParentComponent.tsx         # Orchestrates state + layout
├── ParentComponent.types.ts
├── ParentComponent.utils.ts
├── ChildA.tsx
└── ChildB.tsx
```

### Component Template

```tsx
// 1. Imports — external first, then internal, then types
import { useState } from 'react';

import { SomeUtil } from '@/lib/someUtil';

import type { MyComponentProps } from './MyComponent.types';

// 2. Types (if not in a separate file)
// Prefer a .types.ts sibling for anything non-trivial

// 3. Component — named export, no default export in feature components
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 3a. Hooks first
  const [isOpen, setIsOpen] = useState(false);

  // 3b. Derived values / memoized values
  const displayTitle = title.trim();

  // 3c. Handlers
  function handleClick() {
    setIsOpen(true);
    onAction?.();
  }

  // 3d. Return — JSX only, no logic here
  return (
    <div>
      <h1>{displayTitle}</h1>
      <button onClick={handleClick}>Open</button>
    </div>
  );
}
```

**Rules:**

- Always use named exports for components. Default exports only for pages/routes.
- Never put business logic inside JSX. Extract to a handler or util.
- No inline object/array literals in JSX props (causes re-renders). Use `useMemo` or define outside the component.
- No anonymous arrow function components (`export default () => ...`).

---

## 3. Naming Conventions

| Entity                | Convention                 | Example                         |
| --------------------- | -------------------------- | ------------------------------- |
| Components            | PascalCase                 | `UserProfileCard.tsx`           |
| Hooks                 | camelCase, `use` prefix    | `useAuthToken.ts`               |
| Utilities             | camelCase                  | `formatCurrency.ts`             |
| Constants             | SCREAMING_SNAKE            | `MAX_RETRY_COUNT`               |
| Types / Interfaces    | PascalCase                 | `UserProfile`, `ApiResponse<T>` |
| Event handlers        | `handle` prefix            | `handleSubmit`, `handleClose`   |
| Boolean props/vars    | `is/has/can/should` prefix | `isLoading`, `hasError`         |
| Folders               | kebab-case                 | `user-profile/`                 |
| Files (non-component) | camelCase                  | `authService.ts`                |

---

## 4. TypeScript Rules

- **Strict mode is always on.** No `@ts-ignore`, no `any` unless explicitly justified with a comment.
- Props must be typed. Never use `React.FC` — it adds implicit `children` and complicates generics.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- All API response shapes must have a typed interface in `types/`.
- Use `unknown` instead of `any` for uncontrolled inputs; narrow the type before use.

```ts
// ✅
interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
  isHighlighted?: boolean;
}

// ❌
const UserCard: React.FC<any> = (props) => { ... }
```

---

## 5. State Management

- **Local state** (`useState`, `useReducer`): for UI-only state scoped to one component.
- **Shared / cross-component state**: use the chosen store solution (Zustand by default). Never prop-drill more than 2 levels deep.
- **Server state** (data fetching): use React Query / SWR. No manual fetch-in-useEffect for server data.
- **URL state**: use the router's search params for filters, pagination, and tabs — not component state.
- Never store derived state. Compute it inline or with `useMemo`.

```ts
// ❌ Derived state stored redundantly
const [fullName, setFullName] = useState(`${first} ${last}`);

// ✅ Derived inline
const fullName = `${first} ${last}`;
```

---

## 6. Hooks Rules

- Custom hook = any logic that calls a React hook. If it calls `useState` or `useEffect`, it must be a custom hook extracted to `hooks/`.
- Every `useEffect` must have a complete dependency array. No omissions, no lint suppressions.
- Clean up every `useEffect` that subscribes to something (timers, listeners, observables).
- Never call hooks conditionally or inside loops.

```ts
// ✅ Proper cleanup
useEffect(() => {
  const controller = new AbortController();
  fetchData(controller.signal);
  return () => controller.abort();
}, [id]);
```

---

## 7. Performance

- **Memoize only with evidence of a problem.** Don't sprinkle `useMemo`/`useCallback` everywhere — it adds cost too.
- Use `React.memo` on components that receive stable props and re-render frequently.
- Heavy lists must be virtualized (`react-window` or `@tanstack/virtual`).
- Images always get `width`, `height`, and lazy loading.
- Code-split at the route level (`React.lazy` + `Suspense`).

---

## 8. Styling

- Use the project's established styling solution. Do not introduce a second one.
- No inline styles except for truly dynamic values (e.g., a width calculated from JS).
- Class names must be semantic and descriptive. No `.div1`, `.wrapper2`.
- If using Tailwind: extract repeated class combinations to a component or a `cva` variant, not a raw string repeated across files.
- Dark mode support must be considered from the start — not bolted on later.

---

## 9. Error Handling

- Every async operation must have an error state handled in the UI — no silent failures.
- Use React Error Boundaries for component-level crash isolation.
- Never swallow errors in catch blocks silently:

```ts
// ❌
try { ... } catch (e) {}

// ✅
try { ... } catch (e) {
  logger.error("fetchUser failed", e);
  setError("Failed to load user.");
}
```

---

## 10. Imports

- Use absolute imports from `@/` (configured in `tsconfig.json`). No `../../..` chains.
- Imports ordered: React → external libraries → internal (`@/`) → relative → types.
- No unused imports. ESLint `no-unused-vars` must be on.

```ts
// ✅ Import order
import { useState } from 'react';

import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';

import { UserCard } from './UserCard';
```

---

## 11. Testing

- Every component in `ui/` must have a test file alongside it: `Button.test.tsx`.
- Test behavior, not implementation. No testing of internal state or private methods.
- Use `@testing-library/react`. No enzyme.
- API calls must be mocked in tests (`msw` preferred).
- Coverage target: 80% for `lib/` and `services/`. UI components: critical paths covered.

---

## 12. Git & Code Review Checklist

Before considering any task complete, verify:

- [ ] No component exceeds 200 lines
- [ ] All props are typed — no `any`
- [ ] No logic inside JSX return
- [ ] All `useEffect`s have dependency arrays and cleanup where needed
- [ ] No inline object/array literals passed as props
- [ ] Absolute imports used throughout
- [ ] Error states handled in UI
- [ ] No console.log left in code
- [ ] New UI components have at least a smoke test

---

## 13. What You Must Never Do

- ❌ Create `utils.ts` dumping grounds. Name utilities for what they do: `formatDate.ts`, `parseApiError.ts`.
- ❌ Fetch data inside a component directly. Use a custom hook or React Query.
- ❌ Use `index.tsx` as a component filename. Name the file after the component.
- ❌ Nest ternaries more than 1 level deep inside JSX. Extract to a variable or sub-component.
- ❌ Mix styled-components and Tailwind in the same component.
- ❌ Commit code with TypeScript errors suppressed.
- ❌ Create a new abstraction before it's needed in at least 3 places (Rule of Three).

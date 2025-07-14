// 1. Foundational Differences: TypeScript Enhancements for JavaScript
// Analogy: Think of JavaScript as a freeform sketch and TypeScript as an architectural blueprint. TypeScript adds structure and predictability, catching errors at compile-time.

// Types: Define variable shapes explicitly
type UserRole = 'admin' | 'user' | 'guest'; // Union type for specific values
interface User {
  id: number;
  name: string;
  role: UserRole;
}

// Interfaces: Define object structures, great for props
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Enums: Useful for fixed sets of values, e.g., app states
enum AppStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

// Generics: Reusable types with flexibility, like a function template
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// React Use Case: Typing a Todo list component
import React from 'react';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      {todo.text}
    </li>
  );
};

// 2. React with TypeScript: Typing Core React Features
// Analogy: Types are like contracts for your components, ensuring props and state adhere to expected shapes.

// Props: Use interfaces or types for props
interface CounterProps {
  initialCount?: number; // Optional prop
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = React.useState<number>(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// State with useState: Explicitly type state
interface UserState {
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = React.useState<UserState>({ name: '', email: '' });

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
    </div>
  );
};

// Refs: Type refs for DOM elements or values
const InputFocus: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
};

// useContext: Type the context value
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const ThemeToggle: React.FC = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('ThemeToggle must be used within ThemeProvider');

  return (
    <button onClick={context.toggleTheme}>
      Toggle to {context.theme === 'light' ? 'dark' : 'light'}
    </button>
  );
};

// useReducer: Type state and actions
interface CounterState {
  count: number;
}

type CounterAction = { type: 'increment' } | { type: 'decrement' };

const reducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const CounterWithReducer: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
};

// Custom Hook: Type inputs and outputs
function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data: T) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// 3. Best Practices: Scalable TypeScript Patterns
// Analogy: Think of TypeScript as a city planner for your codebase—organizing components, APIs, and forms for scalability.

// Type-Safe API Responses
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

interface UserApiResponse {
  users: User[];
}

const fetchUsers = async (): Promise<ApiResponse<UserApiResponse>> => {
  const response = await fetch('/api/users');
  return response.json();
};

// Form Handling with Discriminated Unions
type FormState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: User; error: null }
  | { status: 'error'; data: null; error: string };

const FormComponent: React.FC = () => {
  const [formState, setFormState] = React.useState<FormState>({ status: 'idle', data: null, error: null });

  const handleSubmit = async () => {
    setFormState({ status: 'loading', data: null, error: null });
    try {
      const response = await fetchUsers();
      setFormState({ status: 'success', data: response.data.users[0], error: null });
    } catch {
      setFormState({ status: 'error', data: null, error: 'Failed to fetch' });
    }
  };

  return (
    <div>
      {formState.status === 'loading' && <p>Loading...</p>}
      {formState.status === 'success' && <p>Welcome, {formState.data.name}!</p>}
      {formState.status === 'error' && <p>Error: {formState.error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

// Error Boundaries
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Type Guard: Narrow types safely
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj && 'role' in obj;
}

const processUser = (data: unknown) => {
  if (isUser(data)) {
    console.log(data.name); // Type-safe access
  }
};

// 4. Advanced Concepts: Utility Types, Generics, Conditional Types
// Analogy: These are like power tools in your React workshop—use them to craft precise, reusable components.

// Utility Types
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<UserProfile>; // All properties optional
type UserId = Pick<UserProfile, 'id'>; // Only 'id' property
type UserRecord = Record<string, User>; // Key-value pairs of users

// Generics in Components
interface DataTableProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const DataTable = <T,>({ items, renderItem }: DataTableProps<T>) => {
  return (
    <table>
      <tbody>{items.map((item, index) => <tr key={index}>{renderItem(item)}</tr>)}</tbody>
    </table>
  );
};

// Usage
const UserTable: React.FC = () => {
  const users: User[] = [{ id: 1, name: 'Alice', role: 'admin' }];
  return <DataTable items={users} renderItem={(user) => <td>{user.name}</td>} />;
};

// Conditional Types
type NonEmptyArray<T> = T[] & { 0: T };
interface PropsWithChildren {
  children: NonEmptyArray<React.ReactNode>;
}

// Module Augmentation: Extend third-party library types
declare module 'third-party-lib' {
  interface SomeInterface {
    newMethod(): void;
  }
}

// 5. Common Pitfalls
// - Overusing 'any': Avoid `any` as it defeats TypeScript's purpose. Use `unknown` and type guards instead.
// - Ignoring strict mode: Enable `strict` in tsconfig.json to catch more errors.
// - Third-party libraries: Use `@types` packages (e.g., `@types/react`) or write custom declaration files.
// - Overcomplicating types: Keep types simple and focused. Avoid overly nested interfaces.

// 6. Tooling & Config
// tsconfig.json: Key options for React projects
const tsConfig = {
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx", // Modern JSX transform
    "strict": true, // Enable all strict type-checking options
    "esModuleInterop": true, // Better JS interoperability
    "moduleResolution": "node",
    "baseUrl": "src",
    "paths": {
      "@components/*": ["components/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
};

// Linting: Use ESLint with @typescript-eslint/parser
// Editor: VS Code with TypeScript extension for IntelliSense and error highlighting
// Type Checking: Run `tsc --noEmit` to check types without emitting JS

// 7. Practical Migration
// Steps to migrate a JavaScript React codebase to TypeScript:
// 1. Add TypeScript: `npm install typescript @types/react @types/react-dom`
// 2. Create tsconfig.json: Use the above config as a starting point
// 3. Rename files: Change .js/.jsx to .ts/.tsx gradually
// 4. Start with simple components: Add basic prop types
// 5. Use 'any' sparingly: Replace with proper types as you refactor
// 6. Add types for APIs: Define interfaces for API responses
// 7. Test incrementally: Run `tsc` and fix errors component by component
// 8. Enable strict mode: Gradually enable strict options in tsconfig.json

// Example: Migrating a JS component to TS
// Before (JS):
/*
function UserCard({ user, onClick }) {
  return (
    <div onClick={() => onClick(user.id)}>
      <p>{user.name}</p>
    </div>
  );
}
*/

// After (TS):
interface UserCardProps {
  user: User;
  onClick: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div onClick={() => onClick(user.id)}>
      <p>{user.name}</p>
    </div>
  );
};

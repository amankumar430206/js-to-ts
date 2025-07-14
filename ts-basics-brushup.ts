// TypeScript Prerequisite Guide for Experienced React Developers
// Purpose: Quick revision of TypeScript basics for React developers with 5+ years of JS experience.

// 1. Basic Types
// Analogy: Types are like ingredient labels in a recipe—ensuring you use the right data.

// Primitive Types
const count: number = 42;
const name: string = 'Alice';
const isActive: boolean = true;
const id: symbol = Symbol('id');
const userId: bigint = 123n;

// Arrays and Tuples
const numbers: number[] = [1, 2, 3];
const userTuple: [string, number] = ['Bob', 30]; // Fixed-length, typed array

// Any and Unknown
const flexible: any = 42; // Avoid: disables type checking
const safe: unknown = 42; // Safer: requires type checking before use
if (typeof safe === 'number') {
  console.log(safe + 1); // Type-safe
}

// 2. Interfaces and Types
// Analogy: Interfaces are like component contracts, defining prop shapes.

// Interface for Objects
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest'; // Union type
}

// Type Alias: Alternative to interfaces
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// Extending Interfaces
interface AdminUser extends User {
  permissions: string[];
}

const admin: AdminUser = { id: 1, name: 'Alice', role: 'admin', permissions: ['read', 'write'] };

// 3. Functions and Type Inference
// Analogy: Functions with types are like APIs with clear input/output expectations.

// Function Types
const add: (a: number, b: number) => number = (a, b) => a + b;

// Optional and Default Parameters
interface UserProfileProps {
  name: string;
  age?: number; // Optional
}

const UserProfile: React.FC<UserProfileProps> = ({ name, age = 18 }) => {
  return <p>{name}, {age}</p>;
};

// 4. Generics
// Analogy: Generics are like reusable molds for casting different data shapes.

// Generic Function
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst<number>([1, 2, 3]); // 1
const firstString = getFirst(['a', 'b', 'c']); // 'a'

// Generic Component
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
const users: User[] = [{ id: 1, name: 'Alice', role: 'admin' }];
const UserTable: React.FC = () => (
  <DataTable items={users} renderItem={(user) => <td>{user.name}</td>} />
);

// 5. Enums and Union Types
// Analogy: Enums and unions are like predefined menu options, limiting choices to valid ones.

// Enum
enum AppStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

const status: AppStatus = AppStatus.Loading;

// Union Type
type Status = 'idle' | 'loading' | 'error';
const currentStatus: Status = 'loading';

// 6. Type Guards and Narrowing
// Analogy: Type guards are like ID checks, ensuring data matches expected types.

function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
}

const processData = (data: unknown) => {
  if (isUser(data)) {
    console.log(data.name); // Type-safe
  }
};

// 7. React-Specific Typing
// Analogy: Typing React components is like defining a blueprint for your UI building blocks.

// Props
interface TodoProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoProps> = ({ todo, toggleTodo }) => {
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

// State
const Counter: React.FC = () => {
  const [count, setCount] = React.useState<number>(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

// Event Handlers
const InputField: React.FC = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return <input onChange={handleChange} />;
};

// Refs
const InputFocus: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <input ref={inputRef} />;
};

// 8. Utility Types
// Analogy: Utility types are like pre-built tools for common type manipulations.

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<UserProfile>; // All properties optional
type UserId = Pick<UserProfile, 'id'>; // Only 'id'
type UserMap = Record<string, User>; // Key-value pairs

const partialUser: PartialUser = { name: 'Alice' };
const userId: UserId = { id: 1 };
const userMap: UserMap = { '1': { id: 1, name: 'Alice', role: 'admin' } };

// 9. Common React Patterns
// Analogy: These patterns are like your go-to React recipes, now type-safe.

// Custom Hook
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

// Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const ThemeToggle: React.FC = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('ThemeToggle must be used within ThemeProvider');
  return <button onClick={context.toggleTheme}>Toggle {context.theme}</button>;
};

// 10. tsconfig.json Basics
// Analogy: tsconfig.json is like the settings for your TypeScript compiler, ensuring your code is checked correctly.

const tsConfig = {
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true, // Enforces strict type-checking
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
};

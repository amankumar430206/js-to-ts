// Advanced TypeScript Guide for Elite React Developers
// Purpose: Master efficient, minimal TypeScript code for scalable React applications.

// 1. Advanced Generics: Reusable, Type-Safe Components
// Analogy: Generics are like modular LEGO bricks—build once, use with any shape.
interface DataGridProps<T extends Record<string, any>> {
  items: T[];
  columns: Array<keyof T>;
  renderCell: (item: T, key: keyof T) => React.ReactNode;
}

// Minimal generic component
const DataGrid = <T extends Record<string, any>>({ items, columns, renderCell }: DataGridProps<T>) => (
  <table>
    <thead>
      <tr>{columns.map((col) => <th key={String(col)}>{String(col)}</th>)}</tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={index}>{columns.map((col) => <td key={String(col)}>{renderCell(item, col)}</td>)}</tr>
      ))}
    </tbody>
  </table>
);

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];
const UserGrid: React.FC = () => (
  <DataGrid items={users} columns={['id', 'name', 'email']} renderCell={(item, key) => item[key]} />
);

// Tip: Use `extends Record<string, any>` for flexible object types, minimizing type boilerplate.

// 2. Conditional Types: Dynamic Type Logic
// Analogy: Conditional types are like a decision tree, selecting types based on conditions.
type NonEmptyArray<T> = T[] & { 0: T }; // Ensures array is non-empty
type ElementType<T> = T extends NonEmptyArray<infer U> ? U : never;

// Example: Extract element type from array
type UserArray = NonEmptyArray<User>;
type UserType = ElementType<UserArray>; // User

// React usage: Conditionally typed props
type InputProps<T extends 'text' | 'number'> = {
  type: T;
  value: T extends 'number' ? number : string;
  onChange: (value: T extends 'number' ? number : string) => void;
};

const Input = <T extends 'text' | 'number'>({ type, value, onChange }: InputProps<T>) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange((type === 'number' ? Number(e.target.value) : e.target.value) as any)}
  />
);

// Usage
const NumberInput: React.FC = () => <Input type="number" value={42} onChange={(val) => console.log(val)} />;

// Tip: Use `infer` in conditional types to extract subtypes, reducing redundant type definitions.

// 3. Mapped Types: Dynamic Type Creation
// Analogy: Mapped types are like a factory line, generating types from existing ones.
type ReadOnlyUser = { readonly [K in keyof User]: User[K] }; // All properties readonly
type OptionalUser = { [K in keyof User]?: User[K] }; // All properties optional

// React usage: Dynamic form fields
type FormFields<T> = { [K in keyof T]: { value: T[K]; error: string | null } };

interface UserFormData {
  name: string;
  email: string;
}

const UserForm: React.FC<{ fields: FormFields<UserFormData> }> = ({ fields }) => (
  <div>
    <input value={fields.name.value} onChange={() => {}} />
    {fields.name.error && <p>{fields.name.error}</p>}
    <input value={fields.email.value} onChange={() => {}} />
    {fields.email.error && <p>{fields.email.error}</p>}
  </div>
);

// Tip: Combine mapped types with keyof to create flexible, reusable type structures.

// 4. Advanced Utility Types: Minimal Code, Maximum Power
// Analogy: Utility types are like pre-built tools in a Swiss Army knife—compact and versatile.
type UserSubset = Pick<User, 'id' | 'name'>; // Select specific properties
type UserWithoutEmail = Omit<User, 'email'>; // Exclude properties
type UserRecord = Record<string, User>; // Key-value mapping
type NonNullableUser = NonNullable<User | null>; // Remove null/undefined

// React usage: Type-safe API response
type ApiResponse<T> = { data: T; status: number; error?: string };
type UserApiResponse = ApiResponse<Pick<User, 'id' | 'name'>>;

const fetchUsers = async (): Promise<UserApiResponse> => ({
  data: { id: 1, name: 'Alice' },
  status: 200,
});

// Tip: Chain utility types (e.g., Pick + Record) to create precise types with minimal code.

// 5. Type-Safe Custom Hooks with ReturnType
// Analogy: Custom hooks with types are like vending machines—input a request, get a predictable output.
function useToggle(initial: boolean = false) {
  const [value, setValue] = React.useState(initial);
  return { value, toggle: () => setValue(!value) };
}

type ToggleHook = ReturnType<typeof useToggle>; // Extract return type

const ToggleComponent: React.FC = () => {
  const { value, toggle } = useToggle();
  return <button onClick={toggle}>{value ? 'On' : 'Off'}</button>;
};

// Tip: Use ReturnType to infer hook return types, avoiding manual type definitions.

// 6. Discriminated Unions for State Management
// Analogy: Discriminated unions are like labeled storage boxes, making state transitions clear and safe.
type FormState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: User; error: null }
  | { status: 'error'; data: null; error: string };

const Form: React.FC = () => {
  const [state, setState] = React.useState<FormState>({ status: 'idle', data: null, error: null });

  const handleSubmit = async () => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const response = await fetchUsers();
      setState({ status: 'success', data: response.data, error: null });
    } catch {
      setState({ status: 'error', data: null, error: 'Failed to fetch' });
    }
  };

  return (
    <div>
      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'success' && <p>Welcome, {state.data.name}!</p>}
      {state.status === 'error' && <p>Error: {state.error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

// Tip: Use discriminated unions with a literal `status` field for type-safe state machines.

// 7. Module Augmentation: Extending Third-Party Types
// Analogy: Module augmentation is like adding a custom feature to an off-the-shelf product.
declare module 'third-party-lib' {
  interface ExistingType {
    customMethod: () => void;
  }
}

// React usage: Extend a library component
interface ExtendedProps extends ThirdPartyComponentProps {
  customProp: string;
}

const ExtendedComponent: React.FC<ExtendedProps> = (props) => (
  <ThirdPartyComponent {...props} customProp="enhanced" />
);

// Tip: Use declaration files (*.d.ts) for module augmentation to avoid modifying library code.

// 8. Type-Safe Context with Minimal Boilerplate
// Analogy: Typed context is like a shared blueprint, ensuring all components follow the same plan.
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Usage
const LoginButton: React.FC = () => {
  const { login } = useAuth();
  return <button onClick={() => login({ id: 1, name: 'Alice', email: 'alice@example.com' })}>Login</button>;
};

// Tip: Use a custom hook to encapsulate context access, reducing error checks in components.

// 9. Efficient Error Handling with Type Guards
// Analogy: Type guards are like quality control checks, ensuring only valid data passes through.
function isApiError(error: unknown): error is { message: string; code: number } {
  return typeof error === 'object' && error !== null && 'message' in error && 'code' in error;
}

const fetchWithErrorHandling = async () => {
  try {
    const response = await fetchUsers();
    return response.data;
  } catch (error) {
    if (isApiError(error)) {
      console.error(`Error ${error.code}: ${error.message}`);
    }
    throw error;
  }
};

// Tip: Combine type guards with try-catch for robust error handling in API calls.

// 10. Minimal tsconfig.json for Elite Projects
// Analogy: A lean tsconfig.json is like a streamlined workflow—only the essentials for max efficiency.
const tsConfig = {
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": "src",
    "paths": { "@components/*": ["components/*"] },
    "noUnusedLocals": true, // Catch unused variables
    "noUnusedParameters": true // Catch unused function params
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
};

// Tip: Enable noUnusedLocals and noUnusedParameters for cleaner, minimal codebases.

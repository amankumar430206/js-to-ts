// 1. Pitfall: Overusing 'any' Type
// Why it's bad: Using 'any' bypasses TypeScript’s type-checking, negating its benefits. It’s like building a house without a blueprint—things might work initially but collapse under maintenance.
// Wrong:
const UserCard: React.FC<any> = ({ user, onClick }) => {
  return (
    <div onClick={() => onClick(user.id)}>
      <p>{user.name}</p>
    </div>
  );
};

// Correct: Define specific types for props
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

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
// Tip: Use 'unknown' instead of 'any' when unsure, and narrow types with type guards.

// 2. Pitfall: Ignoring Strict Mode in tsconfig.json
// Why it's bad: Without strict mode, TypeScript allows loose typing (e.g., implicit 'any'), leading to missed errors. It’s like driving without a seatbelt—risky in large codebases.
// Wrong tsconfig.json (partial):
const looseTsConfig = {
  "compilerOptions": {
    "noImplicitAny": false,
    "strictNullChecks": false
  }
};

// Correct: Enable strict mode for robust type-checking
const strictTsConfig = {
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true, // Enables all strict options (noImplicitAny, strictNullChecks, etc.)
    "esModuleInterop": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
};
// Tip: Gradually enable strict mode during migration to avoid overwhelming errors.

// 3. Pitfall: Not Typing Third-Party Library Props
// Why it's bad: Assuming third-party library props are type-safe can lead to runtime errors. It’s like trusting a black-box API without checking its output.
// Wrong: Using an untyped library component (e.g., a chart library)
import { Chart } from 'some-chart-lib';

const ChartComponent: React.FC = () => {
  return <Chart data={[{ value: 10 }]} options={{}} />;
};

// Correct: Use @types packages or custom declarations
import { Chart } from 'some-chart-lib'; // Ensure @types/some-chart-lib is installed

interface ChartData {
  value: number;
  label: string;
}

interface ChartProps {
  data: ChartData[];
  options: Record<string, any>; // Fallback for complex options, refine later
}

const ChartComponent: React.FC = () => {
  const data: ChartData[] = [{ value: 10, label: 'Sales' }];
  return <Chart data={data} options={{ responsive: true }} />;
};
// Tip: Install @types packages (e.g., npm install @types/some-chart-lib) or create a declaration file (e.g., some-chart-lib.d.ts) for untyped libraries.

// 4. Pitfall: Overcomplicating Types
// Why it's bad: Creating overly complex nested types reduces readability and maintainability. It’s like writing a 500-page manual for a simple app.
// Wrong: Overly nested types for a form
interface FormData {
  user: {
    profile: {
      personalInfo: {
        name: string;
        email: string;
      };
      settings: {
        preferences: {
          theme: string;
        };
      };
    };
  };
}

const UserForm: React.FC<{ data: FormData }> = ({ data }) => {
  return <input value={data.user.profile.personalInfo.name} />;
};

// Correct: Simplify types with flat interfaces
interface UserFormData {
  name: string;
  email: string;
  theme: string;
}

const UserForm: React.FC<{ data: UserFormData }> = ({ data }) => {
  return <input value={data.name} />;
};
// Tip: Break down complex types into smaller, reusable interfaces. Use utility types like Pick or Omit for flexibility.

// 5. Pitfall: Not Handling Null/Undefined Properly
// Why it's bad: Ignoring null/undefined checks can cause runtime errors, especially with API responses. It’s like assuming every package delivery arrives intact.
// Wrong: Assuming API data is always present
interface User {
  id: number;
  name: string;
}

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return <p>{user.name}</p>; // Crashes if user is null/undefined
};

// Correct: Use optional chaining and null checks
interface User {
  id: number;
  name?: string; // Name might be undefined
}

const UserProfile: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) return <p>No user data</p>;
  return <p>{user.name ?? 'Unknown'}</p>;
};
// Tip: Enable strictNullChecks in tsconfig.json and use optional chaining (?.) or nullish coalescing (??) for safety.

// 6. Pitfall: Misusing Type Assertions
// Why it's bad: Overusing type assertions (as) bypasses TypeScript’s safety checks, leading to potential runtime errors. It’s like telling a chef to “just assume” ingredients are fresh without checking.
// Wrong: Forcing a type without validation
const fetchData = async () => {
  const response = await fetch('/api/user');
  const user = await response.json() as User; // Assumes response is User
  return user.name; // Risky if response doesn't match User
};

// Correct: Use type guards or validation
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
}

const fetchData = async () => {
  const response = await fetch('/api/user');
  const data = await response.json();
  if (isUser(data)) {
    return data.name;
  }
  throw new Error('Invalid user data');
};
// Tip: Use type assertions only when you’re certain of the type (e.g., DOM elements like HTMLInputElement). Prefer type guards for dynamic data.

// 7. Pitfall: Not Typing Event Handlers Properly
// Why it's bad: Incorrectly typing event handlers can lead to errors when accessing event properties. It’s like misreading a map during navigation.
// Wrong: Untyped event handler
const InputField: React.FC = () => {
  const handleChange = (event) => {
    console.log(event.target.value); // No type safety
  };
  return <input onChange={handleChange} />;
};

// Correct: Type the event parameter
const InputField: React.FC = () => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value); // Type-safe access
  };
  return <input onChange={handleChange} />;
};
// Tip: Use React’s built-in event types (e.g., React.MouseEvent, React.ChangeEvent) for type-safe event handling.

// 8. Pitfall: Ignoring Type Inference
// Why it's bad: Explicitly typing everything can lead to verbose code, ignoring TypeScript’s powerful inference. It’s like writing every step of a recipe when some are obvious.
// Wrong: Over-typing useState
const Counter: React.FC = () => {
  const [count, setCount]: [number, React.Dispatch<React.SetStateAction<number>>] = React.useState<number>(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

// Correct: Leverage type inference
const Counter: React.FC = () => {
  const [count, setCount] = React.useState(0); // TypeScript infers number
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
// Tip: Let TypeScript infer types for simple cases (e.g., useState, variables). Explicitly type only when inference fails or for clarity.

// 9. Pitfall: Not Using Utility Types for Flexibility
// Why it's bad: Writing repetitive types instead of using TypeScript’s utility types reduces reusability. It’s like building every component from scratch instead of using a library.
// Wrong: Repeating type definitions
interface UserEditProps {
  id: number;
  name: string;
}

interface UserViewProps {
  id: number;
  name: string;
}

// Correct: Use utility types
interface User {
  id: number;
  name: string;
  email: string;
}

type UserEditProps = Pick<User, 'id' | 'name'>;
type UserViewProps = Pick<User, 'id' | 'name'>;

const UserEdit: React.FC<UserEditProps> = ({ id, name }) => {
  return <div>{id}: {name}</div>;
};
// Tip: Use Partial, Pick, Omit, Record, etc., to create reusable types from existing interfaces.

// 10. Pitfall: Poor Migration Strategy
// Why it's bad: Renaming all .js files to .ts at once or not testing incrementally can overwhelm you with errors. It’s like renovating an entire house in one day.
// Wrong: Immediate full migration
// Renaming all .js/.jsx to .ts/.tsx without typing props or state
function LegacyComponent({ data }) {
  return <div>{data.title}</div>;
}

// Correct: Incremental migration
// Step 1: Rename to .tsx and add basic types
interface LegacyProps {
  data: { title: string }; // Basic type, refine later
}

const LegacyComponent: React.FC<LegacyProps> = ({ data }) => {
  return <div>{data.title}</div>;
};

// Step 2: Refine types as you go
interface Data {
  title: string;
  id: number;
  createdAt: Date;
}

const LegacyComponent: React.FC<{ data: Data }> = ({ data }) => {
  return <div>{data.title} (ID: {data.id})</div>;
};
// Tip: Migrate one component at a time, starting with simple ones. Use `tsc --noEmit` to check types without emitting code.

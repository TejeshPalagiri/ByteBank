# Unit Testing Setup Guide

## Overview

This project has been configured with two testing frameworks:

- **Backend (Node.js/Express)**: Jest + ts-jest
- **Frontend (React/Vite)**: Vitest + React Testing Library

---

## Backend Testing (Jest)

### Running Tests

```bash
npm test                 # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Configuration

- **Config file**: `jest.config.js`
- **Test directory**: `src/__tests__/` or `tests/`
- **Test pattern**: `**/*.test.ts`

### Example Backend Test

Create a test file for a service:

```typescript
// src/services/__tests__/user.service.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      const result = await userService.createUser(userData);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
    });

    it('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });
});
```

### Testing Controllers with Supertest

```typescript
// src/controllers/__tests__/user.controller.test.ts
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../app';

describe('User Controller', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
```

---

## Frontend Testing (Vitest)

### Running Tests

```bash
npm test                 # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Configuration

- **Config file**: `vitest.config.ts`
- **Setup file**: `src/__tests__/setup.ts`
- **Test directory**: `src/__tests__/`

### Example Frontend Test

```typescript
// src/components/__tests__/Button.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../ui/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing React Hooks

```typescript
// src/hooks/__tests__/useForm.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm({ name: '' }));

    expect(result.current.values.name).toBe('');
  });

  it('should update values on change', () => {
    const { result } = renderHook(() => useForm({ name: '' }));

    act(() => {
      result.current.handleChange('name', 'John');
    });

    expect(result.current.values.name).toBe('John');
  });
});
```

---

## Testing Best Practices

### 1. **Organize Tests**
- Group tests with `describe()` blocks
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. **Use Fixtures & Factories**
```typescript
// Create a test helper file
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  password: 'hashed',
  ...overrides
});
```

### 3. **Mock External Dependencies**
```typescript
import { vi } from 'vitest';

const mockService = {
  fetchData: vi.fn().mockResolvedValue({ data: [] })
};
```

### 4. **Test Coverage Goals**
- Aim for 80%+ line coverage
- Focus on critical business logic
- Include error cases and edge cases

---

## Recommended Test Structure

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── fixtures/          # Mock data
│   │   ├── helpers/           # Test utilities
│   │   └── example.test.ts
│   ├── services/
│   │   └── __tests__/
│   │       └── user.test.ts
│   └── controllers/
│       └── __tests__/
│           └── user.test.ts

frontend/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts
│   │   ├── fixtures/
│   │   └── example.test.ts
│   ├── components/
│   │   └── __tests__/
│   │       └── Button.test.ts
│   └── hooks/
│       └── __tests__/
│           └── useForm.test.ts
```

---

## Next Steps

1. **Install dependencies**: Run `npm install` in both directories
2. **Run example tests**: `npm test` to verify setup
3. **Start writing tests** for your services, controllers, and components
4. **Configure CI/CD** to run tests automatically on commits

---

## Useful Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)

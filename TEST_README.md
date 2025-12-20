# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the new booking API and database connection functionality added to the event-nextjs application.

## Files Tested

### 1. `src/lib/db.ts` - Database Connection Module
- **Test File**: `src/__tests__/lib/db.test.ts`
- **Lines of Test Code**: 378
- **Test Cases**: 33+

### 2. `src/api/routes.ts` - Booking API Route
- **Test File**: `src/__tests__/api/routes.test.ts`
- **Lines of Test Code**: 733
- **Test Cases**: 66+

## Test Coverage Summary

### Database Connection Tests (`db.test.ts`)

#### Environment Variable Validation
- ✅ Throws error when MONGODB_URI is not defined
- ✅ Accepts valid MONGODB_URI
- ✅ Handles empty string MONGODB_URI

#### Connection Caching
- ✅ Initializes global cache if not exists
- ✅ Returns cached connection if already exists
- ✅ Reuses existing promise if connection in progress
- ✅ Caches connection after successful connect

#### Database Connection
- ✅ Connects with correct URI and options
- ✅ Uses bufferCommands: false option
- ✅ Handles successful connection
- ✅ Only connects once for multiple simultaneous calls

#### Error Handling
- ✅ Clears cached promise on connection error
- ✅ Allows retry after connection failure
- ✅ Handles network timeout errors
- ✅ Handles authentication errors
- ✅ Handles malformed URI errors
- ✅ Propagates errors without caching failed connections

#### Edge Cases
- ✅ Handles undefined/null connection results
- ✅ Handles various URI formats (standard, srv, replica sets)
- ✅ Maintains separate cache per global context

#### Concurrent Connection Handling
- ✅ Handles race conditions with multiple concurrent calls
- ✅ Handles rapid sequential connection attempts

### API Route Tests (`routes.test.ts`)

#### Request Validation (400 Errors)
- ✅ Returns 400 when eventId is missing
- ✅ Returns 400 when userEmail is missing
- ✅ Returns 400 when both are missing
- ✅ Returns 400 for null values
- ✅ Returns 400 for empty strings
- ✅ Returns 400 for undefined values

#### Successful Booking Creation (201 Success)
- ✅ Creates booking with valid data
- ✅ Returns 201 status on success
- ✅ Connects to database before creating booking
- ✅ Handles various email formats
- ✅ Handles various ObjectId formats
- ✅ Returns complete booking object with timestamps

#### Database Connection Errors (500 Errors)
- ✅ Returns 500 when database connection fails
- ✅ Does not attempt to create booking if connection fails
- ✅ Handles network timeout errors

#### Booking Creation Errors (500 Errors)
- ✅ Returns 500 when booking creation fails
- ✅ Handles validation errors from schema
- ✅ Handles event not found errors
- ✅ Handles past event errors
- ✅ Handles duplicate booking errors
- ✅ Handles invalid ObjectId format errors

#### Request Parsing Errors
- ✅ Returns 500 when request body parsing fails
- ✅ Handles malformed JSON
- ✅ Handles empty request body

#### Error Object Handling
- ✅ Handles error with message property
- ✅ Handles error without message (returns "Unknown error")
- ✅ Handles null/undefined errors
- ✅ Handles string errors

#### Edge Cases
- ✅ Handles very long email addresses
- ✅ Handles requests with extra fields
- ✅ Handles whitespace in email
- ✅ Handles uppercase email
- ✅ Handles special characters in eventId

#### Integration Flow
- ✅ Executes full successful flow in correct order
- ✅ Stops execution on validation failure

#### Response Format
- ✅ Returns JSON response
- ✅ Uses NextResponse.json for all responses

## Setup and Installation

### 1. Install Dependencies

```bash
npm install
```

This will install the following test dependencies (already added to package.json):
- `jest@^29.7.0` - Testing framework
- `ts-jest@^29.1.2` - TypeScript support for Jest
- `@types/jest@^29.5.12` - TypeScript definitions
- `jest-environment-node@^29.7.0` - Node.js test environment
- `@testing-library/react@^14.2.1` - React testing utilities
- `@testing-library/jest-dom@^6.4.2` - DOM matchers

### 2. Configuration Files

The following configuration files have been created:

- **`jest.config.js`**: Main Jest configuration
- **`jest.setup.js`**: Global test setup (sets MONGODB_URI env var)

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
# Database connection tests only
npm test -- src/__tests__/lib/db.test.ts

# API route tests only
npm test -- src/__tests__/api/routes.test.ts
```

### Run Tests Matching Pattern
```bash
# Run only validation tests
npm test -- -t "validation"

# Run only error handling tests
npm test -- -t "error"
```

## Test Architecture

### Mocking Strategy

#### Database Tests Mock:
- `mongoose.connect` - Prevents real database connections
- `global.mongoose` - Tests connection caching mechanism
- `process.env` - Tests environment variable validation

#### API Route Tests Mock:
- `NextResponse.json` - Isolates Next.js framework
- `connectDB` - Isolates database connection
- `Booking.create` - Tests various creation scenarios
- `Request.json()` - Controls request body parsing

### Test Patterns

Each test follows the **Arrange-Act-Assert** pattern:
```typescript
it('should do something', async () => {
  // Arrange: Set up test data and mocks
  const mockData = { ... };
  mockFunction.mockResolvedValue(mockData);
  
  // Act: Execute the function under test
  const result = await functionUnderTest();
  
  // Assert: Verify the results
  expect(result).toBe(expected);
  expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
});
```

### Test Isolation

- `beforeEach()`: Resets all mocks and state before each test
- `afterEach()`: Cleans up global state after each test
- Independent tests that don't affect each other

## Coverage Goals

Target coverage metrics:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

Current configuration requires minimum 80% coverage for the build to pass.

## Key Testing Principles Applied

### 1. Comprehensive Coverage
- Happy path scenarios
- Error conditions
- Edge cases
- Boundary conditions
- Concurrent operations

### 2. Isolation
- Each test is independent
- External dependencies are mocked
- No side effects between tests

### 3. Clarity
- Descriptive test names
- Clear test structure
- Grouped by functionality

### 4. Maintainability
- Consistent patterns
- DRY principles
- Well-organized test suites

### 5. Reliability
- No flaky tests
- Deterministic results
- Proper cleanup

## Test Suites Structure

### db.test.ts Structure
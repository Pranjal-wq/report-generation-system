# Centralized Toast API Service Documentation

## Overview

This project now uses a centralized API service that handles toast notifications automatically, preventing duplicate notifications and ensuring consistent user feedback across all API calls.

## Key Features

- **Automatic Toast Management**: No more manual toast calls in API functions
- **Duplicate Prevention**: Uses unique toast IDs to prevent multiple identical notifications
- **Consistent Error Handling**: Standardized error messages and handling
- **TypeScript Support**: Full type safety with generic types
- **Configurable Notifications**: Control when to show success/error toasts per API call

## Usage

### Basic API Calls

```typescript
import { localApiService, baseApiService } from '../api/base';

// Simple GET request with error handling
const fetchData = async () => {
  const response = await localApiService.get('/api/data', {
    showErrorToast: true,
    errorMessage: 'Failed to fetch data',
    toastId: 'data-fetch'
  });
  return response.data;
};

// POST request with success and error toasts
const createItem = async (itemData) => {
  const response = await localApiService.post('/api/items', itemData, {
    showSuccessToast: true,
    successMessage: 'Item created successfully!',
    showErrorToast: true,
    errorMessage: 'Failed to create item',
    toastId: 'item-create'
  });
  return response.data;
};
```

### Configuration Options

Each API call can be configured with these options:

```typescript
interface ApiServiceConfig {
  showSuccessToast?: boolean;     // Show success notification
  showErrorToast?: boolean;       // Show error notification  
  successMessage?: string;        // Custom success message
  errorMessage?: string;          // Custom error message
  toastId?: string;              // Unique ID to prevent duplicates
}
```

### Manual Toast Notifications

You can also manually trigger toasts:

```typescript
import { localApiService } from '../api/base';

// Manual toast calls
localApiService.showSuccess('Operation completed!', 'success-id');
localApiService.showError('Something went wrong', 'error-id');
localApiService.showInfo('Information message', 'info-id');
localApiService.showWarning('Warning message', 'warning-id');
```

### Migration from Old API Calls

**Before (Old Approach):**
```typescript
import { toast } from 'react-toastify';
import { local } from '../base';

export const fetchData = async () => {
  try {
    const response = await local.get('/api/data');
    toast.success('Data fetched successfully!', {
      toastId: 'data-success'
    });
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch data', {
      toastId: 'data-error'
    });
    throw error;
  }
};
```

**After (New Centralized Approach):**
```typescript
import { localApiService } from '../base';

export const fetchData = async () => {
  const response = await localApiService.get('/api/data', {
    showSuccessToast: true,
    successMessage: 'Data fetched successfully!',
    showErrorToast: true,
    errorMessage: 'Failed to fetch data',
    toastId: 'data-fetch'
  });
  return response.data;
};
```

## Benefits

1. **Reduced Code Duplication**: No need to repeat try/catch blocks and toast calls
2. **Consistent UX**: All API calls follow the same notification patterns
3. **Easier Maintenance**: Centralized error handling and notification logic
4. **Better Performance**: Automatic duplicate prevention reduces DOM manipulation
5. **Type Safety**: Full TypeScript support with proper error handling

## Toast ID Conventions

Use descriptive, unique toast IDs following this pattern:
- `{feature}-{action}`: e.g., `student-fetch`, `faculty-create`
- `{entity}-{operation}`: e.g., `department-update`, `subject-delete`

## Error Handling

The centralized service automatically:
- Logs errors to console
- Shows user-friendly error messages
- Maintains error state in the response
- Prevents duplicate error notifications

## Best Practices

1. Always provide meaningful error messages
2. Use unique toast IDs for each operation
3. Show success toasts for operations that aren't immediately visible
4. Keep error messages user-friendly, not technical
5. Use consistent naming conventions for toast IDs

## Available API Services

- `localApiService`: For local development API calls
- `baseApiService`: For production API calls

Both services support the same methods: `get`, `post`, `put`, `delete`, and manual toast methods.

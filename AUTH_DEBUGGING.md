# React Query Auth Debugging Guide

## ✅ Changes Made

### 1. **Fixed Critical Bugs in auth.api.ts**

- **Fixed**: `console.log` concatenation in error message (line 76)
- **Added**: Proper try-catch error handling with axios error checking
- **Added**: Token storage in localStorage on successful login
- **Added**: Better error messages extracted from backend responses
- **Added**: Proper 404 detection for `USER_NOT_REGISTERED` flow

### 2. **Enhanced Logging**

- **Added**: Console logging with emojis for easy tracking:
  - 🔐 Login attempt
  - ✅ Success
  - ❌ Error
  - 📝 Registration attempt

### 3. **Improved LoginPage**

- **Added**: Full email/password form
- **Added**: Loading spinner during submission
- **Added**: Better error display with error details
- **Added**: Dark mode support
- **Added**: Success message display from registration redirect

## 🧪 Testing Checklist

### Backend Verification

```bash
# 1. Check if backend is running
curl http://localhost:3000/api/health

# 2. If not running, start it
cd TaskMaster-Backend
npm run dev

# 3. Check database connection
# Backend should log database connection status on startup
```

### Frontend Testing Steps

#### A. Test Registration Flow

1. **Navigate to**: http://localhost:5173/register
2. **Fill form** with:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "test@example.com"
   - Password: "password123"
3. **Click** "Sign Up"
4. **Check console** for:
   ```
   📝 Attempting registration with: {email: "test@example.com", ...}
   ✅ Registration successful: {user data}
   ✅ Registration successful, redirecting to login...
   ```
5. **Expected**: Redirect to /login with success message
6. **If error**: Check console for:
   - Network error (backend not running?)
   - Validation error (password too short?)
   - Database error (check backend logs)

#### B. Test Login Flow

1. **Navigate to**: http://localhost:5173/login
2. **Fill form** with credentials from registration
3. **Click** "Sign In"
4. **Check console** for:
   ```
   🔐 Attempting login with: {email: "test@example.com"}
   ✅ Login successful: {user, token}
   ✅ Login successful: {user data}
   ```
5. **Expected**: Redirect to /home
6. **Check**: Token stored in localStorage (`auth_token`)

#### C. Test Error Handling

1. **Try invalid email**: Should show validation error
2. **Try short password**: Should show "at least 6 characters"
3. **Try wrong credentials**: Should show backend error message
4. **Try with backend offline**: Should show network error

## 🔍 Debugging Tools

### Browser DevTools

```javascript
// Check localStorage token
localStorage.getItem('auth_token');

// Check Redux state (if applicable)
// Open Redux DevTools extension

// Check React Query cache
// Open React Query DevTools (bottom-left icon)
```

### Network Tab Monitoring

1. **Open** Chrome DevTools > Network tab
2. **Filter** by XHR
3. **Watch** for:
   - `POST /api/auth/register` (status 201)
   - `POST /api/auth/login` (status 200)
4. **Check** request payload and response

### React Query DevTools

- **Location**: Bottom-left floating icon
- **Check**:
  - Mutation status
  - Mutation variables
  - Error details
  - Cache state

## 🐛 Common Issues & Solutions

### Issue 1: "Network Error"

**Symptoms**: Console shows axios network error
**Solution**:

- Check backend is running on port 3000
- Check VITE_API_URL in .env file
- Check CORS configuration in backend

### Issue 2: "Login failed undefined"

**Symptoms**: Error message shows "undefined"
**Solution**: ✅ FIXED - Now extracts proper error from backend

### Issue 3: Token not persisting

**Symptoms**: User logged out on refresh
**Solution**:

- Check localStorage has `auth_token`
- Check axios interceptor is reading token
- Implement Redux persistence

### Issue 4: Backend returns 404

**Symptoms**: All requests fail with 404
**Solution**:

- Check backend routes are mounted correctly
- Check ENDPOINTS paths match backend routes
- Current paths:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/users/auth0/:id`

### Issue 5: CORS errors

**Symptoms**: "blocked by CORS policy"
**Solution**: Check backend cors config allows `http://localhost:5173`

## 📊 Expected API Flow

### Registration:

```
User fills form
  ↓
useRegisterUser().mutate()
  ↓
registerUserAPI()
  ↓
POST /api/auth/register
  ↓
Backend creates user
  ↓
Returns {success: true, data: {user, message}}
  ↓
Navigate to /login with success message
```

### Login:

```
User fills form
  ↓
useLoginUser().mutate()
  ↓
loginUserAPI()
  ↓
POST /api/auth/login
  ↓
Backend validates credentials
  ↓
Returns {success: true, data: {user, token}}
  ↓
Token stored in localStorage
  ↓
Navigate to /home
```

## 🎯 Next Steps

After confirming auth works:

1. Test Tasks API (useFetchTasks, useCreateTask, etc.)
2. Test Lists API (useFetchLists, useCreateList, etc.)
3. Test Settings API (useFetchSettings, useUpdateSettings)
4. Implement toast notifications for better UX
5. Add token refresh logic
6. Add logout functionality

## 📝 API Endpoint Checklist

- [x] `/api/auth/register` - User registration
- [x] `/api/auth/login` - User login
- [ ] `/api/tasks` - Fetch tasks
- [ ] `/api/tasks` - Create task
- [ ] `/api/tasks/:id` - Update/Delete task
- [ ] `/api/lists` - Fetch lists
- [ ] `/api/lists` - Create list
- [ ] `/api/settings` - Fetch/Update settings

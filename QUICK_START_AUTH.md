# 🚀 Quick Start - Testing Auth API

## ✅ What Was Fixed

1. **Critical Bug**: Fixed `console.log` in error string causing undefined behavior
2. **Response Format**: Updated API functions to match backend response format `{user, token}` (no wrapper)
3. **Password Validation**: Updated to require 8+ characters (matches backend)
4. **Error Handling**: Added proper axios error extraction and logging
5. **Token Storage**: Auto-saves JWT to localStorage on login/register

## 🧪 Test Now!

### Start the app:

```bash
cd TaskMaster-Frontend
npm run dev
```

### Test Flow:

1. **Register a new user**: http://localhost:5173/register
   - Email: `yourname@test.com`
   - Password: `password123` (8+ chars required)
2. **Check console** for:

   ```
   📝 Attempting registration...
   ✅ Registration successful
   ✅ Registration successful, redirecting...
   ```

3. **Login**: http://localhost:5173/login
   - Use same credentials
4. **Check console** for:

   ```
   🔐 Attempting login...
   ✅ Login successful: {user, token}
   ```

5. **Verify** token in localStorage:
   - Open DevTools > Application > LocalStorage
   - Should see `auth_token` key with JWT

## 📊 What to Watch

### Console Logs:

- ✅ Green checkmarks = Success
- ❌ Red X = Error with details
- 🔐 Lock = Login attempt
- 📝 Clipboard = Registration attempt

### Network Tab:

- `POST /api/auth/register` → Status 200, returns `{user, token}`
- `POST /api/auth/login` → Status 200, returns `{user, token}`

### React Query DevTools (bottom-left icon):

- Check mutation status
- View cached data
- See error details

## 🐛 If Something Fails

1. **Check backend is running**: `http://localhost:3000`
2. **Check console** for detailed error message
3. **Check Network tab** for request/response
4. **Common issues**:
   - Password too short (needs 8+)
   - Email already exists
   - Backend not running

## ✨ What Works Now

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Token storage in localStorage
- ✅ Proper error messages from backend
- ✅ Loading states
- ✅ Form validation
- ✅ Success/error display

## 🎯 Next: Test Other APIs

Once auth works, test:

1. Tasks mutations (create, update, delete)
2. Lists mutations
3. Settings mutations

See `AUTH_DEBUGGING.md` for full debugging guide!

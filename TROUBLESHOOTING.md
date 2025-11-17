# 🔧 Troubleshooting Guide - Octrivium Funding

Common issues and their solutions.

## Installation Issues

### Problem: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

2. **Use legacy peer deps:**
```powershell
npm install --legacy-peer-deps
```

3. **Update npm:**
```powershell
npm install -g npm@latest
```

### Problem: Node version too old

**Symptoms:**
```
Error: The engine "node" is incompatible
```

**Solution:**
```powershell
# Check version
node --version

# Should be 18.0.0 or higher
# Download from: https://nodejs.org/
```

## Database Issues

### Problem: Cannot connect to PostgreSQL

**Symptoms:**
```
Error: Can't reach database server at `localhost:5432`
```

**Solutions:**

1. **Check if PostgreSQL is running:**
```powershell
Get-Service -Name postgresql*
```

2. **Start PostgreSQL service:**
```powershell
Start-Service postgresql-x64-14  # Adjust version number
```

3. **Check connection string in `.env`:**
```env
# Format:
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Example:
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/octrivium_funding"
```

4. **Test connection:**
```powershell
npx prisma db pull
```

### Problem: Prisma Client not generated

**Symptoms:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```powershell
npx prisma generate
```

### Problem: Migrations fail

**Symptoms:**
```
Error: P3009
Migration failed to apply
```

**Solutions:**

1. **Reset database (WARNING: Deletes all data):**
```powershell
npx prisma migrate reset
```

2. **Force push schema:**
```powershell
npx prisma db push --force-reset
```

3. **Manual fix:**
```powershell
# Connect to database
psql -U postgres -d octrivium_funding

# Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

# Rerun migrations
npx prisma migrate dev
```

## Authentication Issues

### Problem: "Invalid credentials" on login

**Symptoms:**
- Correct password doesn't work
- Just registered but can't login

**Solutions:**

1. **Check if user exists:**
```powershell
npx prisma studio
# Check User table
```

2. **Password hash mismatch:**
```powershell
# Generate new hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 12).then(console.log)"

# Update in Prisma Studio
```

3. **Clear browser cookies:**
```
F12 → Application → Cookies → Delete all
```

### Problem: Session not persisting

**Symptoms:**
- Logged out immediately after login
- Session lost on page refresh

**Solutions:**

1. **Check NEXTAUTH_SECRET in `.env`:**
```env
NEXTAUTH_SECRET="should-be-at-least-32-chars-long"
```

2. **Generate new secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. **Check NEXTAUTH_URL:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

### Problem: "CSRF token mismatch"

**Solution:**
```
Clear cookies and try again
```

## Runtime Errors

### Problem: "Module not found" errors

**Symptoms:**
```
Error: Cannot find module 'next/link'
Module not found: Can't resolve 'react'
```

**Solution:**
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# If still fails, check package.json versions match
```

### Problem: TypeScript errors in IDE

**Symptoms:**
- Red squiggly lines everywhere
- "Cannot find module" in VS Code

**Solutions:**

1. **Reload VS Code:**
```
Ctrl+Shift+P → "Developer: Reload Window"
```

2. **Check TypeScript version:**
```powershell
npx tsc --version
```

3. **Restart TypeScript server:**
```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Problem: Port 3000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Use different port:**
```powershell
$env:PORT=3001; npm run dev
```

2. **Kill process on port 3000:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill it (use PID from above)
taskkill /PID <PID> /F
```

## API Issues

### Problem: API routes return 404

**Symptoms:**
```
GET /api/deals/123 → 404 Not Found
```

**Solutions:**

1. **Check file naming:**
```
Correct: app/api/deals/[id]/route.ts
Wrong:   app/api/deals/[id].ts
```

2. **Verify export:**
```typescript
// Must export GET, POST, etc.
export async function GET(req: Request) {
  // ...
}
```

3. **Restart dev server:**
```powershell
Ctrl+C
npm run dev
```

### Problem: API returns 500 Internal Server Error

**Symptoms:**
```
POST /api/investments → 500
```

**Solutions:**

1. **Check terminal logs:**
```
Look at the terminal where npm run dev is running
```

2. **Check Prisma client:**
```powershell
npx prisma generate
```

3. **Add try-catch:**
```typescript
try {
  // your code
} catch (error) {
  console.error('API Error:', error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### Problem: CORS errors

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
```typescript
// In API route
export async function POST(req: Request) {
  // Add CORS headers
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

## Frontend Issues

### Problem: "Hydration failed" error

**Symptoms:**
```
Error: Hydration failed because the initial UI does not match
```

**Solutions:**

1. **Check for mismatched HTML:**
- No `<div>` inside `<p>`
- No conditional rendering issues
- No `suppressHydrationWarning` missing on `<html>`

2. **Clear .next folder:**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Problem: Styles not loading

**Symptoms:**
- Page has no styling
- Tailwind classes not working

**Solutions:**

1. **Check globals.css is imported:**
```typescript
// In app/layout.tsx
import './globals.css';
```

2. **Rebuild:**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

3. **Check tailwind.config.ts content paths:**
```typescript
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],
```

### Problem: Images not loading

**Symptoms:**
```
Error: Invalid src prop
```

**Solution:**
```typescript
// In next.config.mjs
images: {
  domains: ['localhost'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
},
```

## Performance Issues

### Problem: Slow page loads

**Solutions:**

1. **Check database queries:**
```typescript
// Add indexes in schema.prisma
@@index([userId])
@@index([createdAt])
```

2. **Use Prisma query optimization:**
```typescript
// Include only needed fields
select: {
  id: true,
  name: true,
  // Don't include large fields
}
```

3. **Enable caching:**
```typescript
export const revalidate = 60; // Cache for 60 seconds
```

### Problem: High memory usage

**Solutions:**

1. **Limit query results:**
```typescript
take: 50,
skip: page * 50,
```

2. **Close Prisma connections:**
```typescript
await prisma.$disconnect();
```

## Production Deployment Issues

### Problem: Build fails

**Symptoms:**
```
npm run build → Error
```

**Solutions:**

1. **Check TypeScript errors:**
```powershell
npm run lint
```

2. **Fix all TypeScript errors**

3. **Check environment variables:**
```powershell
# All required vars in .env
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### Problem: Database migrations in production

**Solution:**
```powershell
# Generate migration
npx prisma migrate deploy

# Don't use migrate dev in production!
```

## Windows-Specific Issues

### Problem: Path too long errors

**Solution:**
```powershell
# Enable long paths
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Restart computer
```

### Problem: PowerShell execution policy

**Symptoms:**
```
npm : File cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: Line endings (CRLF vs LF)

**Solution:**
```powershell
# Configure Git
git config --global core.autocrlf true
```

## Still Having Issues?

### Debug Checklist:

1. **Check all environment variables:**
   ```powershell
   notepad .env
   ```

2. **Verify all services running:**
   - PostgreSQL
   - Development server

3. **Check terminal output:**
   - Look for error messages
   - Check stack traces

4. **Check browser console:**
   ```
   F12 → Console tab
   ```

5. **Clear everything and restart:**
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules
   npm install
   npx prisma generate
   npm run dev
   ```

### Get More Help:

1. **Check documentation:**
   - README.md
   - SETUP.md
   - PROJECT_OVERVIEW.md

2. **Check Prisma logs:**
   ```env
   # In .env, add:
   DEBUG="prisma:*"
   ```

3. **Enable verbose logging:**
   ```typescript
   // In prisma.ts
   log: ['query', 'error', 'warn', 'info'],
   ```

4. **Search for error message:**
   - Next.js docs: https://nextjs.org/docs
   - Prisma docs: https://www.prisma.io/docs
   - Stack Overflow

### Common Error Codes:

| Code | Meaning | Solution |
|------|---------|----------|
| EADDRINUSE | Port already in use | Change port or kill process |
| ECONNREFUSED | Can't connect to DB | Check PostgreSQL running |
| P1001 | Can't reach DB server | Check DATABASE_URL |
| P2002 | Unique constraint failed | Record already exists |
| P2003 | Foreign key constraint | Check related records exist |
| P2025 | Record not found | Check ID exists |

---

**Still stuck? Create an issue or check:**
- Next.js Discord: https://nextjs.org/discord
- Prisma Discord: https://pris.ly/discord
- GitHub Issues for specific packages

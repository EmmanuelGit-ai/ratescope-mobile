# Screen Rules

Applies to all files in app/

- Screens use React Query hooks from src/hooks/ for data fetching
- NEVER call API functions directly in screens — use hooks
- Every screen must handle 3 states: loading (skeleton), error (retry button), success (content)
- Use SafeAreaView as root container on every screen
- StatusBar style: light-content (dark theme)
- Screen transitions: use Expo Router Link component, never router.push for simple nav

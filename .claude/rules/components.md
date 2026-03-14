# Component Rules

Applies to all files in src/components/

- Every component gets its own file: ComponentName.tsx
- Use named exports: export function StarRating() not export default
- Props interface defined in same file, named ComponentNameProps
- All styles via StyleSheet.create at bottom of file
- Colors from theme.ts — never hardcode hex values
- Every component that shows a score must use the StarRating component
- Loading states: every component that fetches data must have a skeleton variant
- Accessibility: include accessibilityLabel on all touchable elements

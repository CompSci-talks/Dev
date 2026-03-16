# Tasks: Premium Toast UI Refactor

## UI Refactor
- [x] Update `toast.component.html` container to use `top-6 right-6` instead of `bottom-6`. <!-- id: T001 -->
- [x] Apply glassmorphism styling to toast items: `bg-opacity-70`, `backdrop-blur-md`, and `border-white/20`. <!-- id: T002 -->
- [x] Refactor transition logic to use pure fade-in/fade-out without movement. <!-- id: T003 -->
- [x] Ensure consistent iconography for all types (Success, Error, Warning, Info). <!-- id: T004 -->

## Verification
- [x] Verify vertical stacking behavior from the top-right corner. <!-- id: V001 -->
- [x] Manual browser check for premium "Glass" effect visibility over text/media. <!-- id: V002 -->
- [x] Final accessibility check for ARIA roles and screen reader compatibility. <!-- id: V003 -->
- [x] Run logic verification unit tests: `npm test -- --include src/app/core/services/toast.service.spec.ts`. <!-- id: V004 -->
- [x] Update `walkthrough.md` with visual evidence of premium UI changes. <!-- id: V005 -->

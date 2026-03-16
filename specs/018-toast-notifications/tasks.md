# Tasks: Premium Toast UI Refactor

## UI Refactor
- [x] Update `toast.component.html` container to use `top-6 right-6` instead of `bottom-6`. <!-- id: T001 -->
- [x] Apply glassmorphism styling to toast items: `bg-opacity-70`, `backdrop-blur-md`, and `border-white/20`. <!-- id: T002 -->
- [x] Refactor transition logic to use pure fade-in/fade-out without movement. <!-- id: T003 -->
- [x] Ensure consistent iconography for all types (Success, Error, Warning, Info). <!-- id: T004 -->
- [x] Integrate Flowbite-style HTML structure into `ToastComponent`. <!-- id: T005 -->
- [x] Ensure Flowbite icons and layout align with glassmorph aesthetics. <!-- id: T006 -->

## Verification
- [x] Verify Flowbite layout on all toast types (Success, Error, Warning, Info). <!-- id: V001 -->
- [x] Confirm glassmorphism styling and top-right positioning. <!-- id: V002 -->
- [x] Validate smooth fade-in/out animations and auto-dismissal timing. <!-- id: V003 -->
- [ ] Run logic verification unit tests: `npm test -- --include src/app/core/services/toast.service.spec.ts`. <!-- id: V004 -->
- [ ] Update `walkthrough.md` with visual evidence of Flowbite UI changes. <!-- id: V005 -->

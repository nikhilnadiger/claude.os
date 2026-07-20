---
expert: Luke Wroblewski (Global)
council: PRODUCT DESIGN
learnings: 50
---

# Luke Wroblewski (Global) — Full Learnings

## 1. Mobile-First Changes Everything

**Problem:** Desktop-first design. Mobile is shrunken desktop. Fails.
**Mainstream:** Design desktop. Adapt to mobile.
**Their approach:** Start mobile. Constraints of mobile force clarity and priority. Desktop is enhancement.
**Example:** Mobile form: 4 fields max per screen. Desktop: all fields visible. Mobile constraint improves desktop.

## 2. Single Column Layout Superiority

**Problem:** Multi-column layouts. Users overwhelmed by options.
**Mainstream:** Maximize screen usage. Show more columns.
**Their approach:** Single column on mobile guides user linearly. Clear reading order. Attention focused.
**Example:** Mobile form single column. On desktop: optional second column, but primary flow still single column.

## 3. Touch Targets Must Be Generous

**Problem:** Clickable elements too small. Users miss, get frustrated.
**Mainstream:** Efficient use of space. Small buttons.
**Their approach:** Touch target minimum 48x48 pixels. Larger enables interaction. Space isn't wasted; it enables interaction.
**Example:** Button that's 48x48 pixels feels generous. Button that's 16x16 feels impossible.

## 4. Input Type Matters

**Problem:** All input same. Date picker, number spinner, text field all look same.
**Mainstream:** Consistent input appearance.
**Their approach:** Input type should suggest how to input: slider for range, buttons for options, text for open-ended.
**Example:** Date input: should show date picker, not text field. Input type guides interaction.

## 5. Progressive Disclosure Simplifies

**Problem:** All options visible. Overwhelming.
**Mainstream:** Show capabilities. More options = more power.
**Their approach:** Show core options. Advanced options hidden. Reveal as needed. Complexity available but not forced.
**Example:** Settings screen: basic options visible, advanced settings hidden. User finds them when needed.

## 6. Thumb Zone Optimization

**Problem:** Small screens require reaching. Hard to tap top of screen.
**Mainstream:** Consistent layout regardless of reach.
**Their approach:** Optimize for natural thumb reach. Primary actions in thumb zone (bottom third of screen).
**Example:** Mobile keyboard: primary action button at bottom within thumb reach, not at top.

## 7. Sign-Up Form Friction

**Problem:** Sign-up requires 15 fields. Most users abandon.
**Mainstream:** Collect information you might need.
**Their approach:** Minimum viable sign-up: collect essential only. Collect more data after user invests in product.
**Example:** Sign-up: email, password only. Ask about preferences after they've used product.

## 8. Mobile Navigation Patterns

**Problem:** Navigation takes up space. Clutters mobile interface.
**Mainstream:** Navigation always visible.
**Their approach:** Mobile navigation hidden until needed: hamburger menu, bottom nav. Desktop: always visible.
**Example:** Navigation hidden in hamburger on mobile. Desktop: sidebar visible. Different patterns for different contexts.

## 9. Responsive Images Not Responsive

**Problem:** Same image on mobile and desktop. Bandwidth wasted.
**Mainstream:** Responsive design includes images.
**Their approach:** Optimize images for device: low-res on mobile, high-res on desktop. Save bandwidth, improve performance.
**Example:** Mobile: 320px image. Desktop: 1200px image. Same responsive code, different image served.

## 10. Form Label Placement

**Problem:** Labels above fields look right on desktop. Mobile takes space.
**Mainstream:** Consistent label placement.
**Their approach:** Mobile: labels above fields. Desktop: labels beside fields. Context determines best placement.
**Example:** Mobile form: label stacked above input. Desktop: label beside input. Same form, different layouts.

## 11. Gesture Ambiguity

**Problem:** Same gesture means different things. Confusing.
**Mainstream:** Consistent gesture behavior.
**Their approach:** Gestures should be unambiguous: swipe has specific meaning, tap has specific meaning. Clear mapping.
**Example:** Swipe right means 'like.' Swipe left means 'pass.' Consistent mapping across app.

## 12. Connection Speed Assumptions

**Problem:** Design assumes fast connection. Fails on slow networks.
**Mainstream:** Design for average connection.
**Their approach:** Design for slow connection. Test on 3G. Optimize for worst case.
**Example:** App that loads in 2 seconds on WiFi but 20 seconds on 3G. Redesign for 3G baseline.

## 13. Fat Finger Syndrome

**Problem:** Small targets assume precise interaction. Users have fingers.
**Mainstream:** Precise UI. Users need precision.
**Their approach:** Buttons should be easy to hit without precision. Generously sized targets.
**Example:** Close button: 44x44 minimum so user can tap without precision.

## 14. Avoid Content on Hover

**Problem:** Desktop patterns assume hover. Mobile has no hover.
**Mainstream:** Hover reveals content. Works everywhere.
**Their approach:** Content shouldn't require hover. If it's important, show it. If hidden, make discoverable without hover.
**Example:** Tooltip only on hover: hidden on mobile. Show important tooltips always, or make accessible on tap.

## 15. Prioritization by Context

**Problem:** All features equally prominent. Most users need few.
**Mainstream:** Feature parity. Show all.
**Their approach:** Features prioritized by context and user: mobile core features, desktop full feature set.
**Example:** Mobile: send email. Desktop: send email, schedule, add attachments, create signature, etc.

## 16. The Fold Is Dead (But Space Is Real)

**Problem:** Below the fold, content ignored. But it's mobile; infinite scroll.
**Mainstream:** Above the fold is critical.
**Their approach:** Below the fold matters on mobile (scroll is natural). But don't bury critical info too deep.
**Example:** Call-to-action can be below fold on mobile (scroll is expected). Place thoughtfully.

## 17. Orientation Change Gracefully

**Problem:** Rotate phone. Layout breaks.
**Mainstream:** Design for one orientation.
**Their approach:** Both orientations work. Layout adapts. No content lost in transition.
**Example:** Portrait: list view. Landscape: grid. Both layouts coherent.

## 18. Back Button Behavior

**Problem:** Back button confusing. Unclear what 'back' means.
**Mainstream:** Back button goes to previous page.
**Their approach:** Back button behavior should be predictable: previous page in app, not browser history, not previous app.
**Example:** Back button: return to list. Not browser back (leaves app).

## 19. Loading States Matter

**Problem:** Action triggered. Nothing happens for seconds. Broken?
**Mainstream:** Show loading spinner.
**Their approach:** Loading state should communicate: something is happening, progress, estimate of time.
**Example:** Skeleton loading shows content shape. User knows what's coming. Better than spinner.

## 20. Confirmation for Destructive Actions

**Problem:** User accidentally deletes. No way to recover.
**Mainstream:** Allow action immediately.
**Their approach:** Destructive actions (delete, charge) should confirm. Second chance to reconsider.
**Example:** Delete button: asks 'Are you sure?' Tap again to confirm.

## 21. Preference for Buttons Over Links

**Problem:** Touch targets with links tiny. Hard to tap.
**Mainstream:** Links are efficient. Buttons take space.
**Their approach:** Mobile: buttons (large touch targets). Desktop: links acceptable but buttons better.
**Example:** Primary action: button not link. Link harder to tap on mobile.

## 22. Avoid Auto-Play Media

**Problem:** Video auto-plays. Sound blares. Annoying.
**Mainstream:** Auto-play engages users.
**Their approach:** User-initiated media only. Respect user's context and attention.
**Example:** Video: plays only when tapped, not on page load.

## 23. Scrolling as Interaction

**Problem:** Scrolling seen as passive. It's interaction.
**Mainstream:** Swipe for big changes. Scroll for viewing.
**Their approach:** Scrolling is primary mobile interaction. Design with scrolling as central, not swipe.
**Example:** Long list: scrolling, not swiping between screens.

## 24. Thumb vs. Index Finger

**Problem:** Interaction assumes one type of touch. Wrong.
**Mainstream:** Consistent interaction style.
**Their approach:** Different interactions suit different touch types: thumb for swiping, index for precise tapping.
**Example:** Thumb swiping: larger targets. Index tapping: can be smaller.

## 25. Test on Real Devices

**Problem:** Design looks good in browser. Fails on real phone.
**Mainstream:** Design in browser. Should translate to device.
**Their approach:** Test on actual devices: real screen size, real touch, real network speed, real conditions.
**Example:** App that works in simulator but fails on old iPhone. Real device testing reveals issues.

---

## 26. Gradual Engagement Lifts Sign-Up Conversions

**Problem:** Requiring registration before showing product value causes abandonment.
**Mainstream:** Show sign-up form immediately, then unlock product.
**Their approach:** Let users experience product value first. Registration is postponed or handled behind the scenes — "gradual engagement." When users already understand the product's benefit, they're far more likely to complete registration.
**Example:** Twitter's gradual engagement redesign added one extra step (four instead of three) but increased sign-up completions 29% and produced users who were far more engaged post-sign-up, because they started by following topics before being asked to register. (LukeW.com, entry 1128)

## 27. Dropdowns Are the UI of Last Resort

**Problem:** Select menus used as the default choice for any list-based input.
**Mainstream:** Dropdown = standard, reliable selection control everywhere.
**Their approach:** Interacting with a dropdown on mobile requires 4+ interactions: tap to open, scroll to find option, select it, tap done to close. Build custom controls (spinners, segmented buttons, inline radio) first. Save dropdowns only for long lists where no simpler control applies.
**Example:** Selecting "2 guests" on Kayak uses a + / - spinner (1 tap each). A dropdown for the same field would require tap → scroll → select → close — four interactions for each adjustment. (LukeW.com, entry 1950)

## 28. Show Passwords on Mobile

**Problem:** Masked password fields cause avoidable input errors on mobile.
**Mainstream:** Always mask passwords to protect from shoulder-surfing.
**Their approach:** Masking passwords on mobile doesn't actually improve security — the virtual keyboard lights up each key as pressed, visibly indicating what's being typed. Show passwords by default or provide a clear show/hide toggle. The usability gain exceeds the negligible security tradeoff.
**Example:** Yahoo! showed passwords by default on registration and saw double-digit improvement in completion. Sprint removed masking for 20 million users with zero security incidents. (LukeW.com, entry 1941)

## 29. Inline Validation Has Proven Quantified ROI

**Problem:** Errors discovered only at form submit force users to re-navigate to correct them.
**Mainstream:** Validate and display errors on submit.
**Their approach:** Inline validation — showing success or error immediately after each field is completed — produces measurable, reproducible improvements across every key metric.
**Example:** etre usability testing (March 2009) on Yahoo! registration: inline validation produced 22% increase in form completions, 31% increase in satisfaction ratings, 42% decrease in completion times, 22% decrease in errors, 47% decrease in eye fixations vs. submit-and-refresh model. (MIX10 presentation, 2010)

## 30. Inline Validation Timing: Validate After the Field, Not During

**Problem:** Teams add real-time validation that triggers on every keystroke, showing errors before users finish typing.
**Mainstream:** Validate character-by-character as the user types.
**Their approach:** Trigger validation only after the user completes a field and moves on (on blur/tab-out). Validating before the user has had a chance to finish is actively frustrating. One test participant said: "It's frustrating that you don't get the chance to put anything in before it's flashing red at you."
**Example:** Email field: don't flag "invalid format" while user is mid-address. Flag it only after they tab to the next field. (MIX10 presentation, 2010; Web Form Design, 2008)

## 31. Inline Accordion Forms Match Single-Page Completion Rates

**Problem:** Assumption that multi-step forms hurt conversion by adding friction.
**Mainstream:** Use single-page forms to avoid multi-step dropout.
**Their approach:** Inline multi-step (accordion) forms do not reduce completion rates compared to single-page forms. Testing found people completed them fastest of all formats — with no increase in usability issues. Users also do not perceive section headers as form actions or progress controls.
**Example:** Inline accordion form where each section expands in sequence: same completion rate as single long-scrolling form, measurably faster to complete. (MIX10 presentation, 2010)

## 32. Every Unnecessary Input Has a Hidden Cognitive Cost

**Problem:** Forms accumulate questions that are nice-to-have rather than essential.
**Mainstream:** Collect all potentially useful data while users are already in the form.
**Their approach:** Each question forces a user to: (1) parse the question, (2) formulate a response, (3) input the answer. That's three cognitive and physical steps per field. For every question asked, apply three tests: Can it be removed? Can it be postponed until later? Can it be inferred from other data?
**Example:** Asking for gender at registration requires user to parse, decide, and input. Can you infer it later? Or wait until they personalize their account? Most registrations don't need it at all. (MIX10 presentation, 2010; Web Form Design, 2008)

## 33. Required vs. Optional Field Signals Depend on Context

**Problem:** All forms mark required fields with *, even when all fields are required.
**Mainstream:** Always mark required fields with an asterisk.
**Their approach:** Indicate optional fields when most fields are required. Indicate required fields when most fields are optional. Neither signal is useful when all fields are required — in that case, skip both indicators. Overuse of indicators adds noise without helping.
**Example:** A 12-field form with 11 required and 1 optional: label only the optional one. A 12-field form with 1 required and 11 optional: label only the required one. (Web Form Design, 2008)

## 34. Field Length Communicates Expected Answer

**Problem:** Uniform field widths create visual noise and give users no guidance on expected input length.
**Mainstream:** Consistent field width throughout form for visual uniformity.
**Their approach:** Use field length as an affordance. A short field signals a short answer (ZIP code, month, year). A wide field signals longer input (name, address, message). Random or inconsistent field lengths add visual noise without benefit.
**Example:** ZIP code field: narrow. City field: medium. Notes field: wide and multi-line. Each width telegraphs the expected response without explanation. (Web Form Design, 2008)

## 35. Primary and Secondary Actions Require Visual Hierarchy

**Problem:** Submit and Cancel buttons given equal visual weight, causing accidental secondary action clicks.
**Mainstream:** Display all form actions as buttons of equal visual prominence.
**Their approach:** Primary actions (Submit, Save, Continue) are the goal — make them visually prominent. Secondary actions (Reset, Cancel, Go Back) are rarely needed — make them visually recessive (styled as links, or removed entirely). The visual presentation must match the relative importance.
**Example:** Form footer: filled blue "Continue" button (primary). Plain text link "Cancel" (secondary). Not two identical buttons side by side. (Web Form Design, 2008)

## 36. Help Text: Use Minimum, Reveal Dynamically

**Problem:** Forms laden with always-visible help text under every field overwhelm the interface.
**Mainstream:** Display all help text persistently beneath each field.
**Their approach:** Minimize visible help. Keep it adjacent to the field it describes. For complex or unfamiliar data, use dynamic help systems: automatic inline exposure (appears when field is focused), user-activated inline exposure (shown via ? tap), or section-level disclosure. Persistent help on every field obscures the form.
**Example:** SSN field: blank by default. On focus: shows "XXX-XX-XXXX format." On ?: shows why it's being collected. Users who know the format aren't distracted. (Web Form Design, 2008)

## 37. Labels-Within-Fields Create Three Failure Modes

**Problem:** Placeholder text used as form labels disappears when users start typing.
**Mainstream:** Labels inside fields save vertical space and look clean on short forms.
**Their approach:** Label-within-field (placeholder as label) fails in three ways: (1) the label vanishes the moment typing begins, leaving users unable to remember what they're answering; (2) filled-looking placeholder text can be mistaken for a pre-entered value; (3) users reviewing their answers after completion have no labels to reference. Prefer top-aligned labels or floating labels.
**Example:** MailChimp mobile login: "Username" label disappears on first keystroke. On a two-field form this barely matters; on longer forms it becomes a real problem — especially when returning to review. (Mobile First, 2011)

## 38. Autocapitalize and Autocorrect Require Intentional Configuration

**Problem:** Mobile OS autocorrect "corrects" deliberately typed lowercase email addresses, passwords, and URLs.
**Mainstream:** Accept default browser autocorrect and autocapitalize behavior on all fields.
**Their approach:** Explicitly configure these attributes per field. Turn off autocorrect and autocapitalize on email, password, URL, and any case-sensitive field. Turn on autocapitalize for names and locations. An over-zealous autocorrecting OS will silently corrupt the user's intended input.
**Example:** Email field without autocapitalize=off: iOS capitalizes first letter → "Luke@email.com" instead of "luke@email.com" — a login that now fails. One attribute prevents it. (Mobile First, 2011)

## 39. Input Masks Reveal Format Upfront, Never Gradually

**Problem:** Input masks that gradually reveal their format mid-entry confuse users who expected a different structure.
**Mainstream:** Format reveals itself as user types.
**Their approach:** A well-designed input mask shows its complete expected format the moment the field receives focus, and keeps that format visible throughout. A mask that shows "XXX-XX-XXXX" then switches to "(___) ___ - ____" as characters are entered breaks the expectation that was set up front. Surface format immediately and maintain it.
**Example:** Tax ID field: shows "___-__-____" on focus, stays in that format throughout. Never surprises the user mid-entry with a different separator pattern. (Mobile First, 2011)

## 40. Smart Defaults Accelerate Form Completion by 4x

**Problem:** Empty forms force every user — including the majority who share the most common value — to fill in each field from scratch.
**Mainstream:** Begin forms with blank input fields.
**Their approach:** Pre-fill smart defaults that reflect the needs of most users. A study comparing empty mobile forms to pre-filled forms requiring only a few adjustments found users were four times faster completing the pre-filled version.
**Example:** Kayak hotel booking defaults to "1 room, 1 guest." The majority of bookings match this exactly. The user only changes what differs — saving significant time and tapping on mobile. (Mobile First, 2011)

## 41. Spinner Controls Beat Select Menus for Small Ranges

**Problem:** Dropdown select menus used for small numeric ranges (1–5, 1–10) require disproportionate interaction.
**Mainstream:** Select menu as standard control for any list of options.
**Their approach:** For small numeric ranges where a select menu's options would fit in a spinner, the spinner (+ / - buttons) requires only one tap per adjustment vs. four interactions for a select menu. Build custom controls when they measurably reduce interaction cost.
**Example:** Kayak's hotel booking: "2 guests" set with two taps of the + button. Same task with a select menu: tap to open → scroll list → tap selection → tap done. Custom spinner wins on every metric. (Mobile First, 2011)

## 42. Non-Linear Input: Expose Fields on Demand

**Problem:** Profile and settings screens display all editable input fields simultaneously, cluttering the mobile interface.
**Mainstream:** Show all editable fields in edit mode at once.
**Their approach:** For non-linear updates — cases where users rarely edit all fields together — display current values in read mode. Each value is tappable to reveal the edit field in a dialog or sub-screen. This sets focus immediately, pops the virtual keyboard, and removes the clutter of editing fields the user has no intention of changing.
**Example:** "Bio: Currently empty" with a tap-to-edit affordance: tapping opens a dialog with the text field focused and keyboard raised. The main screen stays uncluttered. (Mobile First, 2011)

## 43. Trim Mobile Forms Ruthlessly

**Problem:** Desktop form fields transferred to mobile without re-evaluation of what is truly necessary.
**Mainstream:** Same form fields across devices; responsive layout handles the rest.
**Their approach:** Every field on a mobile form must justify its presence. Cut everything that isn't absolutely essential. Luke redesigned Boingo's "Get Online" form from five separate screens to a single screen by eliminating non-essential questions. The direction is always: trim, trim, trim.
**Example:** Boingo original: 5 screens of input to get online. Redesign: 1 screen. Reduction was achieved not through clever layout but by cutting every field that wasn't strictly required. (Mobile First, 2011)

## 44. Mobile Devices Offer Non-Typing Input Methods

**Problem:** Mobile design treats all input as text typed into form fields.
**Mainstream:** All form data collected through keyboard input.
**Their approach:** Modern mobile devices have non-typing input capabilities that should be treated as first-class alternatives: GPS (current location in one tap), microphone (voice), camera (barcode scan, document scan, visual search), NFC (radio ID tag proximity). Designing only for keyboard input ignores the hardware advantage of mobile.
**Example:** Hotel booking: tapping "Use My Location" auto-fills city in one tap vs. typing "San Francisco, CA" — 20 keystrokes vs. 1 tap. Twitter's one-tap location appending to posts works the same way. (Mobile First, 2011)

## 45. Reduction Is the Best Mobile Layout Principle

**Problem:** Mobile responsive designs try to accommodate the same number of elements as desktop, just rearranged.
**Mainstream:** Responsive design rearranges content to fit smaller screens.
**Their approach:** Reduction — not rearrangement — is the most powerful mobile layout tool. Fewer elements to render, fewer options for users to consider, fewer things to misclick. Aim for the minimum necessary to help users accomplish their goal at each breakpoint. If users request that the desktop experience be made simpler like mobile, that is a signal of success.
**Example:** "If you start to hear customers asking for your desktop experience to be more like the simple, easy-to-use mobile one — you're doing it right." — Mobile First (2011)

## 46. Pixel Density Breaks Bitmap Images; CSS Scales Automatically

**Problem:** Images that look sharp on standard-density screens appear blurry or pixelated on high-density Retina/AMOLED displays.
**Mainstream:** Single set of image files used across all devices.
**Their approach:** High-density screens need 2x resolution images. Browser-rendered CSS (gradients, rounded corners, borders, text) scales automatically to any pixel density — bitmap images do not. Leaning on CSS for visual design reduces the maintenance burden of two image sets.
**Example:** Logo in a PNG file looks blurry on iPhone Retina. Same logo rendered via CSS scales crisply at any density without a second file. (Mobile First, Chapter 7, 2011)

## 47. Device Experiences Need Distinct Solutions, Not Just Rearranged Elements

**Problem:** One responsive stylesheet assumed to serve phones, tablets, desktops, and connected TVs equally.
**Mainstream:** Responsive breakpoints handle all device differences through layout rearrangement.
**Their approach:** Phone, tablet, desktop, and connected TV are distinct device experiences — different user posture (sitting vs. on-the-go), different input methods (touch vs. remote vs. mouse), different average display sizes. Each may require distinctly different UI solutions: different information architecture, different navigation patterns, different interaction models.
**Example:** Netflix maintains separate HTML5 interfaces for PS3, iPhone, iPad, and desktop — same web technologies, distinct designs. A tablet-optimized interface might feel limited on desktop; a desktop interface may feel impossible on a TV remote. (Mobile First, Chapter 7, 2011)

## 48. Selection-Dependent Inputs Must Not Jump the Layout

**Problem:** Selecting an option causes dependent fields to appear and visually shift the entire form, disorienting the user.
**Mainstream:** Show dependent inputs immediately below trigger, regardless of layout shifts.
**Their approach:** When an initial selection unlocks additional inputs, never allow any layout "jumping" that moves the triggering option away from where the user just tapped. Maintain the clear visual association between the trigger and its dependents throughout the interaction. Disorienting jumps reduce task completion and satisfaction.
**Example:** Checking "International shipping" should expand additional address fields below in place — not cause the "International" checkbox to jump to a different position on screen. (MIX10 presentation, 2010; Web Form Design, 2008)

## 49. Content Grouping: Use Minimum Necessary Visual Structure

**Problem:** Form designers use excessive borders, background fills, and separators to indicate related field groups.
**Mainstream:** Heavy visual grouping via dividers, shaded backgrounds, and bordered boxes.
**Their approach:** Use the minimum number of visual elements necessary to communicate content relationships within a form. Every added visual element — border, fill, divider — must earn its place. More grouping does not equal more clarity; it equals more visual noise.
**Example:** "Shipping Address" as a label above three address fields is sufficient grouping. A border box, background color, and bold header around those same fields add noise without adding clarity. (Web Form Design, 2008)

## 50. HTML5 Input Types Trigger Device-Specific Keyboards

**Problem:** All form fields use the default alphanumeric keyboard, regardless of the type of data being requested.
**Mainstream:** Plain text input type used for all fields; user manually switches keyboard mode for numbers or email.
**Their approach:** Specifying HTML5 input types calls up the appropriate virtual keyboard automatically: `type="email"` adds @ and . keys; `type="url"` adds ., /, and .com keys; `type="number"` triggers the numeric keypad; `type="tel"` surfaces the dial pad. Browsers that don't support these types fall back gracefully to standard text. There is no downside to using them.
**Example:** Phone number field with `type="tel"`: user sees numeric dial pad immediately — no mode-switching required. Same field as `type="text"`: user gets full QWERTY and must manually switch to numbers. (Mobile First, 2011; MIX10 presentation, 2010)

# Accessibility Features

This document outlines the accessibility features implemented in the BYAMN Learning Platform to ensure an inclusive experience for all users.

## Overview

The BYAMN Learning Platform is committed to providing an accessible experience for users with disabilities, following WCAG 2.1 Level AA guidelines.

## Implemented Features

### 1. Keyboard Navigation

#### Course Cards
- **Focusable Elements**: All course cards are now keyboard accessible with `tabindex="0"`
- **Keyboard Activation**: Press `Enter` or `Space` to activate course cards
- **Visual Focus Indicators**: Clear blue outline appears when navigating with keyboard
- **ARIA Labels**: Screen readers announce course titles when focused

#### Navigation
- **Tab Order**: Logical tab order through all interactive elements
- **Skip to Main Content**: Press `Tab` on page load to reveal skip link
- **Focus Management**: Focus states are clearly visible on all interactive elements

### 2. Screen Reader Support

#### ARIA Attributes
- Course cards have `role="button"` for proper semantic meaning
- Descriptive `aria-label` attributes on all interactive elements
- Form inputs are properly associated with labels

#### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic HTML5 elements (header, main, footer, nav)
- Descriptive link text

### 3. Visual Accessibility

#### Focus Indicators
- High contrast focus outlines (3px solid blue)
- Focus states on all interactive elements
- Hover and focus states are visually distinct

#### Color Contrast
- Text meets WCAG AA contrast ratios
- Interactive elements have sufficient contrast
- Focus indicators are clearly visible

## Testing

### Keyboard Navigation Testing

1. **Tab Navigation**
   - Press `Tab` to navigate through interactive elements
   - Verify focus indicators are visible
   - Ensure logical tab order

2. **Course Card Activation**
   - Navigate to a course card using `Tab`
   - Press `Enter` or `Space` to activate
   - Verify navigation to course page

3. **Skip Link**
   - Press `Tab` on page load
   - Verify skip link appears
   - Press `Enter` to skip to main content

### Screen Reader Testing

Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Usage Guidelines

### For Keyboard Users

1. **Navigate**: Use `Tab` to move forward, `Shift+Tab` to move backward
2. **Activate**: Press `Enter` or `Space` on focused elements
3. **Skip Navigation**: Press `Tab` on page load and activate skip link

### For Screen Reader Users

1. **Course Cards**: Navigate by buttons or use heading navigation
2. **Forms**: All inputs have associated labels
3. **Landmarks**: Use landmark navigation for quick access to sections

## Future Improvements

- [ ] Add keyboard shortcuts for common actions
- [ ] Implement focus trap for modals
- [ ] Add live regions for dynamic content updates
- [ ] Enhance mobile touch target sizes
- [ ] Add high contrast mode toggle
- [ ] Implement reduced motion preferences

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)

## Reporting Issues

If you encounter any accessibility issues, please:
1. Open an issue on GitHub with the `accessibility` label
2. Describe the issue and steps to reproduce
3. Include your assistive technology details (if applicable)

## Contributing

We welcome contributions to improve accessibility! Please:
1. Follow WCAG 2.1 Level AA guidelines
2. Test with keyboard and screen readers
3. Document any new accessibility features
4. Include accessibility considerations in PR descriptions

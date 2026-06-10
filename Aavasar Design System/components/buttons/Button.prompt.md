Solid-slate primary action button with `secondary` (ghost), `outline`, and `danger` variants; `onDark` inverts it for slate panels.

```jsx
<Button variant="primary" size="md">Sign Up</Button>
<Button variant="secondary">Log In</Button>
<Button variant="outline" iconLeft={<i data-lucide="settings" />}>Edit Profile</Button>
<Button onDark>Hire Talent</Button>
```

Sizes: `sm` (36px), `md` (40px), `lg` (48px). Use `full` to stretch to container width (common on forms and feature cards). On dark slate surfaces, `primary` becomes a white button with dark text.

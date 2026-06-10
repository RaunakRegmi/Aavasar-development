Layout + data primitives: `Card` (base container), `StatCard` (dashboard KPI tile), and `Avatar`.

```jsx
<Card>Default white bordered card</Card>
<Card tone="dark" radius="xl">Slate feature card</Card>
<StatCard label="Total Earnings" value="NPR 1,24,000" icon={<i data-lucide="banknote" />} iconTone="slate" />
<StatCard label="Active Gigs" value="14" delta="+2 this week" icon={<i data-lucide="briefcase" />} />
<Avatar name="Priya Sharma" />
<Avatar src="/assets/photos/peer-network.jpg" name="Pratikshya" size={56} />
```

`Card` tones: `default` (bordered+shadow), `flat`, `well` (recessed gray), `dark` (slate feature), `earth` (learning). Set `interactive` for a hover lift on clickable cards.

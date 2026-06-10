Status `Badge` (pill), skill/meta `Tag` (chip), and `ProgressBar`.

```jsx
<Badge tone="active">In Progress</Badge>
<Badge tone="submitted">Submitted</Badge>
<Badge tone="premium">Premium</Badge>
<Tag>Remote</Tag>  <Tag variant="brand">FIGMA</Tag>
<ProgressBar value={85} />            {/* profile completion */}
<ProgressBar value={68} onDark />     {/* course card on slate */}
```

Badge tones map to status semantics: `active/success` = green, `submitted/reviewing/info` = blue, `draft/neutral` = gray, `rejected/danger` = red, `premium` = solid slate.

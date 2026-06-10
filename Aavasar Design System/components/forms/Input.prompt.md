Form primitives: labeled `Input` (with helper/error + password reveal), `SegmentedControl` (Student/Recruiter toggle), and `Checkbox`.

```jsx
<Input label="Work Email" type="email" placeholder="john@university.edu" helper="Use your campus email" />
<Input label="Password" passwordToggle helper="Must be at least 8 characters" />
<SegmentedControl options={[{value:'student',label:'Student'},{value:'recruiter',label:'Recruiter'}]} value={role} onChange={setRole} />
<Checkbox checked={agree} onChange={e=>setAgree(e.target.checked)} label="I agree to the Terms of Service and Privacy Policy." />
```

Inputs use an 8px radius and a 3px slate focus ring. Pass `error` to turn the border red and show the message.

# 🚀 Quick Start Guide

## Your Component System is Ready!

Everything is set up and working. Here's how to use it:

---

## 📦 Using Components

### Import from the index file:
```jsx
import { Button, Card, Badge, Input } from './components/ui';
import { SearchBar, Pagination, EmptyState } from './components/common';
```

---

## 🎨 Common Patterns

### 1. Button
```jsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Button as Link
<Button variant="primary" asChild>
  <Link to="/books">Browse Books</Link>
</Button>

// Loading button
<Button variant="primary" loading={isLoading}>
  Submit
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <ShoppingCart size={20} />
</Button>
```

### 2. Card
```jsx
<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
  <Button variant="primary">Action</Button>
</Card>
```

### 3. Badge
```jsx
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Urgent</Badge>
```

### 4. Form Inputs
```jsx
<Input
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email"
  error={errors.email}
  required
/>

<Textarea
  name="message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={4}
  placeholder="Your message"
/>

<Select
  name="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' }
  ]}
/>
```

### 5. Search Bar
```jsx
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search books..."
/>
```

### 6. Empty State
```jsx
<EmptyState
  icon={BookOpen}
  title="No books found"
  description="Try adjusting your search or filters"
  action={
    <Button variant="primary" onClick={handleReset}>
      Clear Filters
    </Button>
  }
/>
```

### 7. Loading State
```jsx
{loading ? (
  <Spinner size="lg" />
) : (
  <div>Your content</div>
)}
```

---

## 🎯 Component Variants

### Button Variants
- `primary` - Blue, main actions
- `secondary` - Gray, secondary actions
- `outline` - Bordered, subtle actions
- `ghost` - Transparent, minimal actions
- `danger` - Red, destructive actions

### Button Sizes
- `sm` - Small (compact)
- `md` - Medium (default)
- `lg` - Large (prominent)
- `xl` - Extra large (hero)
- `icon` - Icon only (square)

### Badge Variants
- `primary` - Blue
- `secondary` - Gray
- `success` - Green
- `warning` - Yellow
- `danger` - Red
- `outline` - Bordered

---

## 📖 Full Documentation

For complete API reference, see:
- **COMPONENT_GUIDE.md** - Complete component APIs
- **README_COMPONENTS.md** - Getting started guide
- **QUICK_REFERENCE.md** - More patterns and examples

---

## ✅ Everything Works!

- ✅ Build successful
- ✅ All components working
- ✅ No warnings or errors
- ✅ Production ready

---

## 🎉 You're All Set!

Start building features with your new component system. Everything is consistent, documented, and ready to use!

**Happy coding!** 🚀

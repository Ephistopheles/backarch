# i18n System Documentation

## Overview

BackArch uses a **lightweight custom i18n system** for internationalization. The system is designed to be minimal, type-safe, and keep the core architecture layer completely language-agnostic.

## Architecture Principles

### ✅ What Gets Translated
- UI labels and buttons
- Inspector panel text
- Validation messages displayed to users
- Component type labels in the sidebar
- Empty states and help text
- Form labels and placeholders

### ❌ What Stays in English
- **Core logic**: All code in `src/core/` remains language-agnostic
- **Validation codes**: Rules return stable string codes like `"service.must_connect_repository"`
- **User-created names**: Node names, custom labels
- **Technical identifiers**: Stack names (Node.js, Spring Boot), architecture patterns, HTTP methods
- **Generated code**: Backend code is always generated in English
- **IDs and keys**: Internal identifiers

## Structure

```
src/i18n/
├── en.json       # English translations
├── es.json       # Spanish translations  
└── index.ts      # Translation system implementation
```

## Usage

### Basic Translation

```typescript
import { t } from '../i18n';

// Simple translation
const label = t("header.stack");

// Nested keys
const message = t("validation.title");

// Component types
const componentLabel = t("componentTypes.service");

// Validation messages (mapped from codes)
const validationMsg = t(`validationMessages.${code}` as never);
```

### In Components

Components automatically re-render when the language changes by subscribing to the language state:

```typescript
export function MyComponent() {
  // Force re-render on language change
  useAppStore((s) => s.language);

  return <h1>{t("header.title")}</h1>;
}
```

### Language Toggle

The language is toggled via the header button:

```typescript
const language = useAppStore((s) => s.language);
const setLanguage = useAppStore((s) => s.setLanguage);

const toggleLanguage = () => {
  const newLang = language === 'en' ? 'es' : 'en';
  setLanguage(newLang);
};
```

## State Management

Language preference is stored in:
1. **Zustand store**: `language: "en" | "es"`
2. **localStorage**: `backarch-language` key for persistence

The system initializes from localStorage on app start:

```typescript
// In store initialization
language: initI18n(),
```

## Validation System Integration

### Core Layer (Language-Agnostic)

Validation rules in `src/core/rules/` return **codes**, not messages:

```typescript
export interface ValidationResult {
  id: string;
  severity: ValidationSeverity;
  code: string; // e.g., "service.must_connect_repository"
  nodeId?: string;
}
```

### UI Layer (Translates Codes)

The UI maps codes to translated messages:

```typescript
// In ValidationPanel.tsx
<span>{t(`validationMessages.${item.code}`)}</span>
```

This separation ensures:
- Core logic remains language-independent
- Validation rules can be tested without i18n
- Messages can change without modifying core code

## Adding New Translations

### 1. Add Keys to Translation Files

**en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

**es.json:**
```json
{
  "myFeature": {
    "title": "Mi Funcionalidad",
    "description": "Descripción de la funcionalidad"
  }
}
```

### 2. Use in Components

```typescript
import { t } from '../i18n';

function MyFeature() {
  useAppStore((s) => s.language); // Force re-render
  
  return (
    <div>
      <h2>{t("myFeature.title")}</h2>
      <p>{t("myFeature.description")}</p>
    </div>
  );
}
```

## Type Safety

The system provides TypeScript autocomplete for translation keys:

```typescript
type TranslationKey = DeepKeys<Translations>;

// This gives autocomplete for all nested keys:
t("header.stack") ✅
t("header.invalid") ❌ // Type error
```

## Default Language

- **Default**: English (`en`)
- **Fallback**: If a key is missing, the key itself is returned
- **Console warnings**: Missing keys are logged in development

## Supported Languages

Currently supported:
- **English** (`en`)
- **Spanish** (`es`)

To add a new language:
1. Create `{lang}.json` in `src/i18n/`
2. Add to `Language` type in `index.ts`
3. Add to `translations` object
4. Update language toggle logic in Header

## Best Practices

### ✅ Do
- Keep translation keys semantic: `"validation.title"` not `"val_ttl"`
- Group related translations under common prefixes
- Always use translation keys for user-facing text
- Test both languages during development
- Keep core/ folder completely language-agnostic

### ❌ Don't
- Hard-code user-facing strings
- Put translations in core logic
- Translate technical identifiers (stack names, HTTP methods)
- Mix translated and non-translated strings in the same UI element
- Use `any` type casting (use `never` for dynamic keys)

## Examples

### Component Type Labels
```typescript
// types/index.ts
export function getComponentLabel(type: NodeType): string {
  return t(`componentTypes.${type}` as never);
}
```

### Validation Messages
```typescript
// ValidationPanel.tsx
{items.map(item => (
  <div key={item.id}>
    {t(`validationMessages.${item.code}` as never)}
  </div>
))}
```

### Dynamic Pluralization
```typescript
const count = items.length;
const text = count === 1 
  ? t("validation.issue") 
  : t("validation.issues");
```

## Testing

When writing tests:
- Mock the `t` function to return keys or test strings
- Test both language versions for critical UI flows
- Verify that validation codes (not messages) are returned from core logic
- Ensure localStorage persistence works correctly

## Performance

The i18n system is lightweight:
- No external dependencies
- Direct object lookups (O(1) per key segment)
- Minimal re-renders (only when language changes)
- Translations loaded statically at build time

## Future Improvements

Potential enhancements:
- Variable interpolation: `t("welcome", { name: "User" })`
- Pluralization rules per language
- Date/number formatting
- Dynamic translation loading (code splitting)
- Translation management UI

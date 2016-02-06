# Focus With Hover

Rule `focus-with-hover` will enforce the use of the focus pseudo class where the hover pseudo class is used and vice versa.

## Examples

When enabled, the following are disallowed:

```scss
.foo {
  &:hover {
    color: #333;
  }
}

.bar {
  &:focus {
    color: #333;
  }
}
```

When enabled, the following are allowed:

```scss
.foo {
  &:hover {
    color: #333;
  }

  &:focus {
    color: #333;
  }
}

.bar {
  &:hover,
  &:focus {
    color: #333;
  }
}
```

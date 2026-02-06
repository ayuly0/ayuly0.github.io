# Writing Posts Cheatsheet

This guide covers all the custom features and best practices for writing posts on Ayuly's Blog.

## 📝 Basic Frontmatter

Every post must start with a YAML frontmatter block:

```yaml
---
title: Your Title
date: YYYY-MM-DD
category: Security # (Used for grouping in the Category page)
tags:
  - Malware
  - Dev
---
```

---

## 🔒 Password Protection

To encrypt a section of your post, use the `::: protection` container. Content inside this block is encrypted at build-time and decrypted client-side.

**Syntax:**
```markdown
::: protection :: your-strong-password
### Hidden Content
Only people with the password can see this.
:::
```

---

## 🎨 Custom Containers

Use these to highlight specific types of information.

### Tip
```markdown
::: tip
This is for helpful hints or best practices.
:::
```

### Warning
```markdown
::: warning
Use this for things the reader should be careful about.
:::
```

### Danger
```markdown
::: danger
Use this for critical errors or security risks.
:::
```

---

## 🖼️ Banners & Images

### Post Banner
To add a banner at the top of your post, add `heroImage` to the frontmatter:

```yaml
---
title: Post with Banner
heroImage: /images/your-banner.jpg
---
```

### Regular Images
Use standard Markdown syntax for images:
`![Description](/images/image.png)`

---

## 💻 Code Blocks

Use triple backticks with a language specifier for syntax highlighting:

```python
def pwn():
    print("Happy Hacking!")
```

---

## 🛠️ Tooling

### Create a New Post
Run this command from the root directory:
```bash
npm run new-post "Your New Post Title"
```
This will automatically generate a slug-friendly file in `blog/posts/` with a template.

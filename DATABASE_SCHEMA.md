# Database Schema

This project uses MongoDB with Mongoose. It currently has two main collections: `users` and `uploads`.

## 1) User Model (`users`)

```js
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}
```

### Notes

- `username` is unique and trimmed before storage.
- `password` stores a bcrypt hash (not a raw password).
- Mongoose timestamps are enabled (`createdAt`, `updatedAt`).

## 2) Upload Model (`uploads`)

```js
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    default: null
  },
  file: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String
  },
  shareToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  },
  maxViews: {
    type: Number,
    default: 100
  },
  currentViews: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: 100
  },
  currentDownloads: {
    type: Number,
    default: 0
  },
  sharePassword: {
    type: String,
    default: null
  },
  isPasswordProtected: {
    type: Boolean,
    default: false
  }
}
```

### Notes

- `user` references the owner in `users._id`.
- Upload can contain either `text` or `file` metadata .
- `shareToken` is the public-safe token used in share links.
- `expiresAt` defaults to 10 minutes from creation if no custom expiry is provided.
- `maxViews/currentViews` and `maxDownloads/currentDownloads` enforce access limits.
- `sharePassword` stores a bcrypt hash when password protection is enabled.
- `isPasswordProtected` indicates whether password checks are required on access.
- Mongoose timestamps are enabled (`createdAt`, `updatedAt`).

## Relationships

- `uploads.user` references `users._id` (required one-to-many relationship).
- One user can own many upload records.

## Index Strategy

- `users.username` (unique index)
- `uploads.shareToken` (unique, indexed)

These indexes are used for:

- auth lookup by `username`
- fast public link resolution by `shareToken`

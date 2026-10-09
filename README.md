# Online-Portfolio

## Supabase setup

The app does not require an account or sign-in. Run the single setup script,
`supabase/setup.sql`, in the Supabase SQL Editor. It adds the required fields
and four narrowly scoped RPC functions. Direct anonymous access to the table
is revoked; each portfolio can be read, edited, or deleted only with its random
per-portfolio access token, which the browser saves in local storage.

The SQL file configures the database but does not run automatically when the
app starts. Running it in the Supabase SQL Editor is still required.

The token is a bearer credential: anyone who obtains it can manage that
portfolio. Do not include it in a URL or share it. Old portfolio rows remain in
the database, but rows created before this token system cannot be managed by
the app because there is no secure way to prove ownership without sign-in.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in
`.env.local`. These are the project URL and publishable (formerly anon) key;
never put a service-role key in a `NEXT_PUBLIC_` variable or client code.

## Run and test

```bash
npm install
npm run dev
```

Open `/`, choose **Generate a Portfolio**, enter your details, and save. Select
Simple, Modern, or Creative on `/templates`. Use **Edit information** or
**Delete** on the generated portfolio page to manage the saved record. Start the
server with `npm run dev`; run `npm run lint` and `npm run build` for checks.

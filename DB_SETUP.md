# GitHub as a Backend Setup Guide

This application uses a separate GitHub repository as a "serverless database" to store user profiles and metrics.

## Prerequisites

1.  A GitHub account.
2.  A new, **empty** repository to act as the database.
3.  A GitHub Personal Access Token (PAT).

## Step 1: Create the Database Repository

1.  Go to [github.com/new](https://github.com/new).
2.  Name your repository (e.g., `miniature-spoon-db`).
3.  Set it to **Public** or **Private** (Private is recommended for privacy, but the app needs access).
4.  **Important**: Initialize it with a `README.md` so the `main` branch exists.
5.  Click **Create repository**.

## Step 2: Generate a Personal Access Token (PAT)

1.  Go to [GitHub Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens).
2.  Click **Generate new token (classic)**.
3.  Give it a name (e.g., `Miniature Spoon App`).
4.  **Scopes**:
    *   `repo` (Full control of private repositories) - Required if your DB repo is private.
    *   `public_repo` (Access public repositories) - Required if your DB repo is public.
5.  Click **Generate token**.
6.  **Copy the token immediately**. You won't see it again.

## Step 3: Configure the Application

1.  In your local environment, create a `.env.local` file in the root directory.
2.  Add the following variables:

```bash
VITE_GITHUB_TOKEN=your_generated_token_here
VITE_DB_OWNER=your_github_username
VITE_DB_REPO=miniature-spoon-db
```

3.  Restart your development server:
    ```bash
    npm run dev
    ```

## Step 4: Deploying (Optional)

If you are deploying this app (e.g., to Vercel or GitHub Pages), you must add these environment variables to your deployment settings.

**Security Note**: Since this is a client-side application, your PAT is exposed in the build. It is recommended to create a dedicated "Bot Account" for this purpose with limited access, rather than using your main account's token.

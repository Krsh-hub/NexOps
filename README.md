# NexOps AI Operations Platform

NexOps is an AI-native operational platform for SMBs. This project uses Next.js 15, Prisma ORM, and Supabase PostgreSQL.

## Database Setup (Supabase PostgreSQL)

NexOps requires a PostgreSQL database to function. We recommend using Supabase.

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create an account/project.
2. Once your project is created, navigate to **Project Settings** -> **Database**.

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Find your connection strings in the Supabase Dashboard:
- **`DATABASE_URL`**: Look for the **Connection Pooling** connection string (ensure pooling is enabled, usually port `6543`, with `?pgbouncer=true` or similar at the end).
- **`DIRECT_URL`**: Look for the **Direct Connection** string (standard PostgreSQL port `5432`). This is required by Prisma for running migrations safely.

Add these to your `.env` file along with your `OPENAI_API_KEY`.

### 3. Run Migrations & Seed Data
Once your `.env` is configured with your Supabase credentials, run the following commands to construct your database schema and populate it with demo café data:

```bash
# Generate the Prisma Client
npx prisma generate

# Push the schema to your Supabase database
npx prisma db push

# Seed the database with sample operations data
npm run db:seed
```
*(Note: Since this is an MVP, we are using `db push` for rapid prototyping. For production, you may want to use `npx prisma migrate dev --name init` instead.)*

## Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the AI Operations Cockpit.

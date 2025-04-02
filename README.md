![screenshot](https://github.com/Blaarslaai/my-lma/blob/master/public/banner.png)

# Welcome to My-LMA <sub>Loan Application Management</sub> System

## Tech Used

- Front-End

  1. React
  2. Typescript
  3. Tailwind CSS
  4. shadcn/ui

- Back-End

  1. Next.js Server Actions
  2. PostGreSQL
  3. Prisma ORM

- AI Tools

  1. ollama
  2. GitHub Copilot
  3. ChatGPT

# Local Setup Guide

Please follow the steps below to get the project running on your local

1. run the following commands:

```bash
git clone https://github.com/Blaarslaai/my-lma.git

npm install
```

2. Download and Install [PostGreSQL](https://www.postgresql.org/download/)

- Start PostgreSQL via pgAdmin

- Create new database and customize your .env DATABASE_URL variable to your:

  - Username
  - Password
  - Database Name

- Run the following script in your database:

```sql
-- Create enum type for LoanStatus
CREATE TYPE "LoanStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PAID',
  'OVERDUE'
);

-- Create Loan table
CREATE TABLE "Loan" (
  id SERIAL PRIMARY KEY,  -- Auto incrementing primary key
  customerName VARCHAR(255) NOT NULL,  -- Name of the customer
  customerEmail VARCHAR(255) NOT NULL,  -- Email of the customer
  customerPhone VARCHAR(20) NOT NULL,  -- Phone number of the customer
  customerSalary FLOAT NOT NULL,  -- Salary of the customer
  loanAmount FLOAT NOT NULL,  -- Amount of the loan
  interestRate FLOAT[] NOT NULL,  -- Interest rate for the loan
  loanTerm INT NOT NULL,  -- Loan term in months
  startDate TIMESTAMP NOT NULL,  -- Loan start date
  endDate TIMESTAMP NOT NULL,  -- Loan end date
  monthlyPayment FLOAT NOT NULL,  -- Monthly payment for the loan
  totalRepayment FLOAT NOT NULL,  -- Total amount to be repaid including interest
  loanStatus "LoanStatus" NOT NULL,  -- Loan status using the enum type
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the loan was created
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the loan was last updated
);

-- Add trigger to update the 'updatedAt' field on any update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  Loan."updatedAt" = CURRENT_TIMESTAMP;
  RETURN Loan;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON "Loan"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

3. Download and Install [ollama](https://ollama.com/)

4. Run the following commands to setup ollama

```bash
ollama pull llama3

ollama serve
```

- Edit your .env.local file and add the following value for local testing: `OLLAMA_BASE_URL=http://localhost:11434`

5. Run the following Prisma setup commands

```bash
Prisma Generate
```

# Production Setup Guide

1. Download and Install ngrok for local IP forwarding.

- This will be used to access our local OLLAMA model on Vercel (Our Deployment platform)

```bash
ngrok http 11434
```

- Edit your .env file and add the following value for production testing: `OLLAMA_BASE_URL=<public URL from ngrok>`

- [Production Hosting Url](https://my-lma.vercel.app/)

# AI Usage - NOTE!!!

If you wish to run the AI model, ADD the following to your environment file: `NEXT_PUBLIC_ENV=AI`
Otherwise, the system will override the AI functionality and just generate values.

Please NOTE, your machine has to be strong enough to run a local AI model, otherwise the delay in responses will be tremendous!

# SkillBountyX

SkillBountyX is a Decentralized Skill Bounty Marketplace powered by the Stellar blockchain. It allows users to post micro-tasks and freelancers to complete them and receive payments securely using Stellar testnet assets.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, `@stellar/freighter-api`
- **Backend**: Node.js, Express, MongoDB (Mongoose), `@stellar/stellar-sdk`

## Project Structure
This project is structured as a monorepo containing two separate applications:
- `frontend/` - The Next.js web application
- `backend/` - The Node.js API server

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Create a `.env` file in the `backend/` directory by copying the `.env.example`:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skillbountyx
   JWT_SECRET=super_secret_jwt_key
   ESCROW_SECRET_KEY=S... (generate on Stellar Laboratory)
   ESCROW_PUBLIC_KEY=G...
   ```
   *Note: If you don't provide an ESCROW_SECRET_KEY, the backend will simulate payments instead of actually sending XLM.*

4. Run the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Wallet Setup (Freighter)
1. Install the [Freighter browser extension](https://www.freighter.app/).
2. Switch the Freighter network to **Testnet**.
3. Fund your Freighter wallet using the Stellar Testnet Faucet.

## Using the Platform
1. Open `http://localhost:3000` in your browser.
2. Click **Connect Wallet** to link your Freighter account and register automatically.
3. Post a bounty and set the required skills and XLM reward.
4. Have another user (or another wallet) accept the task and submit a URL with their work.
5. As the creator, review the submission on the Dashboard -> Manage page, and click **Approve & Pay**.
6. The backend will use the Escrow wallet to transfer the XLM directly to the freelancer's wallet.

## Features
- **User Authentication**: Secure JWT-based auth linked to your Freighter public key.
- **Bounty Creation**: Define task requirements, deadlines, and XLM rewards.
- **Freelancer Submissions**: Submit proof of work (GitHub links, Figma, etc).
- **Stellar Payments**: Automated testnet XLM release upon work approval.
- **Modern UI**: Built with Tailwind CSS and Framer Motion for a sleek dark theme.

## Deployment

### Deploying the Frontend to Netlify
Netlify is excellent for deploying Next.js frontends. Since this is a monorepo, follow these steps:
1. Push your repository to GitHub.
2. Log in to Netlify and click **"Add new site"** -> **"Import an existing project"**.
3. Select your GitHub repository.
4. In the build settings, configure the following:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. If your backend is deployed (e.g. on Render/Railway), add a new Environment Variable in Netlify:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`
6. Click **Deploy site**.

### Deploying the Backend
The backend runs on Express and requires a Node.js server. Netlify is primarily for serverless functions, so it is recommended to deploy the backend to a service like **Render** or **Railway**. You will need to provide your `MONGO_URI`, `JWT_SECRET`, and `ESCROW` keys in the environment variables of your hosting provider.

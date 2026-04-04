# Project Overview: Enterprise Travel Procurement Landing Page

This repository contains the marketing frontend for an Autonomous Procurement Agent designed for B2B enterprise travel (hotels, airlines, corporate events).

**Core Product Pillars (Context for Copy/Layout):**

1. **Persistent Vendor Memory:** The primary differentiator. Agents remember past concession patterns and historical pricing DNA.
2. **Omnichannel Execution:** Agents don't just chat; they autonomously call, email, and ping APIs to secure deals.
3. **Continuous Sourcing:** Replaces the annual RFP with real-time, dynamic multi-agent negotiation.

# Technology Stack

- **Framework:** Next.js (App Router).
- **Language:** TypeScript (Strict mode enabled).
- **Styling:** Tailwind CSS (utility-first).
- **Animation:** Framer Motion (used sparingly for subtle reveal effects).
- **Deployment:** Vercel.

# Design System & UI/UX Guidelines

The aesthetic must strictly model the intentional, high-conversion design of the modern Shopify landing page.

- **Anti-AI Aesthetic:** DO NOT use glowing nodes, digital brains, matrix rain, or generic futuristic cyberpunk elements. Keep it grounded, corporate, and trustworthy.
- **Typography:** Inter or system sans-serif. Use high contrast. Headlines should be massive, bold, and tightly tracked. Paragraphs should be highly readable with ample line height.
- **Color Palette:** - Backgrounds: Off-white (`#fbfbfb`) or pure white.
  - Text: Deep charcoal (`#111827`) or black.
  - Primary Accent/CTA: A single solid vibrant color (e.g., deep emerald or indigo) for buttons. No gradients on buttons.
- **Layouts:** Use generous whitespace (padding/margins). Utilize Bento-box style CSS grids for feature showcases. Sticky, minimalist top navigation.

# Coding Standards & Architecture

- Use functional React components with hooks.
- Favor server components by default in the Next.js App Router; use `"use client"` only at the leaves of the component tree where interactivity (like Framer Motion) is strictly required.
- Extract reusable UI elements (buttons, cards) into a `components/ui/` directory.
- Keep Tailwind classes organized; avoid writing arbitrary custom CSS unless absolutely necessary.

# Claude Code Behavioral Directives (CRITICAL FOR TOKEN EFFICIENCY)

1. **Execute Silently:** Do not output conversational filler, introductory explanations, or summaries of what you did. Just output the code and terminal commands.
2. **Complete Implementation:** Do not use placeholders like `// Add content here` or `/* TODO */`. Write the complete, production-ready code with the provided copy or highly relevant contextual copy.
3. **No Hallucinated Assets:** Do not write `<img src="placeholder.jpg" />`. If visual elements are needed, build abstract UI representations using pure Tailwind CSS shapes and flex/grid layouts.
4. **Self-Correction:** If a build error occurs (e.g., TypeScript type mismatch), fix it silently without asking for permission.

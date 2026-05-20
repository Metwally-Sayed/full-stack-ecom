# Mini Shop Mobile

Expo SDK 55 app scaffolded under `mobile/` and prepared for local Expo MCP usage.

## Prerequisites

- Expo account with an EAS paid plan for the remote Expo MCP server
- Codex Expo MCP server added and authenticated in your local Codex setup
- Xcode Simulator or Android emulator if you want local automation tools

## Environment

1. Copy `.env.example` to `.env`.
2. Fill in `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

Current variables:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
EXPO_PUBLIC_SUPABASE_URL=https://dekrjvlxwxoxwjosmwss.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Install

```bash
npm install
```

## Start With Expo MCP

Authenticate the Expo CLI once if needed:

```bash
npx expo whoami || npx expo login
```

Start the local development server with MCP capabilities enabled:

```bash
npm run mcp:start
```

For web-only testing:

```bash
npm run mcp:web
```

Important behavior:

- `expo-mcp` is installed as a dev dependency.
- Local MCP capabilities are only available while the Expo dev server is running with `EXPO_UNSTABLE_MCP_SERVER=1`.
- Each time you start or stop that dev server, restart or reconnect the MCP server in your AI tool so it refreshes the available local capabilities.

## What This Enables

With the local Expo MCP server active, AI tools that successfully load Expo MCP can use capabilities such as:

- taking app screenshots
- tapping views by coordinate or `testID`
- opening React Native DevTools
- collecting app logs
- reading the Expo Router sitemap

## Realtime Notes

Product realtime integration guidance for the mobile app is in [REALTIME_PRODUCTS.md](./REALTIME_PRODUCTS.md).

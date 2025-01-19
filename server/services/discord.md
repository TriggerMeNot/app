# Discord OAuth2

Go To [Discord Developer Portal — My Applications](https://discord.com/developers/applications) and create a new application.

## Define the Discord Application
Set the name and accept the terms.

## Get the Client ID and Client Secret
Go to the OAuth2 section
Reset the Client Secret

Copy the Client ID and Client Secret and paste them in the `.env`/`.env.dev` file

```env
DISCORD_ID=your-client-id
DISCORD_SECRET=your-client-secret
```

## Get the Bot Token
Go to the Bot section

Set the "Requires OAuth2 Code Grant" to true

Reset the Bot Token

Copy the Bot Token and paste it in the `.env`/`.env.dev` file

```env
DISCORD_BOT_TOKEN=your-bot-token
```

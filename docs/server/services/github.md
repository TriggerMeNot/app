# Github OAuth2

Go To [Github - Register new GitHub App](https://github.com/settings/apps/new) and create a new OAuth App.

## Define the GitHub App
Complete the mandatory fields
- GitHub App name
- Homepage URL

## Set the Callback URL
Set the Callback URL
- `{BASE_URL}/login/github`
- `{BASE_URL}/services/github`

## Set the Webhook
Activate the Webhook
Set the Webhook URL
- `{BASE_URL}/github/webhook`

## Set the Permissions
Allow the application to be installed by any account

Repository permissions
- Issues: Read & Write
- Metadata: Read-only
- Pull requests: Read-only

Account permissions
- Email addresses: Read-only

Subscribe to events
- Pull request

Create the GitHub App

## Get the Client ID, Client Secret and Github App name

Copy the Client ID and Github App name and paste them in the `.env`/`.env.dev` file

```env
GITHUB_ID=your-client-id
GITHUB_APP=your-github-app-name
```

Generate a new Client Secret and paste it in the `.env`/`.env.dev` file

```
GITHUB_SECRET=your-client-secret
```

And save changes

# Google OAuth2

Go To [New Project - Google Cloud Console](https://console.cloud.google.com/projectcreate) and create a new project.

## Define the Google Project

Set the project name.

## Set the OAuth Consent Screen
Go to the [OAuth consent screen](https://console.cloud.google.com/auth/overview/create) and set the application name.

Complete App Information  information
Set Audience as External
Complete other mandatory fields
Create the OAuth consent screen

## Add Scopes
Go to the [Data Access](https://console.cloud.google.com/auth/scopes) and add the following scopes:

- .../auth/userinfo.email     See your primary Google Account email address
- https://mail.google.com/	Read, compose, send, and permanently delete all your email from Gmail

And save changes

## Create the OAuth Client
Go to the [OAuth Client](https://console.cloud.google.com/auth/clients/create) and create a new OAuth client.

Select Web Application as the Application type

Add `{BASE_URL}` as the Authorized JavaScript origins

Add `{BASE_URL}/login/google` and `{BASE_URL}/services/google` as the Authorized redirect URIs

And save changes

## Get the Client ID and Client Secret
Return to the OAuth Client and copy the Client ID and Client Secret and paste them in the `.env`/`.env.dev` file

```env
GOOGLE_ID=your-client-id
GOOGLE_SECRET=your-client-secret
```

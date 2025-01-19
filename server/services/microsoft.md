# Microsoft Oauth2

Go To [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade).

## Define the Microsoft Application
Define the application name.
Set the supported account types to "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".

And Register the application.

## Set the Redirect URI
Go to the Home > App Registrations > {Your App} > Authentication

Add a platform, select Web and add the Redirect URI as `{BASE_URL}/login/microsoft` and save changes.

Click on Configure

Add a new Redirect URI as `{BASE_URL}/services/microsoft` and save changes.

## Set the API Permissions

Go to the Home > App Registrations > {Your App} > API permissions

Click on Add a permission
Select Microsoft Graph > Delegated permissions and add the following permissions:
OpenId permissions
- email
- offline_access
- profile
Mail
- Mail.Read
- Mail.Send

## Get the Tenant ID and Client ID
Go to the Home > App Registrations > {Your App} > Overview

Copy the Tenant ID and Client ID and paste them in the `.env`/`.env.dev` file

```env
MICROSOFT_TENANT=your-tenant-id
MICROSOFT_ID=your-client-id
```

## Get the Client Secret
Go to the Home > App Registrations > {Your App} > Certificates & secrets

Add a new client secret and copy the value and paste it in the `.env`/`.env.dev` file

```env
MICROSOFT_SECRET=your-client-secret
```

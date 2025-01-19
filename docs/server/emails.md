# Setup email system
For sending emails, we use [Resend](https://resend.com/)

## Create an account
Go to [Resend](https://resend.com/) and create an account.

## Get your API key
Get an API key from [API Keys - Resend](https://resend.com/api-keys) and paste it in the `.env`/`.env.dev` file

```env
RESEND_API_KEY=your-api-key
```

## Setting up the domain in Resend

1. Go to [Domains - Resend](https://resend.com/domains)
2. Add your domain
   1. Add the proper DNS records to your domain on your DNS provider :
      1. MX record
      2. 2 TXT records
      3. an optional TXT record (for DMARC)
    2. Verify the domain
3. Create an api key for the domain

## Add the domain to the `.env`/`.env.dev` file

```env
RESEND_DOMAIN=your-domain
```

Now TriggerMeNot is ready to send emails!

::: tip
DMARC is optional but recommended, it helps to prevent email spoofing.
:::

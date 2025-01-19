# Install with docker

To install with docker, you'll need **docker compose**.

## Step 1: Clone the repository

```bash
git clone https://github.com/AREA-equipe/app.git
```

## Step 2: Go to the project directory

```bash
cd app
```

## Step 3: Create a `.env` file in the backend directory

```bash
cd backend
touch .env
```

::: tip
You can copy the content of the `.env.example` file and paste it into the `.env` file.  
You need to fill the environment variables with your own values, or the application won't run.
:::

## Step 4: Run the docker-compose

```bash
cd ..
docker compose up
```

::: tip
You can also run the docker-compose in the background with the `-d` flag.
:::

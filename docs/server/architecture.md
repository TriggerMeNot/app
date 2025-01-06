# Architecture

## Folders

- `github/workflows`: Github actions
- `.vscode`: VSCode settings
- `app`: Main folder
    - `actions`: TriggerMeNot actions (block trigger by external services)
    - `controllers`: Implementation of the routes
    - `db`: Database config and default data
    - `interfaces`: Zod type for the routes
    - `middlewares`: Middlewares for the routes
    - `reactions`: TriggerMeNot reactions (block trigger from other blocks)
    - `routes`: Routes of the app
    - `schemas`: Zod schemas for the database
    - `types`: Typescript types
    - `utils`: Utility functions
- `static`: Static files

## Root files

- `.env.dev.example`: Example of the development environment variables
- `.env.prod.example`: Example of the production environment variables
- `.gitignore`: Git ignore file
- `compose.yml`: Docker compose file for development
- `compose.prod.yml`: Docker compose file for production
- `deno.json`: Deno configuration file
- `deno.lock`: Deno lock file
- `Dockerfile`: Docker file for the app
- `drizzle-kit.json`: Drizzle Kit configuration file
- `Readme.md`: Readme file

## Testing

All the tests files end with `.test.ts` and are located in the same folder as the file to test.

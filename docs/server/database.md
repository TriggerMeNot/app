# Database

## Tech Stack

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

- Powerful and open-source relational database
- Supports JSON and JSONB data types

Comparison with MySQL, SQLite, and MongoDB:

| PostgreSQL | MySQL      | SQLite      | MongoDB  |
| ---------- | ---------- | ----------- | -------- |
| Powerful   | Popular    | Lightweight | Flexible |
| SQL        | SQL        | SQL         | NoSQL    |
| Relational | Relational | Relational  | Document |

## Schema

```mermaid
erDiagram

oauths {
    serial id PK
    integer user_id
    integer service_id
    text service_user_id
    text token
    integer token_expires_at
    text refresh_token
    integer refresh_token_expires_at
}

playgrounds {
    serial id PK
    text name
    integer user_id
}

reactionLinks {
    serial id PK
    integer trigger_id
    integer reaction_id
}

actions {
    serial id PK
    integer service_id
    text name
    text description
    jsonb settings
    jsonb params
}

reactionsPlayground {
    serial id PK
    integer playground_id
    integer reaction_id
    jsonb settings
    integer x
    integer y
}

oidcs {
    serial id PK
    integer user_id
    integer service_id
    text service_user_id
    text token
    integer token_expires_at
    text refresh_token
    integer refresh_token_expires_at
}

users {
    serial id PK
    text email
    text username
    text password
}

services {
    serial id PK
    text name
    text description
}

actionsPlayground {
    serial id PK
    integer playground_id
    integer action_id
    jsonb settings
    jsonb params
    integer x
    integer y
}

actionLinks {
    serial id PK
    integer trigger_id
    integer reaction_id
}

crons {
    serial id PK
    integer action_playground_id
    text cron
}

reactions {
    serial id PK
    integer service_id
    text name
    text description
    jsonb settings
}

oauths ||--o{ users : "user_id"
oauths ||--o{ services : "service_id"
playgrounds ||--o{ users : "user_id"
reactionLinks ||--o{ reactionsPlayground : "trigger_id"
reactionLinks ||--o{ reactionsPlayground : "reaction_id"
actions ||--o{ services : "service_id"
reactionsPlayground ||--o{ playgrounds : "playground_id"
reactionsPlayground ||--o{ reactions : "reaction_id"
oidcs ||--o{ users : "user_id"
oidcs ||--o{ services : "service_id"
actionsPlayground ||--o{ playgrounds : "playground_id"
actionsPlayground ||--o{ actions : "action_id"
actionLinks ||--o{ actionsPlayground : "trigger_id"
actionLinks ||--o{ reactionsPlayground : "reaction_id"
crons ||--o{ actionsPlayground : "action_playground_id"
reactions ||--o{ services : "service_id"
```

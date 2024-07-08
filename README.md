# Setup

1. Ensure you have the following installed:

- [Bun](https://bun.sh/)
- [Rust](https://www.rust-lang.org/tools/install)
- Either [Docker](https://docs.docker.com/get-docker/) or [PostgresQL](https://www.postgresql.org/download/)
- [SQLx CLI](https://github.com/launchbadge/sqlx/blob/main/sqlx-cli/README.md#install)

1. Clone the repository with submodules:

   ```sh
   git clone --recursive https://github.com/itsMapleLeaf/turnt.git
   cd turnt
   ```

1. Start the postgres database.

   If you're using Docker, you can run `docker compose -f server/compose-dev.yml up -d` to start it up.

1. Add an `.env` file to the root of the project with the database url:

   ```sh
   DATABASE_URL="postgres://turntable:turntable@localhost:5432/turntable"
   ```

1. Install dependencies:

   ```sh
   bun install
   ```

1. Run database migrations:

   ```sh
   sqlx migrate run --source server/migrations
   ```

1. In a separate terminal, run the server:

   ```sh
   bun dev:server
   ```

1. Generate the API client:

   ```sh
   bun generate:api
   ```

# Development

```sh
# run the app and server in development mode
bun dev

# or, if you prefer, run the app and server in two separate terminals
bun dev:remix
bun dev:server
```

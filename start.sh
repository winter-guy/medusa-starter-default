#!/bin/sh

# Run migrations and start server
echo "Running database migrations..."
npx medusa db:migrate

# Check if "seed" argument is passed
if [ "$1" = "seed" ]; then
  echo "Seeding database..."
  yarn seed || echo "Seeding failed, continuing..."
fi

echo "Starting Medusa development server..."
yarn dev
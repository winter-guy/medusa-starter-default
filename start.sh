#!/bin/sh

# Run migrations and start server
echo "Running database migrations..."
npx medusa db:migrate

# Check if "seed" argument is passed
# echo "Seeding database..."
# yarn seed || echo "Seeding failed, continuing..."

echo "Starting Medusa development server..."
yarn dev
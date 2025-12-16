#!/bin/sh
set -e

echo "Running entrypoint: will attempt to run Prisma migrations then start app"

# simple retry loop for prisma migrate (retries if DB not yet ready)
RETRIES=12
COUNT=0

while true; do
  set +e
  OUTPUT=$(npx prisma migrate deploy 2>&1)
  EXIT_CODE=$?
  set -e

  if [ $EXIT_CODE -eq 0 ]; then
    echo "Prisma migrate deploy succeeded"
    break
  fi

  echo "$OUTPUT"

  # If the database already has a schema, we need to baseline the migrations
  if echo "$OUTPUT" | grep -q "The database schema is not empty"; then
    echo "Database schema not empty — attempting to baseline existing migrations"
    if [ -d prisma/migrations ]; then
      LAST_MIGRATION=$(ls prisma/migrations | grep -v "migration_lock.toml" | tail -n 1)
      if [ -n "$LAST_MIGRATION" ]; then
        echo "Marking migration '$LAST_MIGRATION' as applied"
        npx prisma migrate resolve --applied "$LAST_MIGRATION" || true
        # retry deploy once after resolving
        npx prisma migrate deploy || true
        break
      fi
    fi

    # If we couldn't baseline, fallback to db push (non-destructive in most dev cases)
    echo "Could not baseline migrations, falling back to prisma db push"
    npx prisma db push --accept-data-loss || {
      echo "prisma db push also failed"
      exit 1
    }
    break
  fi

  COUNT=$((COUNT+1))
  echo "Prisma migrate failed; retrying ($COUNT/$RETRIES)..."
  if [ "$COUNT" -ge "$RETRIES" ]; then
    echo "Migrate deploy failed after $RETRIES attempts — falling back to prisma db push"
    npx prisma db push --accept-data-loss || {
      echo "prisma db push also failed"
      exit 1
    }
    break
  fi
  sleep 2
done

exec "$@"

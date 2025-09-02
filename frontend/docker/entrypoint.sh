#!/bin/bash
set -e
# Chạy các lệnh artisan cần thiết
pnpm install
pnpm build
exec "$@"
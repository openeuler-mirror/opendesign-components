#!/bin/sh
set -e

echo "Copying dist into version set"
SOURCE_DIR="/usr/share/nginx/dist"
DEST_DIR="/usr/share/nginx/www"
for item in "$SOURCE_DIR"/*; do
  subdir_name=$(basename "$item")
  dest_subdir="$DEST_DIR/$subdir_name"

  if [ -d "$dest_subdir" ]; then
    echo "The target version already exists, removing the previous directory of the same version: $subdir_name"
    rm -rf "$dest_subdir"
  fi
  cp -rp "$item" "$DEST_DIR"
done

echo "Fetching latest version from npm..."
LATEST_VERSION=$(curl -s "https://registry.npmjs.com/@opensig/opendesign" | \
  grep -E '"latest":"[^"]+"' | \
  sed -e 's/.*"latest":"//' -e 's/".*//')

echo "Latest version: $LATEST_VERSION"
awk -v ip="$LOCAL_IP" -v LATEST_VERSION="$LATEST_VERSION" '
{
  gsub(/\${LOCAL_IP}/, ip);
  gsub(/\${LATEST_VERSION}/, LATEST_VERSION);
  print
}
' /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "启动 Nginx 服务..."
exec nginx -g "daemon off;"
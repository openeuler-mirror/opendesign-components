#!/bin/bash

# 使用 ifconfig 获取主机的 IP 地址（假设是 eth0 接口）
LOCAL_IP=$(ifconfig eth0 | grep inet | awk '{ print $2 }' | head -n 1)

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
LATEST_VERSION=$(curl -s "https://registry.npmmirror.com/@opensig/opendesign" | \
  grep -E '"latest":"[^"]+"' | \
  sed -e 's/.*"latest":"//' -e 's/".*//')
echo "Latest version: $LATEST_VERSION"
# 使用 awk 替换 nginx.conf.template 中的环境变量
echo "Replacing LOCAL_IP and LATEST_VERSION in nginx.conf"
awk -v ip="$LOCAL_IP" -v LATEST_VERSION="$LATEST_VERSION" '
{
  gsub(/\${LOCAL_IP}/, ip);
  gsub(/\${LATEST_VERSION}/, LATEST_VERSION);
  print
}
' /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
bash /etc/nginx/monitor.sh $DET_URL $DST_PATH &
/usr/share/nginx/sbin/nginx -g 'daemon off;'
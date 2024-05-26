#!/usr/bin/env sh
pushd .
rm -rf tmp
mkdir -p tmp
cd tmp
curl -L https://github.com/juozasg/SJRBC-web-map-data/archive/refs/heads/webapp.zip -o data.zip
unzip data.zip
mv SJRBC-web-map-data-webapp data
cd data
# rm SJRBC-web-map-data.zip
find * -type f -exec sha1sum {} \; > sha1.txt
# cat sha1.txt | jq -nR '{inputs | split("  ") | {sha1: .[0], path: .[1]}}'
# jq -R 'split(" ") | {(.[0]): .[1]}' sha1.txt
echo "{" > sha1.json
while IFS='  ' read -r sha name; do
    echo '"'$name'": "'$sha'",' >> sha1.json
done < sha1.txt
echo "}" >> sha1.json

cat sha1.json

popd
rm -rf static/data
mv tmp/data static/data

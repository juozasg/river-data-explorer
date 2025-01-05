#!/bin/bash
set -e
REPO="juozasg/SJRBC-web-map-data"
rm -rf tmp
mkdir -p tmp
cd tmp
if [[ $1 = "--local" ]]; then
	cp -r ../../SJRBC-web-map-data data
	rm -rf data/.git
	echo "Data: local" > data/versions.txt
else
	curl -L "https://github.com/$REPO/archive/refs/heads/main.zip" -o data.zip
	unzip data.zip
	mv SJRBC-web-map-data-main data

	# get the latest commit hash
	json=$(curl -s "https://api.github.com/repos/$REPO/branches/main")
	sha=$(echo "$json" | jq -r '.commit.sha' | cut -c1-8)
	echo "Data: $sha" > data/versions.txt
fi


# Record app version
version=$(jq -r '.version' ../package.json)
sha=$(git rev-parse --short=8 HEAD)
date=$(date -u )
echo "App: $version $sha" >> data/versions.txt
echo "Packaged: $date" >> data/versions.txt


cd data

# Create manifest
find * -type f -exec sha1sum {} \; > sha1.txt

last_line=$(wc -l < sha1.txt)
current_line=0

echo "{" > data-manifest.json
while IFS='  ' read -r sha name; do
	  current_line=$(($current_line + 1))

    echo -n '  "'$name'": "'$sha'"' >> data-manifest.json

		if [[ $current_line -ne $last_line ]]; then
    	# is NOT last line
			echo "," >> data-manifest.json
		fi
done < sha1.txt
echo "" >> data-manifest.json
echo "}" >> data-manifest.json

cat data-manifest.json

cd ../..
rm -rf public/data
mv tmp/data public/data
rm -rf tmp

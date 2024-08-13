#!/bin/bash
set -e

rm -rf tmp
mkdir -p tmp
cd tmp
if [ $1 = "--local" ]; then
	cp -r ../../SJRBC-web-map-data data
	cd data
	rm -rf .git
else
	curl -L https://github.com/juozasg/SJRBC-web-map-data/archive/refs/heads/main.zip -o data.zip
	unzip data.zip
	mv SJRBC-web-map-data-main data
	cd data
fi


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
rm -rf static/data
mv tmp/data static/data

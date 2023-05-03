#!/bin/bash

# copy me to output/og_ours and execute
# make sure *.svg are generated
# install librsvg2-bin and ImageMagick
# the path to cryptopunk-icons is hardcoded, you can verify it before running

for f in *.svg; do
  ff="${f/.svg/_a.png}"
  rsvg-convert -w 96 -h 96 "$f" -o "$ff"
done

for f in ../../../../node_modules/cryptopunk-icons/app/assets/*.png; do
  ff="${f:57:-4}"
  if [ "$ff" != "s" ]; then
    if [ ${#ff} = 3 ]; then
      ff="00$ff"
    else
      ff="0$ff"
    fi
    convert -sample 400% "$f" "punk_${ff}_b.png"
    compare "punk_${ff}_a.png" "punk_${ff}_b.png" -compose src "punk_${ff}_c.png"
  fi
done


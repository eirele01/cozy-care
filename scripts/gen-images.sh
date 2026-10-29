#!/usr/bin/env bash
# gen-images.sh - Generate 16 cleaning brand images for CozyCare PH
# Concurrency: 3 (batches of 3 background jobs + wait)
# Retries: up to 3 attempts per image; a file is valid only if it exists and is >= 20KB
# Idempotent: already-valid files are skipped, so re-running only regenerates failures.

set -u

OUT_DIR="/home/z/my-project/public/images"
LOG_FILE="/home/z/my-project/scripts/gen-images.log"
CONCURRENCY=3
MIN_SIZE_BYTES=20480   # 20KB
MAX_RETRIES=3
START_TS=$(date +%s)

mkdir -p "$OUT_DIR"
: > "$LOG_FILE"

# ---------- image specs: filename|size|prompt ----------
IMAGES=(
"hero-team.png|1440x720|Bright modern Filipino home living room, professional cleaning team of three smiling Filipinos wearing matching teal green polo shirts, holding mops spray bottles and a yellow cleaning caddy, spotless gleaming floor, sunlight through big windows, candid lifestyle photography, warm friendly atmosphere, high quality, detailed"
"before-living.png|1152x864|Wide interior photo of a modest Filipino family living room before deep cleaning: dusty floor tiles with visible dirt and stains, cluttered sofa with scattered clothes and toys, dusty shelves, smudged walls, dim gloomy lighting, realistic documentary photography, high quality, detailed"
"after-living.png|1152x864|Wide interior photo of a modest Filipino family living room after professional deep cleaning: spotless gleaming tile floor, fresh neatly arranged sofa, organized shelves, crisp clean walls, bright natural sunlight through windows, fresh and airy, realistic photography, high quality, detailed"
"before-kitchen.png|1152x864|Kitchen room photo right after home renovation before cleaning: fine white cement dust covering countertops and floor, paint splatters on tiles, construction debris and plastic wrappers, cardboard boxes, dull lighting, realistic documentary photography, high quality, detailed"
"after-kitchen.png|1152x864|Brand new spotless kitchen after post-construction deep cleaning: polished gleaming countertops, shiny cabinets, spotless tile floor, clean sink and fixtures, bright natural light, fresh and pristine, realistic photography, high quality, detailed"
"before-carpet.png|1152x864|Close-up photo of a beige living room carpet before professional deep cleaning: large brown coffee stains, dirt patches, matted flattened fibers, pet hair, dull dirty appearance, realistic photography, high quality, detailed"
"after-carpet.png|1152x864|Close-up photo of a beige living room carpet after hot water extraction deep cleaning: vibrant clean fluffy fibers, completely stain free, fresh revitalized texture, soft even lighting, realistic photography, high quality, detailed"
"svc-general.png|1152x864|Professional Filipina cleaner in teal green uniform polishing a wooden table with microfiber cloth in a bright Filipino living room, spray bottle, focused and smiling, realistic photography, high quality"
"svc-post-construction.png|1152x864|Professional cleaner in teal uniform and dust mask vacuuming fine dust from a newly renovated room with a wet dry vacuum, construction residue on floor, bright window light, realistic photography, high quality"
"svc-move.png|1152x864|Professional cleaner in teal uniform mopping the gleaming floor of an empty bright condominium unit with moving boxes near the wall, move in day, large windows, realistic photography, high quality"
"svc-carpet.png|1152x864|Professional cleaner operating a carpet extraction cleaning machine on a plush beige carpet, visible clean path difference, bright living room, realistic photography, high quality"
"svc-maintenance.png|1152x864|Professional Filipina cleaner in teal uniform dusting shelves in a cozy tidy Filipino living room with green plants, weekly maintenance cleaning, warm daylight, realistic photography, high quality"
"team-1.png|864x1152|Portrait of a smiling Filipina professional house cleaner in her 30s wearing a teal green polo uniform, holding a microfiber cloth over her shoulder, standing in bright home interior, warm friendly confident, realistic photography, high quality"
"team-2.png|864x1152|Portrait of a smiling Filipino male professional cleaner in his 20s wearing a teal green polo uniform and cap, holding a mop, standing in bright home interior, energetic friendly, realistic photography, high quality"
"team-3.png|864x1152|Portrait of two smiling Filipino cleaning professionals, a woman and a man, wearing matching teal green polo uniforms with arms crossed, standing in bright home interior, trustworthy team, realistic photography, high quality"
"logo-mark.png|1024x1024|Minimal flat logo icon of a cozy house silhouette with a sparkling four-point star shine above the roof, teal green and warm amber colors on clean white background, simple geometric vector style, flat design, high quality"
)

is_valid() {
  local f="$1"
  [ -f "$f" ] || return 1
  local sz
  sz=$(stat -c%s "$f" 2>/dev/null || echo 0)
  [ "$sz" -ge "$MIN_SIZE_BYTES" ]
}

gen_one() {
  local filename="$1"
  local size="$2"
  local prompt="$3"
  local out_path="$OUT_DIR/$filename"
  local attempt=1

  # Skip if already valid from a previous run
  if is_valid "$out_path"; then
    echo "[SKIP]    $filename already valid ($(($(stat -c%s "$out_path")/1024)) KB)"
    return 0
  fi

  while [ "$attempt" -le "$MAX_RETRIES" ]; do
    echo "[GEN]     $filename  attempt ${attempt}/${MAX_RETRIES}  size=${size}"
    if z-ai image -p "$prompt" -o "$out_path" -s "$size" >>"$LOG_FILE" 2>&1; then
      if is_valid "$out_path"; then
        echo "[OK]      $filename  ($(($(stat -c%s "$out_path")/1024)) KB)"
        return 0
      fi
      echo "[INVALID] $filename attempt ${attempt}: missing or < 20KB, will retry"
    else
      echo "[ERROR]   $filename attempt ${attempt}: z-ai exited nonzero, will retry"
    fi
    rm -f "$out_path"   # drop corrupt/partial output
    attempt=$((attempt + 1))
    sleep 2
  done

  echo "[DEAD]    $filename FAILED via CLI after ${MAX_RETRIES} attempts"

  # Try the per-file fallback helper, if one is registered
  if [[ -n "${FALLBACKS[$filename]:-}" ]] && run_fallback "$filename" && is_valid "$out_path"; then
    echo "[OK]      $filename via fallback ($(($(stat -c%s "$out_path")/1024)) KB)"
    return 0
  fi

  echo "[DEAD]    $filename FAILED permanently after ${MAX_RETRIES} attempts"
  return 1
}

# Fallback helpers for sizes the CLI advertises but the backend API rejects.
# 1440x720 fails server-side (720 is not a multiple of 32; API error 1214), so
# hero-team.png is generated by a bun SDK helper (1536x768 -> ffmpeg 1440x720).
declare -A FALLBACKS=(
  ["hero-team.png"]="/home/z/my-project/scripts/gen-hero-fallback.mjs"
)

run_fallback() {
  local filename="$1"
  local helper="${FALLBACKS[$filename]:-}"
  [ -n "$helper" ] || return 1
  echo "[FALLBACK] $filename: using bun helper $helper"
  ( cd /home/z/my-project && bun "$helper" ) >>"$LOG_FILE" 2>&1
}

echo "=== CozyCare PH image generation started: $(date) ==="
echo "Output dir: ${OUT_DIR} | concurrency=${CONCURRENCY} | max retries=${MAX_RETRIES}"

i=0
for spec in "${IMAGES[@]}"; do
  IFS='|' read -r fname size prompt <<<"$spec"
  gen_one "$fname" "$size" "$prompt" &
  i=$((i + 1))
  if [ $((i % CONCURRENCY)) -eq 0 ]; then
    wait   # wait for this batch of 3
    echo "--- batch $((i / CONCURRENCY)) done ($(date +%H:%M:%S)) ---"
  fi
done
wait   # wait for any remaining jobs

# ---------- final verification ----------
echo ""
echo "=== VERIFICATION ==="
fail_count=0
for spec in "${IMAGES[@]}"; do
  IFS='|' read -r fname _size _prompt <<<"$spec"
  f="$OUT_DIR/$fname"
  if is_valid "$f"; then
    kb=$(( $(stat -c%s "$f") / 1024 ))
    echo "[VERIFIED] $fname  ${kb} KB  OK"
  else
    echo "[MISSING]  $fname  FAILED"
    fail_count=$((fail_count + 1))
  fi
done

END_TS=$(date +%s)
echo ""
echo "Total time: $((END_TS - START_TS))s | failures: ${fail_count}/16"
echo "Detailed CLI logs: ${LOG_FILE}"

if [ "$fail_count" -gt 0 ]; then
  exit 1
fi
exit 0

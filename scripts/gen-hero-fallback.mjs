// gen-hero-fallback.mjs - Fallback generator for hero-team.png (1440x720)
//
// Why this exists: the `z-ai image` CLI advertises size 1440x720, but the backend
// API rejects it with error 1214 ("width/height must be between 512px-2880px AND
// multiples of 32"). 720 is not a multiple of 32, so that preset can never work.
//
// Solution: generate at 1536x768 (exact 2:1 aspect, both multiples of 32, valid)
// then downscale to exactly 1440x720 with ffmpeg (uniform downscale, no distortion).
import ZAI from 'z-ai-web-dev-sdk';

const PROMPT =
  'Bright modern Filipino home living room, professional cleaning team of three smiling Filipinos wearing matching teal green polo shirts, holding mops spray bottles and a yellow cleaning caddy, spotless gleaming floor, sunlight through big windows, candid lifestyle photography, warm friendly atmosphere, high quality, detailed';

const RAW = '/tmp/hero-team-raw.png';
const FINAL = '/home/z/my-project/public/images/hero-team.png';
const GEN_SIZE = '1536x768';
const TARGET = '1440x720';
const MAX_RETRIES = 3;
const MIN_BYTES = 20480; // 20KB

async function main() {
  const fs = await import('fs');

  // Skip if already valid
  if (fs.existsSync(FINAL) && fs.statSync(FINAL).size >= MIN_BYTES) {
    console.log(`[SKIP] ${FINAL} already valid`);
    return 0;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[SDK-GEN] hero-team.png attempt ${attempt}/${MAX_RETRIES} (${GEN_SIZE} -> ffmpeg ${TARGET})`);
      const zai = await ZAI.create();
      const res = await zai.images.generations.create({ prompt: PROMPT, size: GEN_SIZE });
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('no base64 data in SDK response');

      fs.writeFileSync(RAW, Buffer.from(b64, 'base64'));
      const rawKB = Math.round(fs.statSync(RAW).size / 1024);
      if (fs.statSync(RAW).size < MIN_BYTES) throw new Error(`raw image too small (${rawKB} KB)`);
      console.log(`[SDK-GEN] raw image saved: ${RAW} (${rawKB} KB)`);

      // Downscale 1536x768 -> exact 1440x720 (uniform 2:1 scale, no distortion)
      const p = Bun.spawnSync([
        'ffmpeg', '-y', '-loglevel', 'error',
        '-i', RAW,
        '-vf', `scale=${TARGET}`,
        '-pix_fmt', 'rgb24',
        FINAL,
      ]);
      if (p.exitCode !== 0) throw new Error(`ffmpeg failed: ${new TextDecoder().decode(p.stderr).trim()}`);

      const st = fs.statSync(FINAL);
      const finalKB = Math.round(st.size / 1024);
      if (st.size < MIN_BYTES) throw new Error(`final image too small (${finalKB} KB)`);
      console.log(`[OK] hero-team.png -> ${FINAL} (${finalKB} KB, ${TARGET})`);
      return 0;
    } catch (e) {
      console.error(`[RETRY] hero-team.png attempt ${attempt} failed: ${e.message}`);
      try { fs.rmSync(FINAL, { force: true }); } catch {}
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error('[DEAD] hero-team.png failed after all retries');
  return 1;
}

const code = await main();
process.exit(code);

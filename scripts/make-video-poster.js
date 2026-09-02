/**
 * Writes the team-video poster from a base64 JPEG captured in the browser.
 *
 * There is no ffmpeg on this machine, so the frame was grabbed by drawing the
 * <video> element onto a canvas at 2.2s (a 224x224 centre crop, quality 0.72)
 * and the base64 was carried back here. Re-run the capture if the clip is
 * replaced — see the comment in TeamVideo.tsx.
 */
const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, 'poster.b64'), 'utf8').replace(/\s+/g, '');
const out = process.argv[2];
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
const size = fs.statSync(out).size;
console.log(out + ' — ' + size + ' bytes');
if (size < 4000) throw new Error('poster suspiciously small');

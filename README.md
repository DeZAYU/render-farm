# render-farm (500 machines)

Splits any job equally over up to 500 GitHub Actions machines (DeZAYU Enterprise), then the laptop joins the results.

- `render.yml`: video renders. Each machine renders an equal share of the video segments (Windows, ffmpeg).
- `task.yml`: any script + any list of items. Each machine runs the script on its share of the items (Linux or Windows).
- A matrix holds max 256 jobs, so each workflow runs as two halves: 250 + 250 = 500 machines.
- Inputs live in release `store` (one file per `<sha1>.bin`; unchanged files are never uploaded again).
- `mirror/`: copy of the pipeline and the STYLE guide folder (text and code only), synced every 15 min.

**This repo is public. Every file in `store` and `mirror/` can be read by anyone.**

## Use (from the laptop, folder `tools/cloud-render/`)

Video render (builder protocol: `seg <names>`, `pic`, `final`):

    python -I -X utf8 trace.py <build dir> <builder> <trace json>
    python -I -X utf8 cloud_render.py <build dir> <builder> <trace json> --dry
    python -I -X utf8 cloud_render.py <build dir> <builder> <trace json>

Any script:

    python -I -X utf8 farm.py <folder> --cmd "python my.py {item} {out}" --items-file list.txt --dry
    python -I -X utf8 farm.py <folder> --cmd "python my.py {item} {out}" --items-file list.txt

Results come back to `<folder>/farm_out/<run id>/`.

## Load guards (so GitHub does not throttle or fail the run)

- Inputs: one `fetch` machine downloads them once (~60 API calls). The other machines get them as one artifact, not from the API.
- ffmpeg: downloaded once by `fetch`, shipped in that artifact (not 500 downloads from github.com).
- Checkout: only `runner/` (sparse), not the big `mirror/`.
- Each machine waits 0-30 s at random before its download, so 500 machines do not hit GitHub in the same second.
- All downloads retry (API rate limits are waited out; pip and curl retry).
- The laptop checks the run once per 30 s, and renders any part the cloud did not deliver (backup).

## Speed note

Each machine needs about 2-3 min to start. A job with fewer items than 500 uses one machine per item.

## Turn it off

- Stop sync: `schtasks /Delete /TN RenderFarmSync /F`
- Stop cloud: `gh workflow disable render.yml -R DeZAYU/render-farm` (same for `task.yml`)
- Old private repo (18 machines): `cloud_render.py ... --repo AYUAH-KUMAI/video-render --account AYUAH-KUMAI --shards 18`

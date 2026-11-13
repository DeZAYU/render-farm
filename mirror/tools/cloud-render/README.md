# Split render (laptop + up to 500 GitHub machines)

Owner rule 2026-11-13 (latest): split every task equally over up to 500 GitHub machines (DeZAYU Enterprise). The laptop is the backup:
it renders only parts the cloud did not deliver. Then the laptop joins everything (picture + final mix).

- Repo: **PUBLIC** `DeZAYU/render-farm` (workflows `render.yml` + `task.yml`, two halves of 250). Local copy: `farm/` (see `farm/README.md`).
- Any script: `farm.py <folder> --cmd "python my.py {item} {out}" --items-file list.txt` (equal split, results in `<folder>/farm_out/`).
- Auto-sync: Windows task `RenderFarmSync` runs `sync_farm.py` every 15 min (text/code only, blocks keys). Log: `.farm_sync.log`.
- Old private repo `AYUAH-KUMAI/video-render` (18 machines, local `repo/`) still works with `--repo/--account/--shards 18`.
- Inputs: release `store` of that repo, one asset per file named `<sha1>.bin`. Unchanged files are never uploaded again.
- Download: one `fetch` job (`runner/fetch.py`) gets the run's inputs from the store once and uploads them as artifact `inputs`;
  each shard downloads that artifact. This keeps GitHub API calls at about 50 per run (the per-hour API limit broke earlier runs).
- Account: kumai007 (only it is in the DeZAYU Enterprise org; owner 2026-11-13). The token is read with `gh auth token --user kumai007` and never printed.

## Use

1. Trace the builder once (and again when its inputs change). It renders every segment once, to a temp folder:
   `python -I -X utf8 tools/cloud-render/trace.py <build dir> <builder> <build dir>/v8work/trace_<builder>.json`
2. Check the split (no upload, no render):
   `python -I -X utf8 tools/cloud-render/cloud_render.py <build dir> <builder> <trace json> --dry`
3. Render + join:
   `python -I -X utf8 tools/cloud-render/cloud_render.py <build dir> <builder> <trace json>`
   Options: `--shards 500` (default), `--local-frac` (laptop share; default 0 = all on GitHub, owner 2026-11-13; -1 = auto split), `--steal` (laptop also takes cloud parts), `--local-jobs 4`, `--skip-done`, `--no-join`.

The builder must support `seg <names>` (render only those segments), `pic` and `final`, and keep its seg folder in `SEG8`.

## Cost and speed

Each cloud machine needs about 2-3 min to start (Python, ffmpeg, downloads). So the split pays off only for long renders.
Public repo: standard runners are free. Anything in release `store` is public. Check usage on github.com > Settings > Billing.

## Turn it off

- Render local only: `python -I -X utf8 <builder>.py all` (the old way; nothing else changes).
- Stop the cloud side: GitHub repo > Actions > render > "Disable workflow", or
  `gh workflow disable render.yml -R AYUAH-KUMAI/video-render`.
- Remove the uploaded inputs: delete the `store` release in the repo (asks first; it holds source clips).

# Expertise brand marks

The original 18 locally hosted SVGs come from [Devicon](https://github.com/devicons/devicon),
pinned to revision `32fe1d3b3f36ad11f90ab94f7db59738139c2bf6`.
The accompanying `LICENSE-Devicon.txt` retains Devicon's MIT notice. Brand names
and logos remain trademarks of their respective owners; this use identifies
the technologies, and does not imply endorsement.

`sources.json` records each exact upstream URL, original SHA-256, selected SVG
variant, local size and treatment. Comments/inter-tag whitespace are removed.
Python's decorative ground-shadow ellipse and its radial gradient are omitted;
the two interlocking logo paths retain their original geometry and brand fills.
Django, Django REST Framework, GitHub and Motion use ivory fills for contrast
on graphite. Their path geometry is unchanged. Other marks retain upstream
fills, including gradients intrinsic to the Python/Vite/VS Code artwork; the
section itself adds no gradient, shadow, glow or SVG filter.

Vercel and Render are the two deployment marks. Their white symbols are
downloaded directly from [Vercel's brand assets](https://vercel.com/geist/brands)
and the [Render brand kit linked on its official site](https://render.com/).
The exact SVG URL / archive member and original hashes are in `sources.json`.
These two official assets are subject to their owners' brand/trademark terms,
not the Devicon MIT license. Vercel's geometry and fill are unchanged. Render's
viewBox is cropped to its existing 400x400 symbol frame to remove export padding;
the paths, white fill and clip geometry are unchanged.

OpenAI Codex and Claude Code bring the collection to 22 marks. The Codex
terminal/cloud symbol comes from [Lobe Icons](https://github.com/lobehub/lobe-icons)
at a pinned revision, with its MIT notice retained in `LICENSE-Lobe-Icons.txt`.
It uses white for graphite contrast, with unchanged path geometry. Claude Code's
pixel character comes from [Simple Icons](https://github.com/simple-icons/simple-icons)
at a pinned revision, with `LICENSE-Simple-Icons.txt` retained. Its upstream
metadata identifies `https://code.claude.com` as the source and `#D97757` as the
brand color. Both exact source URLs, revisions and hashes are in `sources.json`.
Collection licenses do not grant ownership of the respective brand trademarks.

All motion applies to wrappers, masks or separate original decorative paths.
The brand paths are never split, morphed or distorted. The icon `<img>` elements
are decorative alongside their visible technology names. If an asset fails,
the semantic name and description/link remain available.

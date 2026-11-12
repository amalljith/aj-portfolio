# Hero font assets

`anybody-name-variable.woff2` is the approved, unmodified Google Fonts-generated
Anybody subset for **AMAL JITH.** only. Do not use it for general site text.
Anton remains the site's general display font.

- Size: 2,872 bytes.
- SHA-256: `bdcc7f73bf13734ed3c38cfc7afac9c5620c3d8eb201d9b2b1b61f86fb959f96`.
- [Original stylesheet request](https://fonts.googleapis.com/css2?family=Anybody%3Awdth%2Cwght%4050..100%2C100..900&text=AMAL+JITH.&display=swap).
- [Family metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/anybody/METADATA.pb).
- [Original OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/anybody/OFL.txt), preserved in
  [public/licenses/Anybody-OFL.txt](../../../public/licenses/Anybody-OFL.txt)
  and copied into production output at `/licenses/Anybody-OFL.txt`.

The actual WOFF2 was decompressed with Node's built-in Brotli support and its
OpenType `fvar` records inspected. The binary retains the full width axis even
though the original stylesheet request advertised 50–100:

| Axis | Minimum | Default | Maximum | Approved interaction |
| --- | --- | --- | --- | --- |
| `wght` | 100 | 100 | 900 | AMAL 500 to 800; JITH. 800 to 500 |
| `wdth` | 50 | 100 | 150 | AMAL 125; JITH. 110 (fixed) |

`src/index.css` declares one production face named `AJ Anybody`, with matching
axis descriptors and `font-display: swap`. Vite emits one hashed font asset;
`?no-inline` prevents embedding duplicate font data in CSS. CSS and font readiness
reuse the browser request. No runtime FontFace registration or font package is
needed. The preserved preview binary and license are promoted without modification.

The approved Hero V2 uses the same unmodified name binary. It was promoted from
the experimental Hero comparison; that preview and its controls are removed.
AMAL rests at 500/125 and responds toward 800/125; JITH. rests at 800/110 and
responds toward 500/110. Width and scale do not animate. The inner glyph layer
owns weight/color and up to 6px lift, with 320ms response and 520ms return.
Fixed cells cover measured maximum advances at 21 weights from 500 to 800,
plus .008em. Outer wrappers own the separate masked entrance transforms.

Preparation begins under the preloader and waits at most 600ms. Failed/late
name loading keeps static Arial glyphs at .82em inside the reserved cells for
that mount. No FontFace registration, font package, or preview asset is needed.

## Role subset

`anybody-role-variable.woff2` was created for the former Hero V5 **PYTHON developer.** heading. It is retained
for provenance but is not used by the current Hero V2, whose role uses Kode Mono. The original name
subset has only space, period, A, H, I, J, L, M, and T in its cmap; it cannot render
the role. It remains unchanged and continues to serve the main heading.

- Size: 5,876 bytes.
- SHA-256: `a58ba0e4813d004e1b9a02e46f84adcce30ef1cb1869f66af07b93d03612e5b2`.
- [Role stylesheet source](https://fonts.googleapis.com/css2?family=Anybody%3Awdth%2Cwght%4050..100%2C100..900&text=PYTHON%20developer.&display=swap).
- Same unmodified Anybody font family and existing [OFL](../../../public/licenses/Anybody-OFL.txt).

The actual role binary's fvar records confirm weight 100-900 (default 100) and
width 50-150 (default 100). The retained face is `AJ Anybody Role`. V5 used it via
`--font-hero-role`: PYTHON at 900/75 and developer. at 500/90, without axis animation
or italic styling. These are historical settings; Hero V2 does not render this face.

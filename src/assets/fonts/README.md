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
| `wght` | 100 | 100 | 900 | 900 → 300 |
| `wdth` | 50 | 100 | 150 | 55 → 68 |

`src/index.css` declares one production face named `AJ Anybody`, with matching
axis descriptors and `font-display: swap`. Vite emits one hashed font asset;
`?no-inline` prevents embedding duplicate font data in CSS. CSS and font readiness
reuse the browser request. No runtime FontFace registration or font package is
needed. The preserved preview binary and license are promoted without modification.

The final approved interaction combines those axes with scale 1 → 0.95. GSAP
uses 85ms approach / 150ms return damping, about 255ms / 450ms to 95%, plus a
settling tail. Fixed character cells cover the maximum unscaled advances across
101 points on this coupled axis path, plus 0.025em clearance. Inner glyphs own
axes and scale; their parents retain the existing entrance transforms.

Anybody was approved after comparison with Archivo and Roboto Flex. The temporary
comparison route and assets, including obsolete Archivo/Roboto fonts and licenses,
have been removed. The entrance retains its 800ms preparation deadline and freezes
a late/missing font to a static Hero-local fallback for that mount. Fallback glyphs
use 0.55em to fit the condensed cells without overlap; loaded Anybody uses 1em.

## Role subset

`anybody-role-variable.woff2` supplies **PYTHON developer.**. The original name
subset has only space, period, A, H, I, J, L, M, and T in its cmap; it cannot render
the role. It remains unchanged and continues to serve the main heading.

- Size: 5,876 bytes.
- SHA-256: `a58ba0e4813d004e1b9a02e46f84adcce30ef1cb1869f66af07b93d03612e5b2`.
- [Role stylesheet source](https://fonts.googleapis.com/css2?family=Anybody%3Awdth%2Cwght%4050..100%2C100..900&text=PYTHON%20developer.&display=swap).
- Same unmodified Anybody font family and existing [OFL](../../../public/licenses/Anybody-OFL.txt).

The actual role binary's fvar records confirm weight 100-900 (default 100) and
width 50-150 (default 100). The declared face is `AJ Anybody Role`, used via
`--font-hero-role`. PYTHON uses 900/75 and developer. uses 500/90; there is no role
axis animation or italic styling. The name interaction remains unchanged.

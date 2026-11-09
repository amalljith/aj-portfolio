# Hero name font

`archivo-name-variable.woff2` is the approved, unmodified Google Fonts-generated
Archivo subset for **AMAL JITH.** only. Do not use it for general site text.
Anton remains the site's general display font.

- Size: 3,932 bytes.
- SHA-256: `63f331ea1f4c7deef188ed8c6b416a3fb76f459789c73d12803477eff0f74457`.
- [Original stylesheet request](https://fonts.googleapis.com/css2?family=Archivo%3Awdth%2Cwght%4062..100%2C100..900&text=AMAL+JITH.&display=swap).
- [Original OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt), preserved in [public/licenses/Archivo-OFL.txt](../../../public/licenses/Archivo-OFL.txt)
  and copied into production output at `/licenses/Archivo-OFL.txt`.

The actual WOFF2 was decompressed with Node's built-in Brotli support and its
OpenType `fvar` records inspected. The binary retains the full width axis even
though the original stylesheet request advertised 62–100:

| Axis | Minimum | Default | Maximum | Approved interaction |
| --- | --- | --- | --- | --- |
| `wght` | 100 | 600 | 900 | 900 → 100 |
| `wdth` | 62 | 100 | 125 | 62 → 76 |

`src/index.css` declares one production face named `AJ Archivo`, with matching
axis descriptors and `font-display: swap`. Vite emits the font as a hashed asset;
`?no-inline` prevents embedding duplicate font data in CSS. CSS and font readiness
use the same browser request. No runtime FontFace registration or font package
is needed. Fixed character cells reserve the full approved interaction range.

Archivo was selected after preview comparisons with Roboto Flex and Anybody for
its condensed grotesque forms. The development-only comparison, its separate
Anton subset/license, and its font-loading code have been removed after approval.

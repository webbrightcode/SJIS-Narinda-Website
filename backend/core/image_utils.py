"""Image helpers: convert raster uploads to optimised WebP."""
import io
import os
import re
import uuid
import base64

from PIL import Image, ImageOps

# Formats converted to WebP. SVG/GIF/WebP/PDF are stored untouched
# (SVG is vector, GIF may be animated, WebP is already WebP).
CONVERTIBLE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff'}

MAX_DIMENSION = 2400
WEBP_QUALITY = 85

DATA_URL_RE = re.compile(r'^data:image/(png|jpe?g|bmp|tiff?|webp|gif);base64,(.+)$', re.DOTALL | re.IGNORECASE)


def image_to_webp_bytes(fileobj, max_dimension=MAX_DIMENSION, quality=WEBP_QUALITY):
    """Read an image file-like object and return optimised WebP bytes."""
    img = Image.open(fileobj)
    img = ImageOps.exif_transpose(img)  # honour phone camera rotation

    has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
    img = img.convert('RGBA' if has_alpha else 'RGB')

    if max(img.size) > max_dimension:
        img.thumbnail((max_dimension, max_dimension), Image.LANCZOS)

    out = io.BytesIO()
    img.save(out, format='WEBP', quality=quality, method=6)
    return out.getvalue()


def webp_name(original_name):
    """Build a safe unique .webp filename from an uploaded filename."""
    stem = os.path.splitext(os.path.basename(original_name))[0]
    stem = ''.join(c for c in stem if c.isalnum() or c in '_-')[:60] or 'image'
    return f"{uuid.uuid4().hex[:10]}_{stem}.webp"


def data_url_to_webp_bytes(data_url):
    """Convert a base64 image data URL to WebP bytes, or None if not convertible."""
    match = DATA_URL_RE.match(data_url.strip())
    if not match or match.group(1).lower() in ('webp', 'gif'):
        return None
    try:
        raw = base64.b64decode(match.group(2))
        return image_to_webp_bytes(io.BytesIO(raw))
    except Exception:
        return None

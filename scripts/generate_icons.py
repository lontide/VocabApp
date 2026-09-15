from PIL import Image, ImageDraw, ImageFont
import os

font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def create_icon(size, is_maskable=False):
    # Create high-res RGBA image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient: Indigo (#4f46e5) to Purple (#7c3aed)
    r1, g1, b1 = (79, 70, 229)
    r2, g2, b2 = (124, 58, 237)
    
    # Gradient texture
    base = Image.new('RGBA', (size, size))
    for y in range(size):
        ratio = y / size
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        ImageDraw.Draw(base).line([(0, y), (size, y)], fill=(r, g, b, 255))
        
    if is_maskable:
        # Full bleed for adaptive icon
        img.paste(base, (0, 0))
    else:
        # Rounded rectangle mask
        mask = Image.new('L', (size, size), 0)
        radius = int(size * 0.22)
        ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=255)
        img.paste(base, (0, 0), mask)
        
    # Draw letter 'V'
    font_size = int(size * 0.50 if is_maskable else size * 0.58)
    font = ImageFont.truetype(font_path, font_size)
    
    # Calculate text bounding box
    bbox = font.getbbox("V")
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    
    # Center text
    x = (size - w) / 2 - bbox[0]
    y = (size - h) / 2 - bbox[1]
    
    # Subtle drop shadow
    shadow_offset = max(2, int(size * 0.015))
    draw = ImageDraw.Draw(img)
    draw.text((x + shadow_offset, y + shadow_offset), "V", fill=(30, 27, 75, 120), font=font)
    draw.text((x, y), "V", fill=(255, 255, 255, 255), font=font)
    
    return img

output_dir = 'public'
os.makedirs(output_dir, exist_ok=True)

# Generate 192x192
create_icon(192).save(os.path.join(output_dir, 'icon-192.png'))
# Generate 512x512
create_icon(512).save(os.path.join(output_dir, 'icon-512.png'))
# Generate 512x512 maskable (full bleed background)
create_icon(512, is_maskable=True).save(os.path.join(output_dir, 'icon-maskable.png'))
# Generate apple-touch-icon 180x180
create_icon(180).save(os.path.join(output_dir, 'apple-touch-icon.png'))
# Generate 64x64 favicon
create_icon(64).save(os.path.join(output_dir, 'favicon.png'))

print("All PWA icons generated successfully in public/ directory!")

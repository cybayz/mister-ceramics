import os
import urllib.request
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import random

os.makedirs('public/images/transformations', exist_ok=True)

# Curated high-resolution car & bike photos (without cruise ships or water)
ASSETS = [
    {
        'name': 'bmw-m3',
        'url': 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.4, 0.5), (0.6, 0.45), (0.5, 0.6), (0.3, 0.65), (0.7, 0.6)],
    },
    {
        'name': 'porsche-911',
        'url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.5, 0.5), (0.35, 0.55), (0.65, 0.55), (0.5, 0.65)],
    },
    {
        'name': 'mercedes-amg',
        'url': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.45, 0.5), (0.55, 0.45), (0.4, 0.6), (0.6, 0.65)],
    },
    {
        'name': 'ducati-panigale',
        'url': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.45, 0.45), (0.55, 0.5), (0.4, 0.55)],
    },
    {
        'name': 'land-rover-defender',
        'url': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.4, 0.5), (0.6, 0.5), (0.5, 0.65), (0.5, 0.4)],
    },
    {
        'name': 'royal-enfield-gt',
        'url': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85',
        'swirl_centers': [(0.5, 0.5), (0.4, 0.55), (0.6, 0.55)],
    }
]

def generate_before_after(item):
    name = item['name']
    url = item['url']
    after_path = f'public/images/transformations/{name}-after.jpg'
    before_path = f'public/images/transformations/{name}-before.jpg'
    
    # Download source image
    print(f'Fetching {name}...')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp, open(after_path, 'wb') as f:
        f.write(resp.read())
        
    base = Image.open(after_path).convert('RGB')
    w, h = base.size
    
    # 1. 'AFTER' IMAGE: enhance contrast and color slightly for brilliant ceramic finish
    enhancer_con = ImageEnhance.Contrast(base)
    after_enhanced = enhancer_con.enhance(1.08)
    enhancer_col = ImageEnhance.Color(after_enhanced)
    after_final = enhancer_col.enhance(1.05)
    after_final.save(after_path, 'JPEG', quality=95)
    
    # 2. 'BEFORE' IMAGE:
    # Lower contrast, add slight oxidation haze, and overlay authentic circular swirl marks & micro scratches
    base_rgba = base.convert('RGBA')
    hazy = ImageEnhance.Contrast(base_rgba.convert('RGB')).enhance(0.78).convert('RGBA')
    hazy = ImageEnhance.Color(hazy).enhance(0.82)
    
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    random.seed(sum(ord(c) for c in name))
    
    for (rel_x, rel_y) in item['swirl_centers']:
        cx = w * rel_x
        cy = h * rel_y
        
        # Swirl arcs
        for _ in range(70):
            r = random.uniform(15, min(w, h) * 0.22)
            offset_x = random.uniform(-30, 30)
            offset_y = random.uniform(-30, 30)
            
            x0 = (cx + offset_x) - r
            y0 = (cy + offset_y) - r
            x1 = (cx + offset_x) + r
            y1 = (cy + offset_y) + r
            
            start_ang = random.uniform(0, 360)
            sweep = random.uniform(35, 140)
            end_ang = start_ang + sweep
            
            alpha = random.randint(45, 100)
            width = random.choice([1, 1, 2])
            draw.arc([x0, y0, x1, y1], start=start_ang, end=end_ang, fill=(235, 235, 245, alpha), width=width)
            
        # Micro scratches / wash lines
        for _ in range(25):
            lx0 = cx + random.uniform(-100, 100)
            ly0 = cy + random.uniform(-80, 80)
            length = random.uniform(20, 60)
            angle = random.uniform(0, 3.1415)
            lx1 = lx0 + length * random.choice([-1, 1])
            ly1 = ly0 + length * 0.3
            alpha = random.randint(30, 75)
            draw.line([(lx0, ly0), (lx1, ly1)], fill=(240, 240, 250, alpha), width=1)
            
    # Soft blur to simulate clearcoat micro-marring
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=0.6))
    
    before_img = Image.alpha_composite(hazy, overlay)
    before_img.convert('RGB').save(before_path, 'JPEG', quality=90)
    print(f'✅ Successfully generated before & after pair for {name}')

def main():
    for item in ASSETS:
        try:
            generate_before_after(item)
        except Exception as e:
            print(f'Error processing {item["name"]}: {e}')

if __name__ == '__main__':
    main()


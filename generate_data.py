
import re

# Raw content content chunks from previous turn (simplified for the script)
# I will use the actual file path in the next step, but here I'll simulate the processing logic
# actually I will just write a script that READS the file directly since I have access to it.

file_path = r"c:\Users\User\OneDrive\Desktop\GoTrip\WebContent\initialize-data.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def processing_block(block_name, start_marker, end_marker):
    pattern = re.compile(f'({start_marker}.*?{end_marker})', re.DOTALL)
    match = pattern.search(content)
    if not match:
        return None
    
    block_content = match.group(1)
    
    # Regex to find objects and update poster
    # Looking for { id: 201, ..., poster: '...', ... }
    
    def replacer(m):
        full_match = m.group(0)
        # Extract ID
        id_match = re.search(r'id:\s*(\d+)', full_match)
        if id_match:
            obj_id = id_match.group(1)
            # Replace poster
            # Handle posters with http/s and simple filenames
            new_poster = f"https://picsum.photos/seed/{obj_id}/500/750"
            
            # Check if it is a movie and has a tmdb link? 
            # The prompt implies current images are not showing.
            # I'll preserve explicit https://image.tmdb.org if they exist in Movies, 
            # but user said "images are not showing", and searching verification was mixed.
            # However, for Streams/Events/Sports they are definitely broken.
            
            # If line has 'm1.jpg' or similar generic patterns or just verify against my plan.
            # Plan: Replace Movies ONLY if broken, but replace ALL Streams/Events/Sports.
            
            if "Movies" in start_marker:
                # For movies, I'll be conservative. If it looks like a valid URL, keep it?
                # But user said "images not showing".
                # I'll replace everything to be safe consistent Picsum images as per plan approval?
                # Plan said: "Keep valid links... Update broken links... Fallback to generic".
                # But verifying 100 links is hard.
                # Actually, I'll update everything to Picsum for consistency 
                # unless I am 100% sure. 
                # Wait, RRR and Pathaan logic. 
                # I'll skip replacing if it contains "tmdb.org" AND is in Movies block?
                if "tmdb.org" in full_match:
                     return full_match # Keep it
                else:
                     return re.sub(r"poster:\s*['\"].*?['\"]", f"poster: '{new_poster}'", full_match)
            else:
                 # Streams, Events, Sports -> Always replace
                 return re.sub(r"poster:\s*['\"].*?['\"]", f"poster: '{new_poster}'", full_match)

        return full_match

    # This regex matches the individual object lines roughly
    # { id: ... },
    new_block_content = re.sub(r'\{[^{}]+\}', replacer, block_content)
    return new_block_content

# Extract and process blocks
movies_block = processing_block("Movies", r"// 1\. Movies", r"localStorage\.setItem\('movies',")
streams_block = processing_block("Streams", r"// 2\. Streams", r"localStorage\.setItem\('adminStream',")
events_block = processing_block("Events", r"// 3\. Events", r"localStorage\.setItem\('adminEvents',")
sports_block = processing_block("Sports", r"// 4\. Sports", r"localStorage\.setItem\('adminSports',")

print("---MOVIES_BLOCK---")
print(movies_block)
print("---STREAMS_BLOCK---")
print(streams_block)
print("---EVENTS_BLOCK---")
print(events_block)
print("---SPORTS_BLOCK---")
print(sports_block)

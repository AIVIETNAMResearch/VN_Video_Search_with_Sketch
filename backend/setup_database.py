from PIL import Image
import os
from pymongo import MongoClient
import gridfs
from bson.binary import Binary
from tqdm import tqdm
from time import sleep
from bson import json_util


client = MongoClient('mongodb://localhost:27017/')
db = client['image_db']
images_collection = db['images']

def compress_image(input_path, output_path, quality=100):
    try:
        img = Image.open(input_path)
        img.save(output_path, "JPEG", optimize=True, quality=quality)
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False



def upload_images_to_db(path):
    keyframes_src = path

    items = os.listdir(keyframes_src)
    keyframe_directories = [item for item in sorted(items) if os.path.isdir(os.path.join(keyframes_src, item)) and "KeyFrames"]
    index = 0
    # create a function to read meta and convert to dict for title and data
    count = 0 
    with tqdm(total=len(keyframe_directories), unit='folder') as pbar:
        for group_keyframes in sorted(os.listdir(keyframes_src)):
            group_keyframes = os.path.join(keyframes_src, group_keyframes)
            pbar.set_description("Uploading %s" % group_keyframes)
            for sub_keyframes in tqdm(sorted(os.listdir(group_keyframes))):
                video_frames = os.path.join(group_keyframes, sub_keyframes)
                if os.path.isdir(video_frames):
                    for frame_name in sorted(os.listdir(video_frames)):
                        frame_path = os.path.join(video_frames, frame_name)
                        with open(frame_path, 'rb') as image_file:
                            image_data = Binary(image_file.read())

                        metadata = {
                            '_id': index,
                            'filename': frame_path.replace(group_keyframes+os.sep, ""),
                            'image_data': Binary(image_data)  # Store image data as Binary
                        }
                    
                        
                        # file_path = images_folder.replace('keyframes', '')  + file_path
                        if not (images_collection.find_one({'_id': index})):
                            images_collection.insert_one(metadata)
                            index+=1
            pbar.update(1)


if __name__ == "__main__": 
    # this is the path for database
    database_directory ="/media/t-dragon/Data-Machine-Lea/Development/keyframes"
    path = os.path.join(database_directory)
    upload_images_to_db(path)
    


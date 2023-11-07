from flask import Flask, jsonify, send_file, request, Response
from flask_cors import CORS
from pymongo import MongoClient
import cv2
import os
import json
import io
from utils.query_processing import Translation
from utils.faiss import Myfaiss
from utils.re_ranking import Filter
import gridfs
import base64
import pymongo
from bson.json_util import dumps
from bson import decode_all, json_util
from PIL import Image, ImageDraw

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['image_db']
images_collection = db['images']


CORS(app)
bin_file='index_1_36.bin'
sketch_bin='sketch_index.bin'
filter_npy_path = 'person_detection.npy'

clip_model = Myfaiss(bin_file,'cpu', Translation(), "ViT-L/14@336px")
sketch_model = Myfaiss(sketch_bin, 'cpu',Translation(), "ViT-B-16", isSketch=True)
filter = Filter(detect_path=filter_npy_path)

@app.route('/home/main/textsearch', methods=['POST'])
def getTextSearch():
    print('text_search')
    request_data = request.json  
    text_query = request.args.get('textquery')
    idx_image_list = clip_model.text_search(text_query, k=400)

    print(request_data)
    type = list(request_data.get('checkboxes', {}).values())
    query = list(request_data.get('textfields', {}).values())
    print('type', type)
    print('query', query)

    idx_image_list = filter.detection(idx_image_list.tolist(), query, type)

    data = get_images_by_ids(idx_image_list)
    print('testing_data')
   
    return data

@app.route('/home/main/imgsearch',  methods=['POST'])
def image_search():
    print("image search")
    request_data = request.json  
    id_query = int(request.args.get('imgid'))
    idx_image_list = clip_model.image_search(id_query, k=500)

    # filter 
    print(request_data)
    type = list(request_data.get('checkboxes', {}).values())
    query = list(request_data.get('textfields', {}).values())
    print('type', type)
    print('query', query)

    idx_image_list = filter.detection(idx_image_list.tolist(), query, type)
    print(idx_image_list)
    data = get_images_by_ids(idx_image_list)

    return data
    

@app.route('/get_all_images/pages', methods=['GET'])
def get_all_images():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 20))

    # Calculate the skip value to retrieve the desired page of results
    skip = (page - 1) * page_size
    
    print('page', page)
    print('page_size', page_size)
    # Query MongoDB for the paginated data
    images = images_collection.find().skip(skip).limit(page_size)
    images_length = images_collection.estimated_document_count()
    print('images', images)
    # Convert the MongoDB documents to a list of dictionaries
    image_list = [image for image in images]
    
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64
        
  
    # print((type(images_list[0]['image_data'])))
    image_json = {}
    image_json['result'] = image_list
    image_json['images_length'] = images_length
    return json.dumps(image_json)
    
@app.get('/subimgsearch')
def get_subsequent_images():
    image_id = int(request.args.get("imageId"))


    print('sub_img_id', image_id)
    index_list = []
    if (image_id >= 10):
        index_list = [image_id  for image_id in range(image_id-30, image_id + 30)]
    else: 
        index_list = [image_id  for image_id in range(image_id, image_id + 20)]

    data = get_images_by_ids(index_list)
    return data
    
def get_images_by_ids(index_list):
    images_list = images_collection.find({"_id": {"$in": index_list}})
    sorted_images = sorted(images_list, key=lambda img: index_list.index(img["_id"]))
    sorted_id = [image["_id"] for image in sorted_images]

    image_list = [image for image in sorted_images]

    images_length = len(sorted_images)
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64

    image_json = {}
    image_json['result'] = image_list
    image_json ['images_length'] = images_length
    return json.dumps(image_json)


@app.route('/process_sketch', methods=['POST'])
def process_sketch():
    request_data = request.get_json()
    sketch_data = request_data.get('sketchData')
    query = request_data.get('query')
    sketch_data = sketch_data.replace("data:image/png;base64,", "")
    type = list(request_data.get('checkboxes', {}).values())
    query_filter = list(request_data.get('textfields', {}).values())


    with open("temp.jpg", "wb") as imgFile:
        imgFile.write(base64.b64decode(sketch_data))

    sketch_data = Image.open('temp.jpg')

    idx_image_list = sketch_model.sketch_search(sketch_data, query , k=400)
    print(idx_image_list)
    idx_image_list = filter.detection(idx_image_list, query_filter, type)
    
    data = get_images_by_ids(idx_image_list)
    return data

if __name__ == "__main__":
    app.run(debug=True)
    
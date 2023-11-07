from PIL import Image
import faiss
import matplotlib.pyplot as plt
import math
import numpy as np 
import clip
from langdetect import detect
from clip.model import CLIP
import json
import torch
from pathlib import Path
import sys
CODE_PATH = Path("./SketchModel/code")
MODEL_PATH = Path('./SketchModel/model')

from SketchModel.code.clip.clip import _transform
from SketchModel.code.clip.clip import tokenize
from SketchModel.code.clip.model import CLIP as MC

class Myfaiss:
    def __init__(self, bin_file : str, device, translater, clip_backbone="ViT-B/32", isSketch=False):
        self.index= self.load_bin_file(bin_file)
        self.device= device
        if isSketch == True:
            print('sketch')
            self.model = self.get_sketch_model()
            self.transformer = self.sketch_setup()
            print('self_transfomer', self.transformer)
        else:
            self.model, _ = clip.load(clip_backbone, device=device)
        self.translater = translater

    def sketch_setup(self):
        sys.path.append(str(CODE_PATH))
      
        transformer = _transform(self.model.visual.input_resolution, is_train=False)
        print('transformer', transformer)
        return transformer

    def get_sketch_model(self):
        model_config_file = CODE_PATH / 'training/model_configs/ViT-B-16.json'
        model_file = MODEL_PATH / 'tsbir_model_final.pt'
        gpu = 0
        torch.cuda.set_device(gpu)
        with open(model_config_file, 'r') as f:
            model_info = json.load(f)

        model = MC(**model_info)

        loc = "cuda:{}".format(gpu)
        checkpoint = torch.load(model_file, map_location=loc)

        sd = checkpoint["state_dict"]
        if next(iter(sd.items()))[0].startswith('module'):
            sd = {k[len('module.'):]: v for k, v in sd.items()}

        model.load_state_dict(sd, strict=False)

        model.eval()

        model = model.cuda()


        return model
    def load_bin_file(self, bin_file: str):
        return faiss.read_index(bin_file)
    
    def show_images(self, image_paths):
        fig = plt.figure(figsize=(15, 10))
        columns = int(math.sqrt(len(image_paths)))
        rows = int(np.ceil(len(image_paths)/columns))

        for i in range(1, columns*rows +1):
          img = plt.imread(image_paths[i - 1])
          ax = fig.add_subplot(rows, columns, i)
          ax.set_title('/'.join(image_paths[i - 1].split('/')[-3:]))

          plt.imshow(img)
          plt.axis("off")

        plt.show()
        
    def image_search(self, id_query, k): 
        query_feats = self.index.reconstruct(id_query).reshape(1,-1)

        scores, idx_image = self.index.search(query_feats, k=k)
        idx_image = idx_image.flatten()

        # infos_query = list(map(self.id2img_fps.get, list(idx_image)))
        # image_paths = [info for info in infos_query]

        
        return idx_image
    
    def text_search(self, text, k):
        if detect(text) == 'vi':
            print('viet')
        text = self.translater(text)

        ###### TEXT FEATURES EXACTING ######
        text = clip.tokenize([text]).to(self.device)  
        text_features = self.model.encode_text(text).cpu().detach().numpy().astype(np.float32)

        # ###### SEARCHING #####
        scores, idx_image = self.index.search(text_features, k=k)
        idx_image = idx_image.flatten()
        ###### GET INFOS KEYFRAMES_ID ######
        # infos_query = list(map(self.id2img_fps.get, list(idx_image)))
        # image_paths = [info for info in infos_query]

        print(idx_image)
        return idx_image
    
    # sketch serch
    def sketch_search(self, query_sketch, query_text, k):
        if query_text == '':
            return 
        
        if detect(query_text) == 'vi':
            print('viet')
        text = self.translater(query_text)
        
        print('query_text', query_text )
    
        get_sketch_feature = self.get_feature(query_sketch, text)
        print('get_search_feature', type(get_sketch_feature.cpu().numpy()))
    
        scores, idx_image = self.index.search(get_sketch_feature.cpu().numpy(), k=k)
        return idx_image.ravel().tolist()
        
    
    def get_feature(self, query_sketch, query_text):
        print('get_feature_1', self.transformer)
        print('test')
        img1 = self.transformer(query_sketch).unsqueeze(0).cuda()
        print('get_feature_text_query', query_text)
       
        text = clip.tokenize([query_text]).to('cuda')   
        print('txt', text)
        with torch.no_grad():
            sketch_feature = self.model.encode_sketch(img1)
            text_feature = self.model.encode_text(text)
            text_feature = text_feature / text_feature.norm(dim=-1, keepdim=True)
            sketch_feature = sketch_feature / sketch_feature.norm(dim=-1, keepdim=True)

        return self.model.feature_fuse(sketch_feature,text_feature)
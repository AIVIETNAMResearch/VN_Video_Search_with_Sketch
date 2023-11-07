
import numpy as np
'''
giả sử ban đầu sau khi dùng CLIP truy xuất ta lấy 1000-NN để global ranking 
1000 kết quả ko nhất thiêt là hiển thị lên UI hết mà có thể chỉ chọn 100 ảnh
để hiển thị.

Từ 1000 ảnh đó, ta tiếp tục re-ranking lại theo số lượng người
sau khi re-ranking thì những ảnh không chứa người 

Query -> (faiss-CLIP) -> tập id 500-1000 [A]
tập id [A], thông tin số người -> (class re-ranking) -> tập id sau khi đã ranking [B]
tập id [B] -> (chọn 100 id đầu) -> tập id để hiển thị
'''
class Filter:
    def __init__(self, detect_path):
        self.__detect_info = np.load(detect_path)
        self.__largest_num = 5

    def __re_ranking_1(self, input_id_list, query_num, index):
        '''
        Re-ranking theo 1 điều kiện (hoặc số nam hoặc số nữ hoặc số người)
        '''
        exact_list = []
        large_list = []
        small_list = []
        for id in input_id_list:
            n = self.__detect_info[id][index]
            if n == query_num:
                exact_list.append(id)
            elif n > query_num:
                large_list.append(id)
            else:
                small_list.append(id)
        return exact_list + large_list + small_list
    
    def __re_ranking_2(self, input_id_list, fe_query_num, ma_query_num):
        '''
        Re-ranking theo 2 điều kiện số nam và số nữ
        '''
        ma_id_list = self.__re_ranking_1(input_id_list, ma_query_num, 2)
        return self.__re_ranking_1(ma_id_list, fe_query_num, 1)

    def detection(self, input_id_list:list, input_number_list:list, type:list=[True, True, True]):
        '''
        Parameters
            input_id_list
            number_list: list(<số người>,<số nữ>,<số nam>)
                -1: là không biết
                0<=n<=5: biết số lượng
                n>5: không xét
            type: list(<biết số người>,<biết số nữ>,<biết số nam>)
        Returns
            status: bool
                True: OK
                False: Error
            output_id_list
        '''
        if len(input_id_list) == 0:
            return []
        
        # TIỀN XỬ LÝ
        if (input_number_list[0] > self.__largest_num) or \
            (input_number_list[1] > self.__largest_num) or \
            (input_number_list[2] > self.__largest_num):
            input_number_list[0] = -1
            input_number_list[1] = -1
            input_number_list[2] = -1
        
        # LẤY KIỂU QUERY
        run_type = ""
        if (not type[0]) and (not type[1]) and (not type[2]):
            run_type = "none"
        elif type[0] and type[1] and type[2]:
            run_type = "al-fe-ma"
        elif type[0] and type[1] and (not type[2]):
            run_type = "al-fe"
        elif type[0] and (not type[1]) and type[2]:
            run_type = "al-ma"
        elif type[0] and (not type[1]) and (not type[2]):
            run_type = "al"
        elif (not type[0]) and type[1] and (not type[2]):
            run_type = "fe"
        elif (not type[0]) and (not type[1]) and type[2]:
            run_type = "ma"
        elif (not type[0]) and (type[1]) and type[2]:
            run_type = "al-fe-ma"

        # CHẠY THEO KIỂU BỘ LỌC
        if run_type == "none":
            return input_id_list
        
        elif run_type == "fe":
            return self.__re_ranking_1(input_id_list, input_number_list[1], 1)
        
        elif run_type == "ma":
            return self.__re_ranking_1(input_id_list, input_number_list[2], 2)
        
        elif run_type == "al":
            return self.__re_ranking_1(input_id_list, input_number_list[0], 0)
        
        elif run_type == "al-fe":
            # ưu tiên số lượng theo nữ trước n số người
            all_id_list =  self.__re_ranking_1(input_id_list, input_number_list[0], 0)
            return self.__re_ranking_1(all_id_list, input_number_list[1], 1)
        
        elif run_type == "al-ma":
            # ưu tiên số lượng theo nam trước n số người
            all_id_list =  self.__re_ranking_1(input_id_list, input_number_list[0], 0)
            return self.__re_ranking_1(all_id_list, input_number_list[2], 2)
        
        elif run_type == "al-fe-ma":
            return self.__re_ranking_2(input_id_list, input_number_list[1], input_number_list[2])

        else:
            raise Exception(f"Not found run_type: {run_type}!!!")

    def __remove_punctuation(self, text):
        # Using filter() and lambda function to filter out punctuation characters
        result = ''.join(filter(lambda x: x.isalpha() or x.isdigit() or x.isspace(), text))
        return result

    def __similar_word_count(self, text, query):
        """Find exact words"""
        text = self.__remove_punctuation(text)
        query = self.__remove_punctuation(query)
        dText   = set(text.lower().split())
        dSearch = set(query.lower().split())
        # print(dText)
        count = 0
        for text_word in dText:
            for search_word in dSearch:
                if search_word == text_word:
                    count += 1
        return count

    def OCR(self, query, id_list=None):
        if id_list == None:
            id_list = [i for i in range(len(self.__ocr_info))]
        list_part2 = [[i,self.__similar_word_count(self.__ocr_info[i], query)] for i in range(len(self.__ocr_info))]
        return list(np.array(sorted(list_part2, key=lambda x: x[1], reverse=True))[:,0])


# =================================================================
''' HƯỚNG DẪN CHẠY
# Ví dụ đường dẫn file npy detect
detect_npy_path = ".../person_detection.npy"

# Cách khởi tạo
filter = Filter(detect_path=detect_npy_path)

# Cách sử dụng filter
input_id_list = [...] # list các id sau khi dùng KNN (khoảng 500-1000 id)
query = [x,y,z] # list 3 giá trị nguyên [<số người>,<số nu>,<số nam>]
type = [a,b,c] # list 3 giá trị bool
output_id_list = filter.detection(input_id_list, query, type)

# Trả về k-id để in lên màn hình
id_list = output_id_list[:k]
'''

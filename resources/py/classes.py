import json
from typing import List

letters = "abcdefghijklmnopqrstuvwxyz"

class Stats():
    def __init__(self):
        self.letters = 0
        self.games = 0

        self.letterCounts = {l:0 for l in letters}
    
    def countLetters(self, words : List[str]):
        words_str = "".join(words)
        for letter in self.letterCounts:
            self.letterCounts[letter] += words_str.count(letter)
    
    def to_dict(self):
        return {
            "games":self.games,
            "letters":self.letters,
            "individualLetters":self.letterCounts
        }

class Letter():
    def __init__(self, value : str, state : int, index : int):
        self.value = value 
        self.index = index
        self.state = state
    
    

class Wordle():

    def __init__(self):
        
        self.words = []
        self.wordle_words = []
        self.stats = Stats()

        self._load_words()

    def _load_words(self):

        with open("resources/data/wordle_words.json") as f:
            self.wordle_words = json.load(f)
        
        with open("resources/data/words.json") as f:
            self.words = json.load(f)
    
    def _is_in(self, list : list, value):
        return value in list

    def calculate_word(self, wordList : List[str], letters : List[Letter]):
        
        possible_words = wordList
        letters_above_gray = []
        to_delete = {}

        self.stats.letters += len(possible_words) * 5
        self.stats.countLetters(possible_words)

        for letter in letters:
            if letter.value not in letters_above_gray or letter.state != 0:
            
                for word in possible_words:
                    if letter.state == 0 and letter.value.lower() in word.lower():
                        to_delete[word] = True 
                
                for word in possible_words:
                    if (letter.state == 2) and (((len(word) - 1) < letter.index) or word[letter.index].lower() != letter.value.lower()):
                        to_delete[word] = True

            for word in possible_words:
                
                if letter.state == 1 and ( (letter.value.lower() not in word.lower()) or ( (len(word) - 1) >= letter.index) and word[letter.index].lower() == letter.value.lower() ):
                    to_delete[word] = True 
            
            
            letters_above_gray.append(letter.value)
        possible_words = [x for x in possible_words if not self._is_in(to_delete, x)]

        return possible_words
    

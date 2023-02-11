import nltk
nltk.download('omw-1.4')
nltk.download('wordnet')
from pattern import en, es, fr, it
from pattern.it import INFINITIVE, PRESENT, PAST, SG, SUBJUNCTIVE, PERFECTIVE, PL, IMPERFECT

class LEMMATIZER_EXCEPTION(Exception):
    def __init__(self, message):
        super().__init__(message)

numbers = [str(i) for i in range(0, 10001)]

class LEMMATIZER:
  def __init__(self, word, ln="it"):
    self.word = word
    self.CC = ["per", "dato che", "visto che"]
    self.LC = [["dato", "visto"], {"dato": ("che", "dato che"), "visto": ("che", "visto che")}]
    self.numbers = numbers
    self.ln = ln
    if self.ln == "it":
      self.pat = it
    elif self.ln == "en":
      self.pat = en
    elif self.ln == "es":
      self.pat = es
    elif self.ln == "fr":
      self.pat = fr
    else: 
      raise LEMMATIZER_EXCEPTION("Your lenguage is not supported")
  def lemmatize(self):
    word = self.pat.parse(self.word, tokenize=True, lemmata=True, chunk=True).split()[0]
    return_list = []
    for x in word:
        return_list.append(x[-1])
    return return_list
  def wordTokenize(self):
    tok = self.pat.parse(self.word, tokenize=True).split()[0]
    return_list = []
    for x in tok:
      return_list.append(x[0])
    return return_list
  def whatIS(self, nW=False):
    parse = self.pat.parse(self.word).split()[0][0][1]
    if self.word in self.LC[0] and self.ln == "it":
      condition = nW == self.LC[1].get(self.word)[0] 
      if condition:
        return "LC"
    if self.word in self.CC and self.ln == "it":
      return "CC"
    if self.word in self.numbers:
      return "NUMBER"
    elif self.word == "mazzini":
      return "NN"
    elif "VB" in parse or self.word == "aiuto":
      if nW != False:
        lemmatize = self.lemmatize()[0]
        if lemmatize == "essere" and self.ln == "it":
          self.pat.parse(self.word, tokenize=True, lemmata=True, chunk=True).split()[0]
          if "VB" in it.parse(nW).split()[0][0][1]:
            return "NEXT_VERB" 
        elif lemmatize == "avere" and self.ln == "it":
          if "VB" in it.parse(nW).split()[0][0][1]:
            return "NEXT_VERB" 
        elif lemmatize == "avendolare" and self.ln == "it":
          if "VB" in it.parse(nW).split()[0][0][1]:
            return "NEXT_VERB"
      return "VERB"
    else:
      return parse
  def find(self, object):
    words = self.wordTokenize()
    for x in words:
      if LEMMATIZER(x).whatIS() == object:
        return x
    return False
  def tenses(self):
    if self.whatIS() == "VERB":
      return self.pat.tenses(self.word)[0]
    else:
      raise LEMMATIZER_EXCEPTION("The word isn't a verb")
  def gender(self):
    return self.pat.gender(self.word)
  def conj(self, person, number):
    return self.pat.conjugate(self.word, PRESENT, person, SG if number == "singular" else PL)
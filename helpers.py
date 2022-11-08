import requests
import praw
from nltk.sentiment.vader import SentimentIntensityAnalyzer

import json
import requests

'''
For testing purposes and helper functions
'''
def search_reddit(s):
    reddit = praw.Reddit(client_id='g0mFlCzhimudIRrqxZuqVw', 
                     client_secret='feYFQImHDx42cW-3ce1Bq18GtysnwQ', 
                     user_agent='Multi-vise')

    sia = SentimentIntensityAnalyzer()
    subreddit = reddit.subreddit('relationship_advice')
    posts = subreddit.search("s", limit = 5)
    comments = []
    for post in posts:
        for comment in post.comments[1:6]:
            pol_score = sia.polarity_scores(comment.body)
            comments.append({'post' : post.title, 'text': comment.body, 'score': comment.score, 'sen_score': pol_score})
    return comments
print(search_reddit('Life is hard?'))

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
API_URL_passage = "https://api-inference.huggingface.co/models/sentence-transformers/msmarco-distilbert-base-tas-b"
api_token = "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"
headers = {"Authorization": f"Bearer {api_token}"}

def similarity (source_sentence, other_sentences):
    query = {
        "inputs": {
            "source_sentence": source_sentence,
            "sentences":other_sentences
        }
    }
    response = requests.post(API_URL, headers=headers, json = query)
    return response.json()

def passage_ranking(source_query, other_texts):
    query = {"inputs": {
                "source_sentence": source_query,
                "sentences": other_texts
            }
        }
    response = requests.post(API_URL, headers=headers, json=query)
    return response.json()

data = passage_ranking("That is a happy person",[
                "That is a happy dog",
                "That is a very happy person",
                "Today is a sunny day"
            ])
print(data)

data = similarity("I'm very happy", ["I'm filled with happiness", "I'm happy"])

print(data)

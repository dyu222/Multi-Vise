import requests
import praw
from nltk.sentiment.vader import SentimentIntensityAnalyzer

import json
import requests
import numpy


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

'''
For testing purposes and helper functions
'''
def search_reddit(s):
    reddit = praw.Reddit(client_id='g0mFlCzhimudIRrqxZuqVw', 
                     client_secret='feYFQImHDx42cW-3ce1Bq18GtysnwQ', 
                     user_agent='Multi-vise')

    sia = SentimentIntensityAnalyzer()
    subreddit = reddit.subreddit('relationship_advice')
    posts = subreddit.search("s", limit = 10)
    new_posts = []
    text = []
    for post in posts:
        text.append(post.title  + post.selftext)
        new_posts.append(post)

    
    ranking = passage_ranking(s, text)
    sort_index = numpy.argsort(ranking)[7:10]
    selected_posts = []
    temp = 0
    for post in new_posts:
        if temp in sort_index:
            selected_posts.append(post)
        temp = temp + 1
        
        
    

    comments = []
    for post in selected_posts:
        base = post.comments[1]
        pol_score = sia.polarity_scores(base.body)
        comments.append({'post' : post.title, 'text': base.body, 'score': base.score, 'sen_score': pol_score})
        other_comments = []
        score = []
        for comment in post.comments[2:]:
            other_comments.append(comment.body)
            score.append(comment.score)
        sim = similarity(base.body, other_comments)
        second = other_comments[numpy.argmin(sim)]
        pol_score = sia.polarity_scores(second)
        comments.append({'post' : post.title, 'text': second, 'score': score[numpy.argmin(sim)], 'sen_score': pol_score})


    return comments

inp = input("Ask questions \n")

#print(search_reddit('I am having a toxic relationship. Should I break up?'))
print(search_reddit(inp))




import requests
import praw
import ssl
import nltk
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer

import json
import requests
import numpy
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
from better_profanity import profanity


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

def analyze_posts(question, posts, model, tokenizer):
    sia = SentimentIntensityAnalyzer()
    advice = []
    bot_advice = get_bot_answer(model, tokenizer, question)
    sentiment = sia.polarity_scores(bot_advice)
    advice.append({'post' : 'bot advice', 'text': bot_advice, 'score': 0, 'sen_score': sentiment})


    for post in posts:
        comments_text = []
        comments = post['comments']
        for comment in comments:
            comments_text.append(comment['text'])

        similar_advice_score = similarity("You should, would, could, do this", comments_text)
        filtered_comments = []
        for i in range(len(comments)):
            if similar_advice_score[i] > 0.07:
                filtered_comments.append(comments[i])
        
        if len(filtered_comments) == 1:
            pol_score = sia.polarity_scores(filtered_comments[0]['text'])
            advice.append({'post' : post['title'], 'text': filtered_comments[0]['text'], 'score': filtered_comments[0]['score'], 'sen_score': pol_score})
        if len(filtered_comments) > 1:
            pol_score = sia.polarity_scores(filtered_comments[0]['text'])
            advice.append({'post' : post['title'], 'text': filtered_comments[0]['text'], 'score': filtered_comments[0]['score'], 'sen_score': pol_score})
            other_comments = []
            for c in filtered_comments[1:]:
                other_comments.append(c['text'])
            sim = similarity(filtered_comments[0]['text'], other_comments)
            second = numpy.argmin(sim) + 1 
            pol_score = sia.polarity_scores(filtered_comments[second]['text'])
            advice.append({'post' : post['title'], 'text': filtered_comments[second]['text'], 'score': filtered_comments[second]['score'], 'sen_score': pol_score})
    for comment in advice:
        censor_text = profanity.censor(comment['text'])
        comment['text'] = censor_text
    print(advice)
    return advice
            
def get_bot_answer(model, tokenizer, question):
    # mname = "facebook/blenderbot-400M-distill"
    # model = BlenderbotForConditionalGeneration.from_pretrained(mname)
    # tokenizer = BlenderbotTokenizer.from_pretrained(mname)
    UTTERANCE = question

    inputs = tokenizer([UTTERANCE], return_tensors="pt")
    reply_ids = model.generate(**inputs, max_new_tokens=200)
    return tokenizer.batch_decode(reply_ids, skip_special_tokens=True)[0]







'''
For testing purposes and helper functions
'''
def search_reddit(s):
    reddit = praw.Reddit(client_id='g0mFlCzhimudIRrqxZuqVw', 
                     client_secret='feYFQImHDx42cW-3ce1Bq18GtysnwQ', 
                     user_agent='Multi-vise')

    sia = SentimentIntensityAnalyzer()
    subreddit = reddit.subreddit('relationship_advice')
    posts = subreddit.search(s, limit = 10)
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
        if len(post.comments) == 1 or len(post.comments) == 2:
            base = post.comments[-1]
            pol_score = sia.polarity_scores(base.body)
            comments.append(profanity.censor({'post' : post.title, 'text': profanity.censor(str(base.body)), 'score': base.score, 'sen_score': pol_score}))
            continue
        else:
            base = post.comments[1]
        pol_score = sia.polarity_scores(base.body)
        comments.append(profanity.censor({'post' : post.title, 'text': profanity.censor(str(base.body)), 'score': base.score, 'sen_score': pol_score}))
        other_comments = []
        score = []
        for comment in post.comments[2:]:
            other_comments.append(comment.body)
            score.append(comment.score)
        sim = similarity(base.body, other_comments)
        second = other_comments[numpy.argmin(sim)]
        pol_score = sia.polarity_scores(second)
        comments.append(profanity.censor({'post' : post.title, 'text': profanity.censor(str(second)), 'score': score[numpy.argmin(sim)], 'sen_score': pol_score}))

    return profanity.censor(comments)
#inp = input("Ask questions \n")

#print(search_reddit('I am having a toxic relationship. Should I break up?'))
#print(search_reddit(inp))
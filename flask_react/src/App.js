import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar'
import Result from './components/Result'

function App() {
  return (
    <div className="App">
      <h1>Multi-vise</h1>
      <SearchBar/>
      <Result/>
    </div>
  );
}

// document.addEventListener("DOMContentLoaded", async function(){
//   console.log(await redditResponse("My relationship is toxic. Should I break up?"));
// });

// /*
// RedditRespose
//     Input:
//         - Take a question or any text
//     Output:
//         - Return a list of comments of 5 related posts and its relevant information. 
//         - Element of list has the following keys:
//           + text: the comment text
//           + post: the title of the post the comment replies to
//           + score: reddit score
//           + sent_score: sentiment analysis score
// */
// async function redditResponse(s){
//   var snoowrap = require('snoowrap');
//   var natural = require('natural');
//   var tokenizer = new natural.WordTokenizer();
//   var Analyzer = require('natural').SentimentAnalyzer;
//   var stemmer = require('natural').PorterStemmer;
//   var analyzer = new Analyzer("English", stemmer, "afinn");


//   const r = new snoowrap({
//     userAgent: 'Multi-vise',
//     clientId: 'g0mFlCzhimudIRrqxZuqVw',
//     clientSecret: 'feYFQImHDx42cW-3ce1Bq18GtysnwQ',
//     refreshToken: '1972848092863-Le8seeRHjHt_40HFLrIC10yNaAWvPg'
//   });

//   const subreddit = await r.getSubreddit('relationship_advice');
//   const tempRelatedPosts = await subreddit.search({query: s, sort: "relevance"})
//   const relatedPosts = tempRelatedPosts.filter((post, index) => index < 5);

//   let data = [];
//   let comments = [];

//   relatedPosts.forEach(async (post) => {
//     let full_post = await post.expandReplies({limit: Infinity, depth: Infinity});
//     data.push({
//       link: post.url,
//       text: post.title,
//       score: post.score
//     })
//     let post_comments = full_post.comments;

//     post_comments.forEach((comment)=>{
//       let sentiment_score = analyzer.getSentiment(tokenizer.tokenize(comment.body));
//       if (comment.author.name !== 'AutoModerator'){
//         comments.push({
//           text: comment.body,
//           post: post.title,
//           score: comment.score,
//           sent_score: sentiment_score
//         })
//       }
//     });
//   });
//   return comments
// }

export default App;

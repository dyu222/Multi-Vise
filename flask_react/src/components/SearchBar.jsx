import './SearchBar.css'
import Result from "./Result"
// import redditResponse from '../App'
// import redditResponse from '../../src/App'
async function redditResponse(s){
    var snoowrap = require('snoowrap');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var Analyzer = require('natural').SentimentAnalyzer;
    var stemmer = require('natural').PorterStemmer;
    var analyzer = new Analyzer("English", stemmer, "afinn");
  
  
    const r = new snoowrap({
      userAgent: 'Multi-vise',
      clientId: 'g0mFlCzhimudIRrqxZuqVw',
      clientSecret: 'feYFQImHDx42cW-3ce1Bq18GtysnwQ',
      refreshToken: '1972848092863-Le8seeRHjHt_40HFLrIC10yNaAWvPg'
    });
  
    const subreddit = await r.getSubreddit('relationship_advice');
    const tempRelatedPosts = await subreddit.search({query: s, sort: "relevance"})
    const relatedPosts = tempRelatedPosts.filter((post, index) => index < 5);
  
    let data = [];
    let comments = [];
  
    relatedPosts.forEach(async (post) => {
      let full_post = await post.expandReplies({limit: Infinity, depth: Infinity});
      data.push({
        link: post.url,
        text: post.title,
        score: post.score
      })
      let post_comments = full_post.comments;
  
      post_comments.forEach((comment)=>{
        let sentiment_score = analyzer.getSentiment(tokenizer.tokenize(comment.body));
        if (comment.author.name !== 'AutoModerator'){
          comments.push({
            text: comment.body,
            post: post.title,
            score: comment.score,
            sent_score: sentiment_score
          })
        }
      });
    });
    return comments
  }
async function getVal(){
    var userQuestion = document.getElementById('questionField').value;
    // var question = document.getElementById("questionField");
    // this.questionField = ''; // only needed maybe if we keep search bar after submit
    // console.log((userQuestion));
    console.log(await redditResponse(userQuestion));

    return (
      await redditResponse(userQuestion)
    );
} //need to funnel userQuestion into the API call now i think??

const SearchBar = () => (
    <div className="search-container">
        <input id="questionField" type="text" placeholder="Ask for advice..."></input>
        {/* <button className='submit-button' type="submit" Onclick={this.getVal}>Submit</button> */}
        {/* <button id="subButton" className='submit-button' type="submit" onlick='getVal()'>Submit</button> */}
        <button id="subButton" className='submit-button' type="submit" onClick={getVal}>Submit</button>
        <Result results={getVal}/>
    </div>

);
// var subButton = document.getElementById('subButton');
// subButton.addEventListener('click', getVal, false); 

export default SearchBar;
import './SearchBar.css'
import Result from "./Result"
import axios from "axios";


async function searchReddit(question) {
  var snoowrap = require('snoowrap');

    const r = new snoowrap({
    userAgent: 'Multi-vise',
    clientId: 'g0mFlCzhimudIRrqxZuqVw',
    clientSecret: 'feYFQImHDx42cW-3ce1Bq18GtysnwQ',
    refreshToken: '1972848092863-Le8seeRHjHt_40HFLrIC10yNaAWvPg'
  });

  const subreddit = await r.getSubreddit('relationship_advice');
  const tempRelatedPosts = await subreddit.search({query: question, sort: "relevance"})
  const relatedPosts = await tempRelatedPosts.filter((post, index) => index < 5)
  
  let data = [];
  await relatedPosts.forEach(async (post) => {
    let full_post = await post.expandReplies({limit: Infinity, depth: Infinity});
    
    let post_comments = await full_post.comments;
    let curr_comments = [];

    post_comments.forEach(async (comment)=>{
      if ((await comment.author.name !== 'AutoModerator') && (comment.body !== '[deleted]')){
        curr_comments.push({
          text: await comment.body,
          score: await comment.score,
          author: await comment.author.name
        })
      }
    })

    data.push({
      id: await post.id,
      score: await post.score,
      link: await post.url,
      title: await post.title,
      text: await post.selftext,
      comments: curr_comments
    })
    console.log(data.length)
  })
  console.log(data.length)
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(6000);
  return data
}

async function getResults(question){
  let result = await searchReddit(question)

  axios.post('http://127.0.0.1:5000/reddit', {query: question, data: result})
  .then((response) => {
    console.log(response.data)
    const res = response.data
  }).catch((error) => {
    if (error.response) {
      console.log(error.response)
      console.log(error.response.status)
      console.log(error.response.headers)
      }
  })
}

async function getVal(){
  var userQuestion = document.getElementById('questionField').value;
  return (
    getResults(userQuestion)
  );
}

const SearchBar = () => (

    <div className="search-container">
        <textarea id="questionField" type="text" placeholder="Ask for advice..." cols="40" rows="5"></textarea>
        <button id="subButton" className='submit-button' type="submit" onClick={getVal}>Submit</button>
        <Result results={getVal}/>
    </div>

);

export default SearchBar;
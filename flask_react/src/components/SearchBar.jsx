import './SearchBar.css'
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
// global variables to store results
var res1;
var res2;
var res3;
var score1;
var score2;
var score3;


async function getResults(question){
  let result = await searchReddit(question)
  
  await axios.post('http://127.0.0.1:5000/reddit', {query: question, data: result})
  .then((response) => {
    console.log(response.data)
    res1 = response.data.result[0].text
    res2 = response.data.result[1].text
    res3 = response.data.result[2].text
    score1 = response.data.result[0].sen_score.compound
    score2 = response.data.result[1].sen_score.compound
    score3 = response.data.result[2].sen_score.compound

  }).catch((error) => {
    if (error.response) {
      console.log(error.response)
      console.log(error.response.status)
      console.log(error.response.headers)
      }
  })
  // const delay = ms => new Promise(res => setTimeout(res, ms));
  // await delay(20000);
  console.log(res1)
  console.log(res2)
  console.log(res3)
  console.log(score1)
  console.log(score2)
  console.log(score3)

  document.getElementById("res1").innerHTML = 'Advice #1: ' + res1
  document.getElementById("score1").innerHTML = 'Sentiment Score: ' + score1
  document.getElementById("res2").innerHTML = 'Advice #2: ' + res2
  document.getElementById("score2").innerHTML = 'Sentiment Score: ' + score2
  document.getElementById("res3").innerHTML = 'Advice #3: ' + res3
  document.getElementById("score3").innerHTML = 'Sentiment Score: ' + score3
  //document.getElementById("result").setAttribute('results', [])
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
        <button id="subButton" className='submit-button' type="submit" onClick={getVal} style={{marginBottom:'2%'}}>Submit</button>
        <div style={}>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'70%', marginLeft:'15%', marginRight:'15%',marginBottom:'2%'}}>
            <h1 id="res1" style={{margin:'0.25%'}}>No Advice Loaded{res1}</h1>
            <h3 id="score1" style={{margin:'0.25%'}}>{score1}</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'70%', marginLeft:'15%', marginRight:'15%',marginBottom:'2%'}}>
            <h1 id="res2" style={{margin:'0.25%'}}>Please Type a Relationship Question and Click Submit{res2}</h1>
            <h3 id="score2" style={{margin:'0.25%'}}>{score2}</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'70%', marginLeft:'15%', marginRight:'15%',marginBottom:'2%'}}>
            <h1 id="res3" style={{margin:'0.25%'}}>Load Times are ~10 seconds{res3}</h1>
            <h3 id="score3" style={{margin:'0.25%'}}>{score3}</h3>
          </div>
        </div>
    </div>

);

export default SearchBar;
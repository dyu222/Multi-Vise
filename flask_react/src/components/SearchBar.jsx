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
var res4;
var res5;
var res6;
var score1;
var score2;
var score3;
var score4;
var score5;
var score6;


async function getResults(question){
  let result = await searchReddit(question)
  
  await axios.post('http://127.0.0.1:5000/reddit', {query: question, data: result})
  .then((response) => {
    console.log(response.data)
    res1 = response.data.result[0].text
    res2 = response.data.result[1].text
    res3 = response.data.result[2].text
    res4 = response.data.result[3].text
    res5 = response.data.result[4].text
    res6 = response.data.result[5].text
    score1 = response.data.result[0].sen_score.compound
    score2 = response.data.result[1].sen_score.compound
    score3 = response.data.result[2].sen_score.compound
    score4 = response.data.result[3].sen_score.compound
    score5 = response.data.result[4].sen_score.compound
    score6 = response.data.result[5].sen_score.compound

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
  console.log(res4)
  console.log(score1)
  console.log(score2)
  console.log(score3)
  console.log(score4)

  document.getElementById("res1").innerHTML = res1
  //'Advice #1: ' + res1
  document.getElementById("score1").innerHTML = 'Sentiment Score: ' + score1
  document.getElementById("res2").innerHTML = res2
  //'Advice #2: ' + res2
  document.getElementById("score2").innerHTML = 'Sentiment Score: ' + score2
  document.getElementById("res3").innerHTML = res3
  //'Advice #3: ' + res3
  document.getElementById("score3").innerHTML = 'Sentiment Score: ' + score3
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
        <div style={{display: 'flex', marginTop: '50px', fontWeight: 'bold', fontSize: '25px'}}>
          <div style={{marginLeft: '12%', marginRight: '22%'}}>Advice #1:</div>
          <div style={{marginRight: '22%'}}>Advice #2:</div>
          <div style={{}}>Advice #3:</div>
        </div>
        <div style={{display: 'flex', marginTop: '20px'}}>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'30%', marginLeft:'2%', marginRight:'2%',marginBottom:'2%'}}>
            <h1 id="res1" style={{margin:'0.25%', fontWeight:'400'}}>Load Times are ~10 seconds{res1}</h1>
            <h3 id="score1" style={{margin:'0.25%', fontWeight:'200', marginTop: 'auto'}}>{score1}</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'30%', marginLeft:'2%', marginRight:'2%',marginBottom:'2%'}}>
            <h1 id="res2" style={{margin:'0.25%', fontWeight:'400'}}>Please Type a Relationship Question and Click Submit{res2}</h1>
            <h3 id="score2" style={{margin:'0.25%', fontWeight:'200', marginTop: 'auto'}}>{score2}</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', border:'2px solid black', width:'30%', marginLeft:'2%', marginRight:'2%',marginBottom:'2%'}}>
            <h1 id="res3" style={{margin:'0.25%', fontWeight:'400'}}>Load Times are ~10 seconds{res3}</h1>
            <h3 id="score3" style={{margin:'0.25%', fontWeight:'200', marginTop: 'auto'}}>{score3}</h3>
          </div>
        </div>
    </div>

);

export default SearchBar;
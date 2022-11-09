import './SearchBar.css'
import Result from "./Result"
import axios from "axios";


function getResults(question) {
  axios.post('http://127.0.0.1:5000/reddit', {'query':question})
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
        <input id="questionField" type="text" placeholder="Ask for advice..."></input>
        <button id="subButton" className='submit-button' type="submit" onClick={getVal}>Submit</button>
        <Result results={getVal}/>
    </div>

);

export default SearchBar;
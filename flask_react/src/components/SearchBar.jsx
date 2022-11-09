import './SearchBar.css'
import Result from "./Result"
import axios from "axios";


function getResults(question) {
  axios({
    method: "POST",
    url:"/reddit",
    data:question,
  })
  .then((response) => {
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
import './SearchResults.css'

const SearchResults = ({resultArray}) => (
    <div className="result-container">
        <h1>{resultArray[0]}</h1>
        <h3>Sentiment Score = {resultArray[1]}</h3>
    </div>
);

export default SearchResults;
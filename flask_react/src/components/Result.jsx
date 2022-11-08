import './Result.css'

const Result = ({ results }) => (
    <div className="result-display">
        {
        results !== undefined
        ?
            results.length === 0
            ?   <div className="no-results">
                    {console.log("no results")}
                </div>
            :   <div className="yes-results">
                    {console.log("yes results")}
                    { results.map(result => (
                        <div key={result}>
                            <p> {results[result].text} </p>
                            {console.log("printing result")}
                        </div>
                    ))
                    }
                </div>
        : <div>{console.log("Undefined results input")}</div>
        }
    </div>
);

export default Result;
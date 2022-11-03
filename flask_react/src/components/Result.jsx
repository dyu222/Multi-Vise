import './Result.css'

const Result = () => (
    <div className="result-container">
        <div className="result-card m-2 p-2">
            <div className = "result-body">
                <h3>Result #1</h3>
                <p>Insert advice metrics here</p>
            </div>
        </div>
        <div className="result-card m-2 p-2">
            <div className = "result-body">
                <h3>Result #2</h3>
                <p>Insert advice metrics here</p>
            </div>
        </div>
        <div className="result-card m-2 p-2">
            <div className = "result-body">
                <h3>Result #3</h3>
                <p>Insert advice metrics here</p>
            </div>
        </div>
        <div className="result-card m-2 p-2">
            <div className = "result-body">
                <h3>Result #4</h3>
                <p>Insert advice metrics here</p>
            </div>
        </div>
        <div className="result-card m-2 p-2">
            <div className = "result-body">
                <h3>Result #5</h3>
                <p>Insert advice metrics here</p>
            </div>
        </div>
    </div>
);
// const Result = ({result, id}) => {
//     return (
//       <div className="result-card m-2 p-2">
//             <div className = "result-body">
//                 <p>{result.text}</p>
//                 <p style={{fontStyle: 'italic'}}>Popularity: {result.score} | Sentiment: {result.sent_score}</p>
//             </div>
//       </div>  
//     );
// }

const ResultList = ({results}) => {
    return (
        <div className = "results">
            { Object.entries(results).map((result) =>
            result !== undefined && result !== null
            ? <Result result={result}/>
            : ''
            )}
        </div>
    )
}

// export default ResultList;
export default Result;
import React from "react";

const CompletedInterviewTable = (props) => {
    const { pastInterviewArray } = props
    return (
        <table className="ui six column compact table">
            <thead style={{ backgroundColor: '#E1E1E1 !important'}}>
                <tr style={{color: '#F9F9F9'}}><th className="three wide">Date</th>
                <th className="three wide">Topic</th>
                <th className="two wide" style={{ textAlign: 'center' }}>Correctness</th>
                <th className="two wide" style={{ textAlign: 'center' }}>Clarity</th>
                <th className="two wide" style={{ textAlign: 'center' }}>Behavioural</th>
                <th className="two wide"></th>
            </tr></thead>
            <tbody>
                {pastInterviewArray.map((item, index) => {
                    return <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.topic}</td>
                        <td style={{ textAlign: 'center' }}>{item.feedback.rate.correctnessRate}</td>
                        <td style={{ textAlign: 'center' }}>{item.feedback.rate.clarityRate}</td>
                        <td style={{ textAlign: 'cetner' }}>{item.feedback.rate.behvaiouralRate}</td>
                        <td><div className="ui primary button">View</div></td>
                    </tr>
                })}
                {/* <tr>
                    <td>Thu, 21 May 2020</td>
                    <td>Data Structure and Algorithm</td>
                    <td style={{ textAlign: 'center'}}>10</td>
                    <td style={{ textAlign: 'center'}}>6.5</td>
                    <td style={{ textAlign: 'center'}}>8</td>
                    <td><div className="ui primary button">View</div></td>
                </tr>
                <tr>
                    <td>Wed, 26 May 2020</td>
                    <td>System Design</td>
                    <td style={{ textAlign: 'center'}}>9</td>
                    <td style={{ textAlign: 'center'}}>10</td>
                    <td style={{ textAlign: 'center'}}>8</td>
                    <td><div className="ui primary button">View</div></td>
                </tr> */}
            </tbody>
        </table>
    );
}

export default CompletedInterviewTable;
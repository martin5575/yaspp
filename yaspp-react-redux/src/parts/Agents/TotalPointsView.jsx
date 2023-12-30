import { orderBy } from "lodash"
import { getShort } from "../../stats/statsType"

function TotalPointsView(props) {
    console.log(props)
    const data = props.data
    orderBy(data, ["sum"], ["desc"])
    return <div>
        <table className="table table-striped">
            <thead>
                <tr key="table-header">
                    <th scope="col">Rank</th>
                    <th scope="col">Agent</th>
                    <th scope="col">Points</th>
                </tr>
            </thead>
            <tbody>
                {data.map((x, index) => (<tr key={"table-" + x.agent}>
                    <td>{index + 1}</td>
                    <td>{getShort(x.agent)}</td>
                    <td>{x.sum}</td>
                </tr>))}
            </tbody>
        </table>
    </div>
}

export default TotalPointsView
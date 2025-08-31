import { orderBy } from "lodash"
import { getShort } from "../../stats/statsType"
import { getAgentColorScale } from './colors'

function TotalPointsView(props) {
    const data = props.data || []
    const sorted = orderBy(data, ["sum"], ["desc"])
    const shortNames = sorted.map(x => getShort(x.agent))
    const color = getAgentColorScale(shortNames)
    const maxSum = Math.max(1, ...sorted.map(x => x.sum || 0))

    return <div>
        <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
                <tr key="table-header">
                    <th scope="col" style={{width: 60}}>Rank</th>
                    <th scope="col">Agent</th>
                    <th scope="col" style={{width: '50%'}}>Points</th>
                </tr>
            </thead>
            <tbody>
                {sorted.map((x, index) => {
                    const name = getShort(x.agent)
                    const pct = Math.max(0, Math.min(100, Math.round((x.sum || 0) / maxSum * 100)))
                    return (
                        <tr key={"table-" + x.agent}>
                            <td><span className="badge bg-secondary">{index + 1}</span></td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span style={{display:'inline-block', width:12, height:12, borderRadius:3, backgroundColor: color(name), marginRight:8}}></span>
                                    <span>{name}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{display:'flex', alignItems:'center', gap:8}}>
                                    <div style={{flex:1, height:10, background:'#eee', borderRadius:5, overflow:'hidden'}}>
                                        <div style={{height:'100%', width:`${pct}%`, backgroundColor: color(name), borderRadius:5, boxShadow:'0 1px 2px rgba(0,0,0,0.2)'}}></div>
                                    </div>
                                    <div style={{minWidth:'3ch', textAlign:'right', fontWeight:600}}>{x.sum}</div>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
}

export default TotalPointsView
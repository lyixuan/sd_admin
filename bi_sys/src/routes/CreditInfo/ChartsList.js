import React from 'react';
import { connect } from 'dva';
import HengBarEcharts from '../../components/Chart/HengBarEcharts';

class ChartsList extends React.Component {
 
  componentDidMount() {
console.log(this.props.location.state)
  }

  render() {
    const {chartName,data,paramsObj}=this.props.location.state;
    return (
      <div>
        <HengBarEcharts chartName={chartName} data={data} paramsObj={paramsObj} key={chartName}/>
        {/*<HengBarEcharts isHidetoggleBtn={true} />*/}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(ChartsList);

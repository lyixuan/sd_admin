import React,{Component} from 'react';
import { connect } from 'dva';
import {Link, routerRedux} from 'dva/router';
import  Select, { Option } from 'rc-select';
import { StickyContainer, Sticky } from 'react-sticky';
import { Flex,Tabs,Calendar, ListView, Accordion, List } from 'antd-mobile';
import greenIcon from '../../assets/green.png'
import blueIcon from '../../assets/blue.png'
import yellowIcon from '../../assets/yellow.png'
import 'rc-select/assets/index.css';
import styles from './CreditDetails.css';
import $ from 'jquery'
import {getOrgMap} from '../../utils/dealWithOrg'
import {monthMean, weekMean, formatDate} from '../../utils/FormatDate'


const now = new Date();

class CreditDetails extends Component {
  	constructor(props) {
	    super(props);
		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
	    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

	    const dataSource = new ListView.DataSource({
	      getRowData,
	      getSectionHeaderData: getSectionData,
	      rowHasChanged: (row1, row2) => row1 !== row2,
	      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
	    });
	    this.state = {
	    	tabKey:0,//tabType
	    	U2R:false,//arrow Direction
		    dataSource,
		    visible: false,
			dateShow: '2018.03.20 周五-2018.03.20 周日',
			show: false,
	  	}
	}
	componentDidMount() {
		// $(".rc-select-search__field").attr('disabled',true);
		// 一级列表展示
		let {dataType,startTime,endTime,groupType,userId} = this.props.home.paramsObj;
		this.dataFetchFir({
			startTime,
			endTime,
			groupType,
			// userId
		});
		this.setState({
		    dateShow:`${formatDate(startTime)}-${formatDate(endTime)}`,
	        dataSource: this.genData(this.state.dataSource, this.props.CreditDetails.dataList),
	    });
	    // 高亮显示
		let highGroupId=[];
	    let highRowData = getOrgMap(this.props.index.organization.incubator,1);
	    console.log(highRowData)
	    for(let i=0; i<highRowData.length; i++){
	    	highGroupId.push(highRowData[i].id)
	    }
	    console.log(highGroupId)
	    this.props.dispatch({
	      type: 'CreditDetails/getHighData',
	      payload: highGroupId,
	    });
  	}
  	genData(ds, provinceData) {
	  	const dataBlob = {};
	  	const sectionIDs = [];
	  	const rowIDs = [];
	  	if(this.props.CreditDetails.dataList!=null){
		  	Object.keys(provinceData).forEach((item, index) => {
		    sectionIDs.push(item);
		    dataBlob[item] = item;
		    rowIDs[index] = [];
		    provinceData[item].data.forEach((jj) => {
		      rowIDs[index].push(jj.id);
		      dataBlob[jj.id] = jj;
		    });

		  });
		}else {
			setTimeout(() => {
		        this.setState({
		          	dataSource: this.genData(this.state.dataSource, this.props.CreditDetails.dataList),
		        });
		    }, 1000);
		}

	  	return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
	}
  	dataFetchFir(param){//请求一级接口
  		let sendParams = {
	      paramsObj:  {...this.props.CreditDetails.paramsObj, ...param }
	    }
	    this.props.dispatch({
	      type: 'CreditDetails/fetch',
	      payload: sendParams,
	    });
  	}

  	dataFetchSec(param){//请求2级接口
  		let sendParams = {
	      paramsObj2:  {...this.props.CreditDetails.paramsObj2, ...param }
	    }
	    this.props.dispatch({
	      type: 'CreditDetails/getDetail',
	      payload: sendParams,
	    });
  	}
	renderBtn(zh, config = {}) {

	    return (
	      <span
	        onClick={() => {
	          document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
	          this.setState({
	            show: true,
	            config,
	          });
	        }}
	      >
	        {zh}
	      </span>
	    );
  	}
	changeArrowDir = () => {
		this.setState({
			U2R:!this.state.U2R
		})
	}

  	onSelect = (value) => {    //周均月均自定义时间选择器
  		if(value == 1){
  			this.dataFetchFir({startTime:weekMean(now).startTime,endTime:weekMean(now).endTime});
  			this.setState({
  				dateShow:`${formatDate(weekMean(now).startTime)}-${formatDate(weekMean(now).endTime)}`,
  			})
  		}else if(value == 2){
  			this.dataFetchFir({startTime:monthMean(now).startTime,endTime:monthMean(now).endTime});
  			this.setState({
  				dateShow:`${formatDate(monthMean(now).startTime)}-${formatDate(monthMean(now).endTime)}`,
  			})
  		}

	}
  	onSelectHasDisableDate = (dates) => {
	    console.warn('onSelectHasDisableDate', dates);
	}

	onConfirm = (startTime, endTime) => {
	    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
	    this.setState({
	    	dateShow:`${formatDate(startTime)}-${formatDate(endTime)}`,
		    show: false,
	    });
	    this.dataFetchFir({startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime()});
	}

	onCancel = () => {
	    document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
	    this.setState({
	      show: false,
	      dateShow:this.state.dateShow,
	    });
	}

	secDataGetFn(id){////获得二级列表
		console.log(id)
		this.dataFetchSec({startTime:`${weekMean(now).startTime}`,endTime:`${weekMean(now).endTime}`,groupId:id})

	}
	fnCLickTab(val) {     //点击tab方法-----怎么重新渲染页面
		this.setState({
			tabKey:val
		})
		val +=1;
	  this.dataFetchFir({groupType:val});

	}
	jump2Data(data,data1,data2){
		this.props.dispatch(
	        routerRedux.push({
	          	pathname: '/DataIndex',
	          	state: {
	          		groupName:data1.project,
	          		scoreType: data.id,   //正面得分为1,负面的分为2
			      	dementionName : data2.project, //直播维度名称,选择button时会动态改变的值,上个页面传来初始值。
			      	dementionId:data2.id,  //直播维度ID,选择button时会动态改变的值,上个页面传来初始值。
	          	},
	        })
	    );
	}
	secDataTmp = () => {
		return (<li className={styles.liCssFir}>loading...</li>)
	}

    render() {

	  	const tabs = [
		    { title: '学院', sub: '1' },
		    { title: '家族', sub: '2' },
		    { title: '小组', sub: '3' },
		];
		const collegeTitle ={
		    selfTaught:['学院' ,'(自考)'],
		    barrier:['学院' ,'(壁垒)'],
		    Incubator:['学院' ,'(孵化器)'],

		}
		const familyTitle = {
			selfTaught:['家族' ,'(自考)'],
		    barrier:['家族' ,'(壁垒)'],
		    Incubator:['家族' ,'(孵化器)'],

		}
		const groupTitle = {

			selfTaught:['小组' ,'(自考)'],
		    barrier:['小组' ,'(壁垒)'],
		    Incubator:['小组' ,'(孵化器)'],
		}
		const rgb={
	      	col:'rgba(82,201,194,0.15)',
	      	fam:'rgba(243,169,47,0.15)',
	      	gro:'rgba(97,155,222,0.15)',
	      	higColor:'rgba(255,89,89,0.10)'
	  	}
		let i=0;
		const row = (rowData, sectionID, rowID) => {
			i +=1;
		    const header_info=(
		      	<div onClick={()=>this.secDataGetFn(rowData.id)} className="flex-container" style={{width:'6.98rem', color:"#333", height:'.8rem',background:(i == 4||i==8)?rgb.higColor:this.state.tabKey==0?rgb.col:this.state.tabKey==1?rgb.fam:rgb.gro}}>
	      			<div className={styles.tableCss} onClick={()=>{this.changeArrowDir.bind()}}>
		            	<div className={styles.leftCss}>{rowData.category}</div>
			            <div className={styles.proCss}>{rowData.project}</div>
			            <div className={styles.rankCss}>{rowData.creditScore}</div>
			            <div className={styles.equableCss}>{rowData.number}<span className={rowData.chain==0?styles.circleY:rowData.chain<0?styles.circleR:styles.circleG}></span></div>
			            <div className={styles.ringRatioCss}>{rowData.chain}%</div>
			            <div className={styles.countCss}></div>
		            	<div className={`${styles.rightCss} ${this.state.U2R?styles.arrowR:''}`}><img className={styles.arrow} src={this.state.tabKey==0?greenIcon:this.state.tabKey==1?yellowIcon:blueIcon}/></div>
		      		</div>
	      		</div>
		    )

		    return (
		        <div id={`rowId${i}`} key={rowID} style={{paddingBottom: '.14rem',fontSize:'.2rem' }}>
			      <Accordion className="my-accordion">
			        <Accordion.Panel header={header_info}>
			          <List className={styles.mylist} prefixCls="mylist" style={{background: this.state.tabKey==0?'rgba(82,201,194,0.15)':this.state.tabKey==1?'rgba(243,169,47,0.15)':'rgba(97,155,222,0.15)'}}>
			            <List.Item prefixCls="mylist">

			              	<ul className={styles.ulCss}>

								{this.props.CreditDetails.dataSecList==null?this.secDataTmp():Object.keys(this.props.CreditDetails.dataSecList).map((key,i)=>{
									let dataList = this.props.CreditDetails.dataSecList[key];
									i +=1;
									return (<li key={`fir${i}`} className={styles.liCssFir}>
										<div className={styles.tableCss}>
								            <div className={styles.leftCss}>{`${i}`}</div>
								            <div className={styles.proCss}>{dataList.project}</div>
								            <div className={styles.rankCss}></div>
								            <div className={styles.equableCss}>{dataList.creditScore}<span className={dataList.chain==0?styles.circleY:dataList.chain<0?styles.circleR:styles.circleG}></span></div>
								            <div className={styles.ringRatioCss}>{dataList.chain}%</div>
								            <div className={styles.countCss}></div>
								            <div className={styles.rightCss}></div>
								        </div>
								         <ul>
								            {
								            	Object.keys(dataList.data).map((key1,i1)=>{
								            		i1 +=1;
													return (<li key={`sec${i1}`} className={styles.liCssSec}>
														<div className={styles.tableCss}>
												            <div className={styles.leftCss}>{`1.${i}`}</div>
												            <div className={styles.proCss}>{dataList.data[key1].project}</div>
												            <div className={styles.rankCss}></div>
												            <div className={styles.equableCss}>{dataList.data[key1].creditScore}<span className={dataList.data[key1].chain==0?styles.circleY:dataList.data[key1].chain<0?styles.circleR:styles.circleG}></span></div>
												            <div className={styles.ringRatioCss}>{dataList.data[key1].chain}%</div>
												            <div className={styles.countCss}></div>
												            <div className={styles.rightCss}></div>
												        </div>
											        	<div>
															{
												            	 Object.keys(dataList.data[key1].data).map((key2,i2)=>{
												            	 	i2 +=1;
																	return (<div onClick={this.jump2Data.bind(this,dataList,dataList.data[key1],dataList.data[key1].data[key2])}
																			key={`thr${i2}`} className={`${styles.tableCss} ${styles.liCssThr}`}>
																            <div className={styles.leftCss}>{`${i2}）`}</div>
																            <div className={styles.proCss}>{dataList.data[key1].data[key2].project}</div>
																            <div className={styles.rankCss}></div>
																            <div className={styles.equableCss}>{dataList.data[key1].data[key2].creditScore}<span className={dataList.data[key1].data[key2].chain==0?styles.circleY:dataList.data[key1].data[key2].chain<0?styles.circleR:styles.circleG}></span></div>
																            <div className={styles.ringRatioCss}>{dataList.data[key1].data[key2].chain}%</div>
																            <div className={styles.countCss}>{dataList.data[key1].data[key2].number}题</div>
																			<div className={styles.rightCss}>< img className={styles.arrow1} src={this.props.CreditDetails.tabKey==0?greenIcon:this.state.tabKey==1?yellowIcon:blueIcon}/></div>
																        </div>)
																 })
												            }
											           	</div>
													</li>)
												 })
								            }
								            </ul>
									</li>)
								})}

			              	</ul>

			            </List.Item>
			          </List>
			        </Accordion.Panel>
			      </Accordion>
			    </div>
		    );
		};

	    return (

	      <div className={styles.normal}>

		    <Flex justify="arround" style={{height:'0.56rem',padding: '0.28rem 0.3rem 0.38rem', backgroundColor: '#fff'}}>
		      	<p className={styles.data_date}>{this.state.dateShow}</p>
		       	<div className={styles.selectCls}>
					<Select
			          defaultValue="周均数据"
			          optionLabelProp="children"
			          style={{ width:"1.88rem" ,height:'.56rem'}}
			          onChange={this.onSelect}
			        >
				        <Option value="1">周均数据</Option>
				        <Option value="2">月均数据</Option>
				        <Option value='3'>{this.renderBtn('自定义数据', 'Select Date Range')}</Option>
			        </Select>
      			</div>
		    </Flex>

	    	<div className={styles.tabBox}>
	    		<span className={`${styles.tabBtn} ${this.state.tabKey === 0 ? styles.sectedBtn : ''}`} onClick={() => (this.fnCLickTab(0))}>学院</span>
		        <span className={`${styles.tabBtn} ${this.state.tabKey === 1 ? styles.sectedBtn : ''}`} onClick={() => (this.fnCLickTab(1))}>家族</span>
		        <span className={`${styles.tabBtn} ${this.state.tabKey === 2 ? styles.sectedBtn : ''}`} onClick={() => (this.fnCLickTab(2))}>小组</span>
      		</div>


			<div>
				<ListView
		        ref={el => this.lv = el}
		        dataSource={this.state.dataSource}
		        className="am-list sticky-list"
		        style={{background:'#fff'}}
		        useBodyScroll
		        renderSectionWrapper={sectionID => (
		          <StickyContainer
		            key={`s_${sectionID}_c`}
		            className="sticky-container"
		            style={{ zIndex: 4 }}
		            id={`${sectionID}`}
		          />
		        )}
		        renderSectionHeader={sectionData => (

		          <Sticky>
		            {({
		              style,
		            }) => (
		              <div
		                className="sticky"
		                onClick={()=>{$('html, body').animate({scrollTop: 0}, 300)}}
		                style={{
		                  ...style,
		                  zIndex: 2,
		                  backgroundColor:this.state.tabKey==0?'#52C9C2':this.state.tabKey==1?'#F3A92F':'#619BDE',
		                  color: 'white',
		                  width:'6.98rem',
		                  height:'.8rem',
		                  fontSize:'.2rem',
		                  borderRadius:'.04rem .04rem 0 0'
		                }}
		              >
		              	<div className={styles.tableCss}>
				            <div className={styles.leftCss}>
				            	<span style={{paddingLeft :'.08rem'}}>
				            	{this.state.tabKey==0?
				            		(sectionData == 'selfExam'?collegeTitle.selfTaught[0]:
				            		sectionData == 'barrier'?collegeTitle.barrier[0]:
				            		collegeTitle.Incubator[0]):
				            	this.state.tabKey==1?
				            		(sectionData == 'selfExam'?familyTitle.selfTaught[0]:
				            		sectionData == 'barrier'?familyTitle.barrier[0]:
				            		familyTitle.Incubator[0]):
				            		(sectionData == 'selfExam'?groupTitle.selfTaught[0]:
				            		sectionData == 'barrier'?groupTitle.barrier[0]:
				            		groupTitle.Incubator[0])
				            	}
				            	<br/>
				            	{this.state.tabKey==0?
				            		(sectionData == 'selfExam'?collegeTitle.selfTaught[1]:
				            		sectionData == 'Bbarrier'?collegeTitle.barrier[1]:
				            		collegeTitle.Incubator[1]):
				            	this.state.tabKey==1?
				            		(sectionData == 'selfExam'?familyTitle.selfTaught[1]:
				            		sectionData == 'barrier'?familyTitle.barrier[1]:
				            		familyTitle.Incubator[1]):
				            		(sectionData == 'selfExam'?groupTitle.selfTaught[1]:
				            		sectionData == 'barrier'?groupTitle.barrier[1]:
				            		groupTitle.Incubator[1])
				            	}
				            	</span>
					        </div>
			            	<div className={styles.proCss}>项目</div>
				            <div className={styles.rankCss}>排名/总数</div>
				            <div className={styles.equableCss}>均分</div>
				            <div className={styles.ringRatioCss}>环比</div>
				            <div className={styles.countCss}>数量</div>
				            <div className={styles.rightCss}>操作</div>
				       </div>

		              </div>
		            )}
		          </Sticky>
		        )}
		        renderRow={row}
		        pageSize={3}
		        initialListSize={50}
		        onScroll={() => { }}
		        scrollEventThrottle={200}
		        onEndReached={this.onEndReached}
		        onEndReachedThreshold={10}
		      />

			</div>

       		<Calendar
	          {...this.state.config}
	          visible={this.state.show}
	          onCancel={this.onCancel}
	          onConfirm={this.onConfirm}
	          onSelectHasDisableDate={this.onSelectHasDisableDate}
	          infiniteOpt={true}
	        />
	    </div>
    )
  }
}
function mapStateToProps(state) {
  console.log(state)
  return state
}
export default connect(mapStateToProps)(CreditDetails);

import React, {Component} from 'react';
import styles from './Carouse.css';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import perCenterImg from '../../assets/perCenter.svg'
import MaskImg from '../../assets/banner.png'
import {Link} from 'dva/router'

class App extends Component {
  state = {
    data: ['1'],
    imgHeight: 176,
    slideIndex: 0,
  }
  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR'],
      });
    }, 100);
  }
  render() {
    return (
    	<div className={styles.normal}>
	      	<Carousel
	          dots={false}
	          infinite
	          selectedIndex={0}
	          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
	          afterChange={index => console.log('slide to', index)}
	        >
	          {this.state.data.map(val => (
	            <Link
	              key={val}
	              to="DataIndex"
	              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
	            >
	              <img
	                src={MaskImg}
	                alt=""
	                style={{ width: '100%',height:'2.8rem', verticalAlign: 'top' }}
	                onLoad={() => {
	                  // fire window resize event to change height
	                  window.dispatchEvent(new Event('resize'));
	                  this.setState({ imgHeight: 'auto' });
	                }}
	              />
	            </Link>

	          ))}
	        </Carousel>
	              <Link className={styles.perCenterImg} to="UserIndex"><img src={perCenterImg}/></Link>
	    </div>
    );
  }
}
export default App

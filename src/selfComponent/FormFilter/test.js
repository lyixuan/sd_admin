import React, { Component } from 'react';
import { Input } from 'antd';
import FormFilter from './FormFilter';

class BottomList extends Component {
  state = {
    // initFlagModal: {
    //   name: '1111',
    //   age: '222299',
    // },
  };
  onChange = e => {
    const { target } = e;
    const { value } = target;
    console.log(value);
  };
  onSearch = () => {
    console.log('search');
  };
  onSubmit = obj => {
    console.log(obj);
  };
  render() {
    return (
      <FormFilter onSubmit={this.onSubmit}>
        <div>
          <Input placeholder="Basic usage" onChange={this.onChange} flag="name" />
          <Input placeholder="Basic usage" onChange={this.onChange} flag="age" />
        </div>
      </FormFilter>
    );
  }
}
export default BottomList;

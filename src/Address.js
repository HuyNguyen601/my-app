import React, { Component } from 'react';

class Address extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
  }



  render() {
    return (
    <form>
      <input type="text" placeholder="Enter a location: " />
    </form>
  );
  }
}

export default Address;

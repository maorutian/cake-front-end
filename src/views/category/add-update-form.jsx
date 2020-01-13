import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Form, Input} from 'antd';

const Item = Form.Item;

class AddUpdateForm extends Component {

  //have static -- AddUpdateForm class, no static AddUpdateForm instant
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.string,
  };

  componentWillMount() {
    //pass this.props.form to parent component by this.props.setForm function
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {categoryName} = this.props;
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '', //add or update
              rules: [
                {required: true, message: 'name is required'}
              ]
            })(
              <Input type="text" placeholder="please enter name"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)
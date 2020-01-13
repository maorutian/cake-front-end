import React from 'react'

import './index.less'
/*
custom a button like a link
children:
  <LinkButton>xxxx</LinkButton>
  <LinkButton><span></span></LinkButton>
  <LinkButton><span></span><span></span></LinkButton>d
*/
export default function LinkButton (props) {
  return <button className="link-button" {...props}/>
}
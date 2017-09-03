import request from 'superagent';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import List from 'react-md/lib/Lists/List'

export default props => (
  <div className='domains'>
    <Button
      floating fixed primary
      tooltipPosition='left'
      tooltipLabel='Add domain'
      onClick={() => location.hash = '#domains/add'}
    >add</Button>

    <List className='domains-list section md-paper md-paper--1'>{
      props.data.domains.map(d =>
        <a href={'#domains/' + d.id}>
          <ListItem
            threeLines
            key={d.id}
            primaryText={d.domain}
          />
        </a>
      )
    }</List>
  </div>
)
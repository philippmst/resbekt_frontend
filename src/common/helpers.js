import React from 'react';
import Moment from 'react-moment';


export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomColors(x) {
  let colors=[];
  for (let i = 0; i < x; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}


export function arrayRemove(arr, value) {
  return arr.filter(function(ele){
      return ele != value;
  });
}



export const Datum = props => (
  <Moment date={props.date} format={'DD.MM.YYYY HH:mm:SS'} />
)
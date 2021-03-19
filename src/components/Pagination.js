import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';

const PageButton = ({label, isNumber, style, ...rest}) => {
  const color = style.color;
  delete style.color;

  return (
    <TouchableHighlight style={style} {...rest}>
      <Text style={{color}}>{label}</Text>
    </TouchableHighlight>
  );
}

const Pagination = ({ page, numberOfPages, onPageChange, label, styles }) => {
  const pageProps = (forPage, isNumber) => {
    const isCurrent = 1 === numberOfPages || forPage === page;

    const buttonStyle = {
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 2,
      paddingBottom: 2,
      ...styles?.button,
    };

    const currentButtonStyle = {
      ...buttonStyle,
      color: 'gray',
      ...styles?.currentButton,
    };

    const currentNumberButtonStyle = {
      ...buttonStyle,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 4,
      ...styles?.currentNumberButton,
    };

    let style = buttonStyle;

    if (isCurrent) {
      if (isNumber) {
        style = currentNumberButtonStyle;
      } else {
        style = currentButtonStyle;
      }
    }

    return {
      style,
      disabled: isCurrent,
      onPress: () => onPageChange(forPage),
    }
  }

  const style = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
    ...styles?.container,
  };

  const labelStyle = {
    marginRight: 30,
    ...styles?.label,
  };

  const maxPage = numberOfPages - 1;

  const startPage = Math.min(Math.max(0, page - 2), maxPage - 4);
  let showPages = [0,1,2,3,4].map(i => i + startPage);
  showPages = showPages.filter(i => i <= maxPage && i >= 0);

  return (
    <View style={style}>
      { label && <Text style={labelStyle}>{label}</Text> }
      <PageButton label="First" {...pageProps(0)} />
      <PageButton label="Previous" {...pageProps(Math.max(0, page - 1))} />
      {
        showPages.map(i => {
          return <PageButton key={i} label={i + 1} {...pageProps(i, true)} />
        })
      }
      <PageButton label="Next" {...pageProps(Math.min(maxPage, page + 1))} />
      <PageButton label="Last" {...pageProps(maxPage)} />
    </View>
  );
};

export default Pagination;

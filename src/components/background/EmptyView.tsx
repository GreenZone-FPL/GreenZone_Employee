import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Column } from '../containers/Column';
import { NormalText } from '../texts/NormalText';

const {width} = Dimensions.get('window');
interface EmptyViewProps {
  message?: string;
}
export const EmptyView: React.FC<EmptyViewProps> = ({
  message = 'Bạn không có thông báo nào',
}) => (
  <Column style={styles.container}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
    <NormalText text={message} style={styles.message} />
  </Column>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    backgroundColor: colors.transparent
  },
  emptyImage: {
    width: width / 1.5,
    height: width / 1.5,
  },
  message: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
  },
});

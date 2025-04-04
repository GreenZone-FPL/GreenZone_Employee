import PropTypes from 'prop-types';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import {Column} from '../containers/Column'
import {Row} from '../containers/Row'

const DialogBasicPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  titleStyle: PropTypes.object,
};


export const DialogBasic = ({ isVisible, onHide, title, children, style, titleStyle}) => {

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
     >
      <Pressable style={styles.overlay} onPress={onHide}>
        <Pressable style={[styles.modalContainer, style]} onPress={() => {}}>

          <OverlayStatusBar />

          <ScrollView>
            <KeyboardAvoidingView>
              <Row style={styles.header}>
                <View style={styles.placeholderIcon} />
                <Text style={[styles.titleText, titleStyle]}>{title}</Text>
                <TouchableOpacity onPress={onHide}>
                  <Icon
                    source="close"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.black}
                  />
                </TouchableOpacity>
              </Row>
              <Column style={styles.body}>
                {children}
              </Column>
            </KeyboardAvoidingView>
          </ScrollView>


        </Pressable>
      </Pressable>
    </Modal>
  );
};

DialogBasic.propTypes = DialogBasicPropTypes;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,

  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    paddingBottom: 24,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 2,
    borderBottomColor: colors.fbBg,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.transparent,
  },
  body: {
    flexDirection: 'column',
    margin: 14,
    gap: GLOBAL_KEYS.GAP_SMALL,
  }
});
/**
 * @Date: 2021-09-25
 * @Author encoboy-X
 * @Project SingleChoice
 * @Description
 */

"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";

const designWidth = 360;
const dbWidth = Dimensions.get("window").width;
export const PxToDp = (size) => size * (dbWidth / designWidth);

// 数组/对象深拷贝
export const deepCopy = (obj) => {
  var newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  }
  for (var i in obj) {
    newobj[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
  }
  return newobj;
};

class SingleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeArrlist: [], //改变请求回来的列表数据
      score: 0, //统计分数
      scoreArr: [], // 分数数组
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.arrayList != this.props.arrayList) {
      this._handleBtn(this.props.arrayList);
      let scoreArrlength = this.props.arrayList.length;
      let arr = [];
      for (let i = 0; i < scoreArrlength; i++) {
        arr.push({ score: 0 });
      }
      this.setState({ scoreArr: arr });
    }
  }

  // 点击选择评分
  _checkedBtnStatu = (arrayListIndex, listIndex, childIndex) => {
    this.state.changeArrlist[arrayListIndex].children[listIndex][
      childIndex
    ].checked = true;
    this.state.changeArrlist[arrayListIndex].children.map((item, index) => {
      if (index !== listIndex) {
        item.map((childItem, id) => {
          childItem.checked = false;
        });
      }
    });
    this.state.changeArrlist[arrayListIndex].children[listIndex].map(
      (item, index) => {
        if (index != childIndex) {
          item.checked = false;
        }
      }
    );
    this.setState({ changeArrlist: this.state.changeArrlist }, () => {
      this._calculation(arrayListIndex, listIndex, childIndex);
    });
  };

  // 计算评分
  _calculation = (arrayListIndex, listIndex, childIndex) => {
    let changelist = this.state.changeArrlist;
    let scoreArr = this.state.scoreArr;
    let getScore =
      changelist[arrayListIndex].children[listIndex][childIndex].score;
    scoreArr.splice(arrayListIndex, 1, { score: getScore });
    let fenshu = 0;
    for (let i = 0; i < scoreArr.length; i++) {
      fenshu += scoreArr[i].score;
    }
    this.setState({ score: fenshu });
  };
  // 处理按钮
  _handleBtn = (ThisArrayList) => {
    console.log("ThisArrayList==", ThisArrayList);
    let rowNumber = this.props.rowNumber || 3;
    let arr = deepCopy(ThisArrayList);
    arr.map((item, index) => {
      let a = [];
      let b = [];
      let listArr = item.children;
      for (let i = 0; i < listArr.length; i++) {
        if ((i + 1) % rowNumber == 0) {
          b.push(listArr[i]);
          a.push(b);
          b = [];
        } else if (listArr.length - 1 == i) {
          b.push(listArr[i]);
          a.push(b);
        } else {
          b.push(listArr[i]);
        }
        arr[index].children = a;
      }
    });
    this.setState({ changeArrlist: arr });
  };

  // 提交处理数据
  _submitData = (list) => {
    let newList = deepCopy(list);
    for (let i = 0; i < newList.length; i++) {
      let children = newList[i].children;
      let arr = [];
      for (let j = 0; j < children.length; j++) {
        arr.push(...children[j]);
      }
      newList[i].children = arr;
    }
    this.props.sureSubmit
      ? this.props.sureSubmit(newList, this.state.score)
      : null;
    Alert.alert(`总分为${this.state.score}`);
  };

  // 提交的时候对数据做出要选择等级的判断验证
  _verificationData = () => {
    let changelist = this.state.changeArrlist;
    for (let i = 0; i < changelist.length; i++) {
      let children = changelist[i].children;
      if (children[0][0].checked === undefined) {
        Alert.alert(`请选择${changelist[i].item}等级`);
        return;
      }
    }
    this._submitData(this.state.changeArrlist);
  };

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.box}>
          {this.state.changeArrlist.map((item, arrayListIndex) => {
            return (
              <View key={arrayListIndex} style={styles.itemBox}>
                <Text style={styles.itemTitle}>
                  {arrayListIndex + 1}.{item.item}
                </Text>
                <View>
                  {item.children.map((listItem, listIndex) => {
                    return (
                      <View style={{ flexDirection: "row" }} key={listIndex}>
                        {listItem.map((itemChild, childIndex) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                this._checkedBtnStatu(
                                  arrayListIndex,
                                  listIndex,
                                  childIndex
                                );
                              }}
                              key={childIndex}
                              style={[
                                itemChild.checked
                                  ? this.props.selectBtn
                                    ? this.props.selectBtn
                                    : styles.selectBtn
                                  : this.props.defaultBtn
                                  ? this.props.defaultBtn
                                  : styles.defaultBtn,
                              ]}
                            >
                              <Text
                                style={
                                  itemChild.checked
                                    ? this.props.selectBtnText
                                      ? this.props.selectBtnText
                                      : styles.selectBtnText
                                    : this.props.defautlBtnText
                                    ? this.props.defautlBtnText
                                    : styles.defautlBtnText
                                }
                              >
                                {itemChild?.item}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.bottomBtnBox}>
          <TouchableOpacity
            onPress={() => {
              this._verificationData();
            }}
            style={styles.bottomBtn}
          >
            <Text style={styles.bottomText}>
              提交 （总分:{this.state.score}）
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SingleChoice.propTypes = {
  arrayList: PropTypes.arr, // 要渲染的数组
  rowNumber: PropTypes.number, // 一行要渲染几个按钮
  sureSubmit: PropTypes.func, // 返回数组和总分数
};

const styles = StyleSheet.create({
  page: { flex: 1, position: "relative" },
  box: {
    backgroundColor: "#FFFFFF",
    marginTop: PxToDp(10),
    paddingHorizontal: PxToDp(12),
    paddingVertical: PxToDp(10),
    flexDirection: "column",
  },
  itemBox: {
    flexDirection: "column",
    marginBottom: PxToDp(25),
  },
  itemTitle: {
    fontSize: PxToDp(16),
    fontWeight: "600",
    marginBottom: PxToDp(10),
  },
  btnBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: PxToDp(10),
  },
  defaultBtn: {
    flex: 1,
    marginVertical: PxToDp(5),
    borderRadius: PxToDp(32),
    height: PxToDp(32),
    marginLeft: PxToDp(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },
  selectBtn: {
    flex: 1,
    marginVertical: PxToDp(5),
    borderRadius: PxToDp(32),
    borderColor: "#84E5CB",
    height: PxToDp(32),
    marginLeft: PxToDp(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8FFF9",
    borderWidth: PxToDp(1),
  },
  defautlBtnText: {
    color: "#686E77",
    fontSize: PxToDp(14),
  },
  selectBtnText: {
    fontSize: PxToDp(14),
    color: "#00BE8C",
  },
  bottomBtnBox: {
    position: "absolute",
    bottom: PxToDp(40),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBtn: {
    width: "90%",
    backgroundColor: "#0BB989",
    height: PxToDp(40),
    borderRadius: PxToDp(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontSize: PxToDp(16),
    color: "#FFFFFF",
  },
  modalText: {
    width: PxToDp(220),
    marginVertical: PxToDp(10),
    fontSize: PxToDp(15),
    color: "#999999",
    marginBottom: PxToDp(20),
    textAlign: "center",
  },
});

export default SingleChoice;

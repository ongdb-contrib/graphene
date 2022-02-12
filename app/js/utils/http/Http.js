'use strict';

let _dataList = [];
const _dataMap = new Map();

/**
 * @description 从服务器的upload文件夹加载JSON文件
 */
const loadJsonFile = () => {
  $.ajax(
    {
      type: 'GET',
      url: '/ongdb-graphene/main/getJsonFileList',
      contentType: 'application/json',
      success: function (data) {
        _dataList = data;
        data.forEach(dat => {
          _dataMap[dat.id] = dat;
        });
      }
    }
  );
};

/**
 * @param data:JSON数据
 * @description 保存JSON文件到服务器的upload文件夹
 */
const saveJsonFile = (data) => {
  $.ajax(
    {
      type: 'POST',
      url: '/ongdb-graphene/main/saveJsonFile',
      contentType: 'application/json',
      data: JSON.stringify([data]),
      dataType: 'json',
      success: function (data) {
        console.log(data);
      }
    }
  );
};

/**
 * @param label:JSON FILE文件
 * @param id:根据ID删除JSON FILE文件
 * @description 删除JsonFile节点
 */
const deleteNodeByLabelWithFieldID = (label, id) => {
  const para = {
    label: label,
    id: id
  };
  $.ajax(
    {
      type: 'POST',
      url: '/ongdb-graphene/main/deleteNodeByLabelWithFieldID',
      contentType: 'application/json',
      data: JSON.stringify(para),
      dataType: 'json',
      success: function (data) {
        console.log(data);
      }
    }
    );
};

const Http = {
  /**
  * @description 读取服务器建模JSON文件到内存【多人协作分享建模文件】
  */
  loadJsonFileList: () => {
    // data list已经有数据则使用异步请求 async=false 同步, 默认异步
    $.ajaxSettings.async = _dataList.length > 1;
    loadJsonFile();
  },

  /**
  * @description 读取服务器建模JSON文件到内存【多人协作分享建模文件】
  */
  refreshJsonFileList: () => {
    // data list已经有数据则使用异步请求 async=false 同步, 默认异步
    $.ajaxSettings.async = false;
    loadJsonFile();
  },

  /**
  * @description 读取服务器建模JSON文件【多人协作分享建模文件】
  */
  getJsonDataList: () => {
    return _dataList;
  },

  /**
  * @description 读取服务器建模JSON文件【多人协作分享建模文件】
  */
  getJsonDataMap: () => {
    return _dataMap;
  },

  /**
  * @param data:当前正在操作的数据
  * @param fileName:设置的JSON文件名与data中name为同一字段
  * @description 上传JSON文件
  */
  uploadJsonFile: (data, fileName) => {
    if (fileName === null || fileName.replace(' ', '') === '') {
      alert('File name cannot be empty!!!');
    } else {
      saveJsonFile(data);
    }
  },

  /**
  * @param id:根据ID删除JSON FILE文件
  * @description 上传JSON文件
  */
  deleteJsonFile: (id) => {
    deleteNodeByLabelWithFieldID('JsonFile', id);
  }
};

export default Http;

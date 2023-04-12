'use strict';

/**
 *
 * @param {string} httpUrl:HTTP请求地址
 * @param {string} username:访问用户
 * @param {string} password:访问密码
 * @param {string} graphDatabaseType:数据库类型
 * @param {{data: {nodes: Array, edges: Array}}} dataToSave:JSON格式的请求参数
 * @returns {JSONObject}
 */
function wrap(httpUrl, username, password, graphDatabaseType, dataToSave) {
    console.log(graphDatabaseType);
}

export default wrap;

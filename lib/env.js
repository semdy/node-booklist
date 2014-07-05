/**
 * 不同模式下的配置
 */

var environment = require("../config/env.json");

exports.config = function() {
    var nodeEnv = process.argv[2] || "dev";
    if (nodeEnv !== "prd" || nodeEnv !== "dev") nodeEnv = "dev";
    return environment[nodeEnv];
}
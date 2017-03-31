var fs = require('fs');
var path = require('path');
var config = require('../config');
var os = require('os');
var platform = os.platform();
var execSync = require('child_process').execSync;

var apps = config.apps;
var appsPath = path.join(__dirname, '../fakeApps');
if (!fs.existsSync(path.join(__dirname, '../fakeApps'))) {
    fs.mkdirSync(appsPath);
}


/*
 * 移动目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
function move(src, dst) {
    if (platform !== 'win32') {
        execSync('mv -f ' + src + ' ' + dst);
    }
    else {
        execSync('move /y ' + src.replace(/\//g, '\\') + ' ' + dst.replace(/\//g, '\\'));
    }
}

function linkFile(src, target) {
    if (platform !== 'win32') {
        execSync('ln -s ' + src + ' ' + target);
    }
    else {
        execSync('mklink /J ' + target.replace(/\//g, '\\') + ' ' + src.replace(/\//g, '\\'));
    }
}

for (var app in apps) {
    if (apps.hasOwnProperty(app)) {
        var src = apps[app];
        if (src) {
            src = path.join(process.cwd(), src);
            var dst = appsPath + '/' + app;
            if (!fs.existsSync(dst)) {
                move(src, dst);
                linkFile(dst, src);
            }
        }
    }
}
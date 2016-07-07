'use strict';

const idle = require('./build/Release/osIdleTimer');

var _osIdleTimer = new OSIdleTimer();

function OSIdleTimer() {
    this._handles = [];
}

OSIdleTimer.prototype.set = function(callback, idleTime_ms) {

    // Timeout callback
    function _callback(handle) {
        clearTimeout(handle.timeoutObject);

        var diff = handle.idleTime_ms - idle.getIdleTime_ms();
        if (diff <= 0) {
            callback(handle.idleTime_ms);
        } else {
            handle.timeoutObject = setTimeout(_callback, diff, handle);
            //console.log('timeout: ' + diff);
        }
    }

    var handle = {};
    handle.timeoutObject = setTimeout(_callback, idleTime_ms, handle);
    handle.idleTime_ms = idleTime_ms;
    handle.callback = callback;
    this._handles.push(handle);

    this._addHandle(handle);

    return handle;
}

OSIdleTimer.prototype._addHandle = function(handle) {
    this._handles.push(handle);
}

OSIdleTimer.prototype._removeHandle = function(handle) {
    var length = this._handles.length;
    for (var i = 0; i < length; i++) {
        if (handle === this._handles[i]) {
            this._handles.splice(i, 1);
            break;
        }
    }
}

OSIdleTimer.prototype.clear = function(handle) {
    var length = this._handles.length;
    for ( var i = 0; i < length; i++ ) {
        if (handle === this._handles[i]) {
            this._handles.splice(i, 1);
            clearTimeout(handle.timeoutObject);
        }
    }
}

OSIdleTimer.prototype.clearAll = function() {
    var length = this._handles.length;
    for (var i = 0; i < length; i++) {
        var handle = this._handles.pop();
        if (handle.timeoutObject !== undefined) {
            clearTimeout(handle.timeoutObject);
        }
    }
}

exports.getIdleTime_ms = function() {
    return idle.getIdleTime_ms();
}

exports.setIdleTimer = function(callback, idleTime_ms) {
    return _osIdleTimer.set(callback, idleTime_ms);
}

exports.clearIdleTimer = function(handle) {
    _osIdleTimer.clear(handle);
}

exports.clearIdleTimers = function() {
    _osIdleTimer.clearAll();
}
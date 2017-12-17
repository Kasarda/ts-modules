/**! @license
  * worker.ts
  *
  * This source code is licensed under the GNU GENERAL PUBLIC LICENSE found in the
  * LICENSE file in the root directory of this source tree.
  *
  * Copyright (c) 2017-Present, Filip Kasarda
  *
  */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebWorker = /** @class */ (function () {
        function WebWorker(worker) {
            if (worker === void 0) { worker = self; }
            this.terminated = false;
            this.sended = [];
            this.readed = [];
            this.worker = worker === self ? worker : new worker;
        }
        WebWorker.prototype.send = function (name, data) {
            this.worker.postMessage({ name: name, data: data });
            this.sended.push(name);
            return this;
        };
        WebWorker.prototype.read = function (name, callback) {
            var scope = this;
            this.worker.addEventListener('message', function (event) {
                if (name === event.data.name) {
                    callback.call(this, event.data.data, event);
                    scope.readed.push(name);
                }
            });
            return this;
        };
        WebWorker.prototype.failed = function (listener) {
            this.worker.addEventListener('error', listener);
            return this;
        };
        WebWorker.prototype.terminate = function () {
            if (this.worker.terminate) {
                this.worker.terminate();
                this.terminated = true;
            }
            return this;
        };
        return WebWorker;
    }());
    exports.WebWorker = WebWorker;
});

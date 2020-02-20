/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as gax from 'google-gax';
import {Descriptors, ClientOptions} from 'google-gax';
import * as path from 'path';
import * as gapicConfig from './iam_policy_service_client_config.json';
import * as packagejson from '../package.json';
import {ProjectIdCallback} from 'google-auth-library';
const version = packagejson.version;

export class IamClient {
  private _descriptors: Descriptors = {page: {}, stream: {}, longrunning: {}};
  private _innerApiCalls: {[name: string]: Function} = {};
  private _terminated = false;
  // tslint:disable-next-line no-any
  auth: any;

  setupIamClient(opts?: ClientOptions) {
    // Ensure that options include the service address and port.
    const staticMembers = this.constructor as typeof IamClient;
    const servicePath =
      opts && opts.servicePath
        ? opts.servicePath
        : opts && opts.apiEndpoint
        ? opts.apiEndpoint
        : staticMembers.servicePath;
    const port = opts && opts.port ? opts.port : staticMembers.port;

    if (!opts) {
      opts = {servicePath, port};
    }
    opts.servicePath = opts.servicePath || servicePath;
    opts.port = opts.port || port;
    opts.clientConfig = opts.clientConfig || {};

    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      opts.fallback = true;
    }
    const gaxModule = !isBrowser && opts.fallback ? gax.fallback : gax;

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = (this.constructor as typeof IamClient).scopes;
    const gaxGrpc = new gaxModule.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth as gax.GoogleAuth;
    const clientHeader = [`gax/${gaxModule.version}`, `gapic/${version}`];
    if (typeof process !== 'undefined' && 'versions' in process) {
      clientHeader.push(`gl-node/${process.versions.node}`);
    } else {
      clientHeader.push(`gl-web/${gaxModule.version}`);
    }
    if (!opts.fallback) {
      clientHeader.push(`grpc/${gaxGrpc.grpcVersion}`);
    }
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }
    const nodejsProtoPath = path.join(__dirname, '..', 'protos', 'protos.json');

    const protos = gaxGrpc.loadProto(
      opts.fallback ? require('../protos/protos.json') : nodejsProtoPath
    );
    // Put together the default options sent with requests.
    const defaults = gaxGrpc.constructSettings(
      'google.iam.v1.IAMPolicy',
      gapicConfig as gax.ClientConfig,
      opts!.clientConfig || {},
      {'x-goog-api-client': clientHeader.join(' ')}
    );
    // Put together the "service stub" for
    // google.iam.v1.IAMPolicy.
    const iamPolicyStub = gaxGrpc.createStub(
      opts.fallback
        ? (protos as protobuf.Root).lookupService('google.iam.v1.IAMPolicy')
        : // tslint:disable-next-line no-any
          (protos as any).google.iam.v1.IAMPolicy,
      opts
    ) as Promise<{[method: string]: Function}>;
    this._innerApiCalls = {};
    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    const iamPolicyStubMethods = [
      'getIamPolicy',
      'setIamPolicy',
      'testIamPermissions',
    ];

    for (const methodName of iamPolicyStubMethods) {
      // const test = iamPolicyStub.then(stub => {console.warn('testing stub', stub)})
      const innerCallPromise = iamPolicyStub.then(
        stub => (...args: Array<{}>) => {
          if (this._terminated) {
            return Promise.reject('The client has already been closed.');
          }
          return stub[methodName].apply(stub, args);
        },
        (err: Error | null | undefined) => () => {
          throw err;
        }
      );
      this._innerApiCalls[methodName] = gaxModule.createApiCall(
        innerCallPromise,
        defaults[methodName],
        this._descriptors.page[methodName]
      );
    }
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
    return 'cloudkms.googleapis.com';
  }

  /**
   * The DNS address for this API service - same as servicePath(),
   * exists for compatibility reasons.
   */
  static get apiEndpoint() {
    return 'cloudkms.googleapis.com';
  }

  /**
   * The port for this API service.
   */
  static get port() {
    return 443;
  }
  /**
   * The scopes needed to make gRPC calls for every method defined
   * in this service.
   */
  static get scopes() {
    return [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/cloudkms',
    ];
  }
  /**
   * Return the project ID used by this class.
   * @param {function(Error, string)} callback - the callback to
   *   be called with the current project Id.
   */
  getProjectId(callback: ProjectIdCallback) {
    return this.auth.getProjectId(callback);
  }

  getIamPolicy(
    request: {resource: string},
    options: gax.CallOptions,
    callback: {}
  ) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.getIamPolicy(request, options, callback);
  }

  setIamPolicy(
    request: {resource: string},
    options: gax.CallOptions,
    callback: {}
  ) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.setIamPolicy(request, options, callback);
  }
  testIamPermissions(
    request: {resource: string},
    options: gax.CallOptions,
    callback: {}
  ) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      resource: request.resource,
    });

    return this._innerApiCalls.testIamPermissions(request, options, callback);
  }
}
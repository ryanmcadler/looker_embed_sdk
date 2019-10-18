/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { EmbedBuilder } from "./embed_builder";
import { Chatty, ChattyHost, ChattyHostBuilder } from "@looker/chatty";

/**
 * Wrapper for Looker embedded content. Provides a mechanism for creating the embedded content element,
 * and for establishing two-way communication between the parent window and the embedded content.
 */

export class EmbedClient<T> {
  _hostBuilder: ChattyHostBuilder | null = null;
  _host: ChattyHost | null = null;
  _connection: Promise<T> | null = null;

  /**
   * @hidden
   */

  constructor(private _builder: EmbedBuilder<T>) {}

  /**
   * Returns a promise that resolves to a client that can be used to send messages to the
   * embedded content.
   */

  get connection() {
    return this._connection;
  }

  /**
   * Indicates whether two way communication has successfully been established with the embedded content.
   */

  get isConnected() {
    return !!this._connection;
  }

  private async createIframe(url: string) {
    this._hostBuilder = Chatty.createHost(url);
    for (const eventType in this._builder.handlers) {
      for (const handler of this._builder.handlers[eventType]) {
        this._hostBuilder.on(eventType, handler);
      }
    }
    for (const attr of this._builder.sandboxAttrs) {
      this._hostBuilder.withSandboxAttribute(attr);
    }

    this._host = this._hostBuilder
      // tslint:disable-next-line:deprecation
      .frameBorder(this._builder.frameBorder)
      .withTargetOrigin(`https://${this._builder.apiHost}`)
      .appendTo(this._builder.el)
      .build();

    this._host.iframe.classList.add(...this._builder.classNames);

    debugger;

    return this._host.connect().then(host => {
      debugger;
      return new this._builder.clientConstructor(host);
    });
  }

  private async createUrl() {
    const src = this._builder.embedUrl;
    if (!this._builder.authUrl) return src;

    const url = `${this._builder.authUrl}?src=${encodeURIComponent(src)}`;

    return new Promise<string>(async (resolve, reject) => {
      // compute signature
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).url);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  /**
   * Establish two way communication with embedded content. Returns a promise that resolves to a
   * client that can be used to send messages to the embedded content.
   */

  async connect(): Promise<T> {
    if (this._connection) return this._connection;

    if (this._builder.url) {
      this._connection = this.createIframe(this._builder.url);
    } else {
      this._connection = this.createUrl().then(async url =>
        this.createIframe(url)
      );
    }
    return this._connection;
  }
}

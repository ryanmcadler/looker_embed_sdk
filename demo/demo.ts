import {
  LookerEmbedSDK,
  LookerEmbedLook,
  LookerEmbedDashboard
} from "../src/index";

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

import { lookerHost, dashboardId } from "./demo_config";

LookerEmbedSDK.init(lookerHost, "/auth");

/*
const setupDashboard = (dashboard: LookerEmbedDashboard) => {
  debugger;
  dashboard.updateFilters({
    "Location": "1-800 Self-Storage.com"
  });
};
*/

const updateState = (selector: string, state: string) => {
  debugger;
  const dashboardState = document.querySelector(selector);
  if (dashboardState) {
    dashboardState.textContent = state;
  }
};

const canceller = (event: any) => {
  updateState("#dashboard-state", `${event.label} clicked`);
  return { cancel: !event.modal };
};

const setupDashboard = (dashboard: LookerEmbedDashboard) => {
  debugger;

  /*
  document.querySelector('#run').addEventListener('click', () => {
    dashboard.send('dashboard:run')
  });
  debugger;

   */
  console.log("Promised resolved??");
};

document.addEventListener("DOMContentLoaded", function() {
  if (dashboardId) {
    let dashboard = LookerEmbedSDK.createDashboardWithId(dashboardId)
      .appendTo("#dashboard")
      .withClassName("looker-embed")
      .build();

    let connected = dashboard.connect();

    debugger;

    /*
    dashboard.then(setupDashboard).finally(() => {
      debugger;
    });
    */

    /*
      .then(setupDashboard)
      .catch((error: Error) => {
        console.error("Connection error", error);
      })
      .finally(() => {
        console.log("WTF");
      });
      */
  } else {
    document.querySelector<HTMLDivElement>("#demo-dashboard")!.style.display =
      "none";
  }
});

(() => {
  const temperatureElement = document.getElementById("temperature-value");
  const precipitation10mElement = document.getElementById("precipitation-10m-value");
  const precipitation1hElement = document.getElementById("precipitation-1h-value");
  const precipitation3hElement = document.getElementById("precipitation-3h-value");
  const precipitation24hElement = document.getElementById("precipitation-24h-value");
  const sun10mElement = document.getElementById("sun-10m-value");
  const sun1hElement = document.getElementById("sun-1h-value");
  const windDirectionElement = document.getElementById("wind-direction-value");
  const windElement = document.getElementById("wind-value");
  const latestTimeElement = document.getElementById("latest-time-value");

  // 最終更新日時
  let latestTime = null;

  function getAmedas() {
    (() => {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", "https://www.jma.go.jp/bosai/amedas/data/latest_time.txt");
        request.onload = () => resolve(request.responseText);
        request.onerror = () => reject(request.statusText);
        request.send();
      });
    })()
    .then((latestTimeText) => {
      // console.log("最終更新日時 =", latestTimeText);
      return new Promise((resolve, reject) => {
        if (isNaN(Date.parse(latestTimeText))) {
          reject("latest_time.txt の内容が日付ではありませんでした。");
        } else {
          latestTime = new Date(latestTimeText);
          let month = (latestTime.getMonth() + 1).toString().padStart(2, "0");
          let day = latestTime.getDate().toString().padStart(2, "0");
          // JSON は3時間ごとに分かれているので、直近の3で割れる時を求める
          let hour = (Math.trunc(latestTime.getHours() / 3) * 3).toString().padStart(2, "0");
          resolve(`${latestTime.getFullYear()}${month}${day}_${hour}.json`);
        }
      });
    })
    .then((jsonName) => {
      // console.log("JSON名 =", jsonName);
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", `https://www.jma.go.jp/bosai/amedas/data/point/44116/${jsonName}`);
        request.responseType = "json";
        request.onload = () => resolve(request.response);
        request.onerror = () => reject(request.statusText);
        request.send();
      });
    })
    .then((observationData) => {
      // console.log("観測データ =", observationData);
      let key = latestTime.getFullYear().toString();
      key += (latestTime.getMonth() + 1).toString().padStart(2, "0");
      key += latestTime.getDate().toString().padStart(2, "0");
      key += latestTime.getHours().toString().padStart(2, "0");
      key += latestTime.getMinutes().toString().padStart(2, "0");
      key += latestTime.getSeconds().toString().padStart(2, "0");
      if (key in observationData) {
        if ("temp" in observationData[key]) {
          if (0 in observationData[key]["temp"]) {
            if (observationData[key]["temp"][0] !== null) {
              temperatureElement.innerText = observationData[key]["temp"][0].toFixed(1);
            }
          }
        }
        if ("precipitation10m" in observationData[key]) {
          if (0 in observationData[key]["precipitation10m"]) {
            if (observationData[key]["precipitation10m"][0] !== null) {
              precipitation10mElement.innerText = observationData[key]["precipitation10m"][0].toFixed(1);
            }
          }
        }
        if ("precipitation1h" in observationData[key]) {
          if (0 in observationData[key]["precipitation1h"]) {
            if (observationData[key]["precipitation1h"][0] !== null) {
              precipitation1hElement.innerText = observationData[key]["precipitation1h"][0].toFixed(1);
            }
          }
        }
        if ("precipitation3h" in observationData[key]) {
          if (0 in observationData[key]["precipitation3h"]) {
            if (observationData[key]["precipitation3h"][0] !== null) {
              precipitation3hElement.innerText = observationData[key]["precipitation3h"][0].toFixed(1);
            }
          }
        }
        if ("precipitation24h" in observationData[key]) {
          if (0 in observationData[key]["precipitation24h"]) {
            if (observationData[key]["precipitation24h"][0] !== null) {
              precipitation24hElement.innerText = observationData[key]["precipitation24h"][0].toFixed(1);
            }
          }
        }
        if ("sun10m" in observationData[key]) {
          if (0 in observationData[key]["sun10m"]) {
            if (observationData[key]["sun10m"][0] !== null) {
              sun10mElement.innerText = observationData[key]["sun10m"][0];
            }
          }
        }
        if ("sun1h" in observationData[key]) {
          if (0 in observationData[key]["sun1h"]) {
            if (observationData[key]["sun1h"][0] !== null) {
              sun1hElement.innerText = observationData[key]["sun1h"][0].toFixed(1);
            }
          }
        }
        if ("windDirection" in observationData[key]) {
          if (0 in observationData[key]["windDirection"]) {
            if (observationData[key]["windDirection"][0] !== null) {
              windDirectionElement.innerText = observationData[key]["windDirection"][0];
            }
          }
        }
        if ("wind" in observationData[key]) {
          if (0 in observationData[key]["wind"]) {
            if (observationData[key]["wind"][0] !== null) {
              windElement.innerText = observationData[key]["wind"][0].toFixed(1);
            }
          }
        }
        let d = latestTime.getFullYear().toString();
        d += "/" + (latestTime.getMonth() + 1).toString().padStart(2, "0");
        d += "/" + latestTime.getDate().toString().padStart(2, "0");
        d += " " + latestTime.getHours().toString().padStart(2, "0");
        d += ":" + latestTime.getMinutes().toString().padStart(2, "0");
        latestTimeElement.innerText = d;
      }
    })
    .catch((errorText) => {
      console.log("エラー発生 ", errorText);
    });
    setTimeout(getAmedas, 1000 * 120);
  }
  getAmedas();
})();
